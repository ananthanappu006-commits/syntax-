/**
 * SmartCampus Mobile IoT Smart Switch & Appliance Control Routes
 * 
 * Key Feature:
 * POST /api/v1/iot/switch/toggle
 * Verifies user coordinates against room geofence, enforces role-based access,
 * and publishes a QoS 1 MQTT packet to the hardware switch relay.
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { verifyGeofence } = require('../utils/geoUtils');
const mqttService = require('../services/mqttService');

// Optional Prisma client initialization
let prisma = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  prisma = null;
}

// In-Memory Fallback Room Catalog with Geocoordinates for resilient execution
const ROOM_CATALOG = {
  'rm_204': {
    id: 'rm_204',
    name: 'Lecture Room 204',
    building: 'Main Block',
    type: 'CLASSROOM',
    latitude: 10.0285,
    longitude: 76.3288,
    geofenceRadiusMeters: 25.0,
    allowedRoles: ['FACULTY', 'ADMIN', 'MAINTENANCE']
  },
  'rm_301': {
    id: 'rm_301',
    name: 'Smart Seminar Hall 301',
    building: 'Tech Tower',
    type: 'AUDITORIUM',
    latitude: 10.0292,
    longitude: 76.3295,
    geofenceRadiusMeters: 40.0,
    allowedRoles: ['FACULTY', 'ADMIN']
  },
  'lab_eee1': {
    id: 'lab_eee1',
    name: 'EEE Power Systems Lab 1',
    building: 'Main Block',
    type: 'LABORATORY',
    latitude: 10.0286,
    longitude: 76.3287,
    geofenceRadiusMeters: 30.0,
    allowedRoles: ['FACULTY', 'ADMIN', 'MAINTENANCE']
  },
  'dorm_d204': {
    id: 'dorm_d204',
    name: 'Hostel Block B - Dorm Room 204',
    building: 'Hostel Block B',
    type: 'DORMITORY',
    latitude: 10.0310,
    longitude: 76.3312,
    geofenceRadiusMeters: 15.0,
    allowedRoles: ['STUDENT', 'ADMIN']
  },
  'infirmary_ward': {
    id: 'infirmary_ward',
    name: 'Campus Infirmary - Recovery Ward A',
    building: 'Health Center',
    type: 'INFIRMARY',
    latitude: 10.0278,
    longitude: 76.3275,
    geofenceRadiusMeters: 20.0,
    allowedRoles: ['STUDENT', 'FACULTY', 'ADMIN', 'MAINTENANCE']
  }
};

/**
 * ------------------------------------------------------------------------------
 * FEATURE 2: IoT Switch Control with Geofence & RBAC Verification
 * ------------------------------------------------------------------------------
 * Endpoint: POST /api/v1/iot/switch/toggle
 * Body:
 * {
 *   "roomId": "rm_204",
 *   "deviceId": "dev_204_l1",
 *   "targetState": true,
 *   "dimmingLevel": 80,
 *   "speedLevel": null,
 *   "userCoordinates": {
 *     "latitude": 10.0284,
 *     "longitude": 76.3289
 *   }
 * }
 */
