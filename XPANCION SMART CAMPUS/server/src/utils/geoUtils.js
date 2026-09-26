/**
 * SmartCampus Geofencing Utilities
 * Calculates accurate geodesic distance between GPS coordinates using the Haversine formula.
 */

const EARTH_RADIUS_METERS = 6371000; // Earth mean radius in meters

/**
 * Calculates geodesic distance between two latitude/longitude points in meters.
 * @param {number} lat1 User latitude
 * @param {number} lon1 User longitude
 * @param {number} lat2 Room latitude
 * @param {number} lon2 Room longitude
 * @returns {number} Distance in meters
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_METERS * c;

  return Number(distance.toFixed(2));
}

/**
 * Verifies whether a coordinate is within a room's geofence boundary.
 * @param {number} userLat 
 * @param {number} userLon 
 * @param {number} roomLat 
 * @param {number} roomLon 
 * @param {number} allowedRadiusMeters 
 * @returns {{ isWithinGeofence: boolean, distanceMeters: number }}
 */
function verifyGeofence(userLat, userLon, roomLat, roomLon, allowedRadiusMeters) {
  const distanceMeters = calculateDistanceMeters(userLat, userLon, roomLat, roomLon);
  return {
    isWithinGeofence: distanceMeters <= allowedRadiusMeters,
    distanceMeters
  };
}

module.exports = {
  calculateDistanceMeters,
  verifyGeofence
};
