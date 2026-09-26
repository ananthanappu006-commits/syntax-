/* ==========================================================================
   SmartCampus Mobile IoT Smart Switch & Appliance Control Center
   Features:
   - Dynamic Geofencing & Timetable Sync (Simulated auto-cutoff on room vacancy)
   - Role-Based Access Control (Faculty: Classrooms/Labs; Students: Dorms; Admin: Master)
   - Real-time Light Dimming (0-100%), BLDC Fan Speeds (1-5), and HVAC Temperature
   - Energy Analytics & Carbon Footprint Telemetry (kW, kWh, Saved CO2 kg)
   - Campus Emergency Evacuation Lighting Override (100% illumination broadcast)
   - Live MQTT Topic & JSON Payload Inspector
   ========================================================================== */

let currentIoTRoomFilter = 'all'; // 'all' | 'classroom' | 'laboratory' | 'dormitory' | 'infirmary'

function renderIoTControlView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  const iot = state.iotData || {};
  const metrics = iot.campusEnergyMetrics || { currentPowerKw: 42.8, todayConsumptionKwh: 318.4, co2SavedKg: 84.6 };
  const geofence = iot.geofenceStatus || {};
  const isEmergencyActive = iot.emergencyOverrideActive || false;

  let rooms = iot.rooms || [];
  if (currentIoTRoomFilter !== 'all') {
    rooms = rooms.filter(r => r.type.toLowerCase() === currentIoTRoomFilter.toLowerCase());
  }

  // Count active devices
  let totalDevices = 0;
  let activeDevices = 0;
  (iot.rooms || []).forEach(r => {
    r.devices.forEach(d => {
      totalDevices++;
      if (d.state) activeDevices++;
    });
  });

  return `
    <div class="view-animate-in">
      <!-- IoT Telemetry & Control Banner -->
      <div class="iot-header-card ${isEmergencyActive ? 'iot-emergency-border' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div class="iot-pulse-icon ${isEmergencyActive ? 'pulse-danger' : ''}">
              ${isEmergencyActive ? '🚨' : '⚡'}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <h2 style="margin: 0; font-size: 1.6rem;">Mobile IoT Smart Switch & Appliance Control</h2>
                <span class="badge ${isEmergencyActive ? 'badge-occupied' : 'badge-available'}">
                  ${isEmergencyActive ? '🚨 EMERGENCY OVERRIDE ACTIVE' : '● MQTT TLS v1.3 CONNECTED'}
                </span>
              </div>
              <p style="margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.88rem;">
                Controlling classroom, lab, dorm, and infirmary lighting, fans, and HVAC via ESP32 microcontrollers & MQTT.
              </p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="window.openIoTArchitectureModal()">
              <span>📡</span> IoT Stack & MQTT Inspector
            </button>
            <button class="btn ${isEmergencyActive ? 'btn-sos' : 'btn-outline'}" onclick="window.toggleEmergencyOverride()">
              <span>${isEmergencyActive ? '⚠️' : '🚨'}</span> ${isEmergencyActive ? 'Reset Emergency Override' : 'Emergency Lighting Override'}
            </button>
          </div>
        </div>

        <!-- Telemetry & Energy Grid Strip -->
        <div class="iot-vitals-strip">
          <div class="iot-vital-chip">
            <span class="vital-label">Active Power Draw</span>
            <span class="vital-val" style="color: var(--primary-light);">${metrics.currentPowerKw} kW</span>
          </div>
          <div class="iot-vital-chip">
            <span class="vital-label">Today's Consumption</span>
            <span class="vital-val">${metrics.todayConsumptionKwh} kWh</span>
          </div>
          <div class="iot-vital-chip">
            <span class="vital-label">Carbon Footprint Saved</span>
            <span class="vital-val" style="color: #34d399;">🌱 ${metrics.co2SavedKg} kg CO₂</span>
          </div>
          <div class="iot-vital-chip">
            <span class="vital-label">Online Appliances</span>
            <span class="vital-val">${activeDevices} / ${totalDevices} ON</span>
          </div>
          <div class="iot-vital-chip">
            <span class="vital-label">Dynamic Geofence Status</span>
            <span class="vital-val" style="color: ${geofence.userInAssignedRoom ? '#34d399' : 'var(--status-pending)'};">
              ${geofence.userInAssignedRoom ? '📍 In Room 204 (14m)' : '🚶 Outside Bounds'}
            </span>
          </div>
        </div>
      </div>

      <!-- Geofence & Timetable Automation Simulator Bar -->
      <div class="card" style="margin: 1.25rem 0; background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(16, 185, 129, 0.05)); border: 1px solid var(--border-card);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.9rem;">
            <span style="font-size: 1.8rem;">🛰️</span>
            <div>
              <h4 style="margin: 0; font-size: 1rem;">Dynamic Geofencing & Academic Timetable Sync Engine</h4>
              <p style="margin: 0.15rem 0 0; font-size: 0.82rem; color: var(--text-secondary);">
                When lecture hours conclude or PIR occupancy sensors detect 0 occupants for >10 mins, the IoT gateway auto-turns OFF all idle circuits.
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-sm btn-outline" onclick="window.simulateGeofenceAutoCutoff('rm_204')">
              <span>🌱</span> Simulate Room 204 Vacancy (Auto-Cutoff)
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="tabs-nav" style="margin-bottom: 1.5rem;">
        <button class="tab-btn ${currentIoTRoomFilter === 'all' ? 'active' : ''}" onclick="window.setIoTRoomFilter('all')">
          All Spaces (${iot.rooms?.length || 0})
        </button>
        <button class="tab-btn ${currentIoTRoomFilter === 'classroom' ? 'active' : ''}" onclick="window.setIoTRoomFilter('classroom')">
          Lecture Halls
        </button>
        <button class="tab-btn ${currentIoTRoomFilter === 'laboratory' ? 'active' : ''}" onclick="window.setIoTRoomFilter('laboratory')">
          Laboratories
        </button>
        <button class="tab-btn ${currentIoTRoomFilter === 'dormitory' ? 'active' : ''}" onclick="window.setIoTRoomFilter('dormitory')">
          Hostel Dorms
        </button>
        <button class="tab-btn ${currentIoTRoomFilter === 'infirmary' ? 'active' : ''}" onclick="window.setIoTRoomFilter('infirmary')">
          Infirmary Recovery Ward
        </button>
      </div>

      <!-- Rooms and Appliance Control Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
        ${rooms.map(room => {
          const userRole = user.role;
          const hasAccess = userRole === 'admin' || 
                            room.accessRoles.includes(userRole) || 
                            (userRole === 'student' && (room.type === 'Dormitory' || room.type === 'Infirmary'));

          return `
            <div class="card iot-room-card" style="border-top: 4px solid ${hasAccess ? 'var(--primary)' : 'var(--border-subtle)'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">
                      ${room.building} &bull; Floor ${room.floor}
                    </span>
                    <span class="badge ${hasAccess ? 'badge-available' : 'badge-occupied'}" style="font-size: 0.68rem;">
                      ${hasAccess ? '🔓 RBAC Authorized' : '🔒 Role Restricted'}
                    </span>
                  </div>
                  <h3 style="margin: 0.25rem 0 0.1rem; font-size: 1.2rem;">${room.name}</h3>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    Type: ${room.type} &bull; Geofence: ${room.geofenceRadiusMeters}m Radius &bull; Authorized: ${room.accessRoles.join(', ')}
                  </div>
                </div>

                <button class="btn btn-xs btn-outline" onclick="window.simulateGeofenceAutoCutoff('${room.id}')" title="Turn all devices OFF in this room">
                  Master Off
                </button>
              </div>

              <!-- Appliance Controls -->
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${room.devices.map(dev => `
                  <div class="iot-device-item ${dev.state ? 'device-on' : 'device-off'}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div style="display: flex; align-items: center; gap: 0.85rem;">
                        <div class="iot-appliance-icon ${dev.state ? 'icon-glow' : ''}">
                          ${dev.type === 'light' ? '💡' : dev.type === 'fan' ? '🌀' : dev.type === 'ac' ? '❄️' : '🔌'}
                        </div>
                        <div>
                          <div style="font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                            ${dev.name}
                            <span style="font-size: 0.72rem; font-weight: 500; color: var(--text-muted);">
                              (${dev.wattage}W)
                            </span>
                          </div>
                          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 0.1rem;">
                            ${dev.type === 'light' 
                              ? `Brightness: <b>${dev.brightness}%</b>` 
                              : dev.type === 'fan' 
                              ? `Fan Speed: <b>${dev.speed ? 'Level ' + dev.speed : 'OFF'}</b>` 
                              : dev.type === 'ac' 
                              ? `Setpoint: <b>${dev.temp}°C</b> &bull; Mode: ${dev.mode.toUpperCase()}`
                              : `Socket Status: <b>${dev.state ? 'ACTIVE' : 'IDLE'}</b>`}
                          </div>
                        </div>
                      </div>

                      <!-- Toggle Switch Button -->
                      <button 
                        class="iot-toggle-btn ${dev.state ? 'btn-active' : ''}" 
                        onclick="window.handleDeviceToggle('${room.id}', '${dev.id}')"
                        title="Click to toggle switch via MQTT"
                      >
                        <span class="toggle-thumb"></span>
                        <span class="toggle-text">${dev.state ? 'ON' : 'OFF'}</span>
                      </button>
                    </div>

                    <!-- Extra Interactive Controls (Dimmer, Speed, Temp) -->
                    ${dev.state && dev.type === 'light' ? `
                      <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-subtle); display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Dimmer:</span>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value="${dev.brightness}" 
                          style="flex: 1; accent-color: var(--primary);" 
                          oninput="window.campusState.setIoTDimmer('${room.id}', '${dev.id}', this.value); window.appRouter.renderCurrentView();"
                        />
                        <span style="font-size: 0.78rem; font-weight: 700; width: 36px; text-align: right;">${dev.brightness}%</span>
                      </div>
                    ` : ''}

                    ${dev.state && dev.type === 'fan' ? `
                      <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">BLDC Speed:</span>
                        <div style="display: flex; gap: 0.35rem;">
                          ${[1, 2, 3, 4, 5].map(spd => `
                            <button 
                              class="btn btn-xs ${dev.speed === spd ? 'btn-primary' : 'btn-outline'}" 
                              style="padding: 0.2rem 0.6rem; font-weight: 700;"
                              onclick="window.campusState.setIoTSpeed('${room.id}', '${dev.id}', ${spd}); window.appRouter.renderCurrentView();"
                            >
                              ${spd}
                            </button>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}

                    ${dev.state && dev.type === 'ac' ? `
                      <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Thermostat:</span>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <button class="btn btn-xs btn-outline" onclick="window.campusState.setIoTACTemp('${room.id}', '${dev.id}', -1); window.appRouter.renderCurrentView();">-</button>
                          <span style="font-size: 0.95rem; font-weight: 800; color: var(--primary-light); min-width: 48px; text-align: center;">${dev.temp}°C</span>
                          <button class="btn btn-xs btn-outline" onclick="window.campusState.setIoTACTemp('${room.id}', '${dev.id}', 1); window.appRouter.renderCurrentView();">+</button>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

// Global Handlers for IoT Control
window.setIoTRoomFilter = function(filter) {
  currentIoTRoomFilter = filter;
  window.appRouter.renderCurrentView();
};

window.handleDeviceToggle = function(roomId, deviceId) {
  const result = window.campusState.toggleIoTSwitch(roomId, deviceId);
  if (result && !result.success) {
    window.showToast(`⛔ ${result.message}`);
  } else if (result && result.success) {
    const d = result.device;
    window.showToast(`MQTT Broadcast: ${d.name} turned ${d.state ? 'ON' : 'OFF'} [QoS 1]`);
    window.appRouter.renderCurrentView();
  }
};

window.toggleEmergencyOverride = function() {
  const active = window.campusState.triggerEmergencyLightingOverride();
  window.appRouter.renderCurrentView();
};

window.simulateGeofenceAutoCutoff = function(roomId) {
  const res = window.campusState.simulateGeofenceExit(roomId);
  if (res) {
    window.appRouter.renderCurrentView();
  }
};

// IoT Architecture & MQTT Inspector Modal
window.openIoTArchitectureModal = function() {
  const html = `
    <div class="modal-backdrop">
      <div class="modal-card" style="max-width: 700px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.4rem;">📡</span>
            <h3 style="margin: 0; font-size: 1.25rem;">IoT Stack Architecture & Live MQTT Monitor</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal()">&times;</button>
        </div>

        <div style="margin-bottom: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
          Overview of hardware microcontrollers, telemetry flow, and MQTT topic payloads used across smart rooms.
        </div>

        <div style="background: var(--bg-surface); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-card); margin-bottom: 1.25rem;">
          <h4 style="margin: 0 0 0.5rem; font-size: 0.95rem; color: var(--primary);">Hardware & Transport Stack</h4>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.82rem; line-height: 1.6; color: var(--text-primary);">
            <li><b>Microcontroller:</b> ESP32-WROOM-32 (Dual Core 240MHz, 2.4GHz Wi-Fi + BLE 4.2, TLS hardware acceleration)</li>
            <li><b>Switch Actuation:</b> Optocoupler-isolated 4-Channel 10A Solid-State / Mechanical Relays</li>
            <li><b>Broker Protocol:</b> MQTT over TLS v1.3 (Port 8883) with QoS 1 acknowledgment</li>
            <li><b>Power Sensing:</b> PZEM-004T / CT Clamps transmitting live voltage, current, and true RMS wattage</li>
          </ul>
        </div>

        <h4 style="margin: 0 0 0.5rem; font-size: 0.95rem;">MQTT Topic Hierarchy Sample</h4>
        <div style="background: #0f172a; color: #38bdf8; font-family: monospace; font-size: 0.78rem; padding: 0.85rem 1rem; border-radius: var(--radius-md); overflow-x: auto; margin-bottom: 1.25rem;">
campus/main_block/room_204/device/dev_204_l1/command   ->   { "state": "ON", "dimming": 100 }
campus/main_block/room_204/device/dev_204_f1/command   ->   { "state": "ON", "speed": 4 }
campus/emergency/override                              ->   { "override": true, "reason": "FIRE_ALARM" }
        </div>

        <h4 style="margin: 0 0 0.5rem; font-size: 0.95rem;">Sample Node.js Backend Dispatch Payload</h4>
        <pre style="background: #0f172a; color: #a5f3fc; font-family: monospace; font-size: 0.78rem; padding: 0.85rem 1rem; border-radius: var(--radius-md); overflow-x: auto; margin: 0;">
{
  "eventId": "evt_iot_89412",
  "timestamp": "${new Date().toISOString()}",
  "roomId": "rm_204",
  "deviceId": "dev_204_l1",
  "action": "TOGGLE",
  "state": true,
  "brightness": 100,
  "initiatedBy": "KASINADH.S",
  "userRole": "student",
  "geofenceVerified": true,
  "distanceMeters": 14.2
}
        </pre>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
          <button class="btn btn-primary" onclick="window.closeModal()">Close Inspector</button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(html);
};