router.post('/switch/toggle', authenticateToken, async (req, res) => {
  try {
    const { roomId, deviceId, targetState, dimmingLevel, speedLevel, userCoordinates } = req.body;

    // 1. Data Validation
    if (!roomId || !deviceId || typeof targetState !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'roomId, deviceId, and boolean targetState are required.'
      });
    }

    if (!userCoordinates || typeof userCoordinates.latitude !== 'number' || typeof userCoordinates.longitude !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Geofence Error',
        message: 'Valid GPS userCoordinates (latitude & longitude) are mandatory for switch control.'
      });
    }

    // 2. Room Resolution (Database or In-Memory Catalog)
    let room = null;
    if (prisma) {
      room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { devices: true }
      });
    }
    if (!room) {
      room = ROOM_CATALOG[roomId];
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Designated campus space '${roomId}' not found in registry.`
      });
    }

    const user = req.user;

    // 3. Role-Based Access Control (RBAC) Check
    const isAdmin = user.role === 'ADMIN';
    const isAuthorizedRole = room.allowedRoles.includes(user.role);

    if (!isAdmin && !isAuthorizedRole) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: RBAC Policy Violation',
        message: `User role '${user.role}' is not authorized to actuate appliances in '${room.name}'. Allowed roles: ${room.allowedRoles.join(', ')}.`
      });
    }

    // 4. Geofence Boundary Verification (Haversine Formula)
    const geofenceResult = verifyGeofence(
      userCoordinates.latitude,
      userCoordinates.longitude,
      room.latitude,
      room.longitude,
      room.geofenceRadiusMeters
    );

    // Facility Admins have remote override rights; all other users must be within geofence
    if (!isAdmin && !geofenceResult.isWithinGeofence) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Geofence Verification Failed',
        message: `Proximity check failed. You are ${geofenceResult.distanceMeters}m away from ${room.name}. Maximum allowed boundary radius is ${room.geofenceRadiusMeters}m.`,
        telemetry: {
          currentDistanceMeters: geofenceResult.distanceMeters,
          requiredRadiusMeters: room.geofenceRadiusMeters,
          roomCoordinates: { latitude: room.latitude, longitude: room.longitude }
        }
      });
    }

    // 5. Build MQTT Topic & Actuation Payload
    const buildingSlug = room.building.toLowerCase().replace(/\s+/g, '_');
    const mqttTopic = `campus/${buildingSlug}/room/${roomId}/device/${deviceId}/command`;

    const mqttPayload = {
      deviceId,
      roomId,
      action: 'SET_STATE',
      state: targetState ? 'ON' : 'OFF',
      dimming: dimmingLevel !== undefined ? dimmingLevel : (targetState ? 100 : 0),
      speed: speedLevel || null,
      triggeredBy: {
        userId: user.id,
        userName: user.name,
        userRole: user.role
      },
      geofence: {
        verified: true,
        distanceMeters: geofenceResult.distanceMeters
      }
    };

    // 6. Publish to Hardware Relay via MQTT Broker (QoS 1)
    const mqttResult = await mqttService.publishSwitchCommand(mqttTopic, mqttPayload);

    // 7. Persist State Log in Database (if available)
    if (prisma) {
      await prisma.deviceStateLog.create({
        data: {
          deviceId,
          userId: user.id,
          previousState: !targetState,
          newState: targetState,
          triggerSource: 'MOBILE_APP_GEOFENCE'
        }
      });
    }

    // 8. Return Confirmation Response
    return res.status(200).json({
      success: true,
      message: `Appliance '${deviceId}' in ${room.name} toggled ${targetState ? 'ON' : 'OFF'} successfully.`,
      data: {
        roomId,
        deviceId,
        roomName: room.name,
        state: targetState,
        dimming: mqttPayload.dimming,
        speed: mqttPayload.speed,
        mqttTopic,
        mqttPublished: mqttResult.success,
        geofenceAudit: {
          verified: true,
          userDistanceMeters: geofenceResult.distanceMeters,
          thresholdRadiusMeters: room.geofenceRadiusMeters
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[Error: /api/v1/iot/switch/toggle]', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'An error occurred while actuating the smart switch.'
    });
  }
});

/**
 * ------------------------------------------------------------------------------
 * SUPPORTING ENDPOINT: Campus Emergency Evacuation Lighting Override
 * ------------------------------------------------------------------------------
 * Endpoint: POST /api/v1/iot/emergency-override
 */
router.post('/emergency-override', authenticateToken, async (req, res) => {
  try {
    const { overrideActive, reason } = req.body;

    const result = await mqttService.broadcastEmergencyOverride({
      active: !!overrideActive,
      reason: reason || 'Fire alarm sensor trip',
      initiatedBy: req.user.name
    });

    return res.status(200).json({
      success: true,
      message: overrideActive 
        ? '🚨 EMERGENCY OVERRIDE BROADCAST: All campus escape corridor & room lights forced to 100% illumination.' 
        : 'Emergency override cleared. Standard smart scheduling resumed.',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
