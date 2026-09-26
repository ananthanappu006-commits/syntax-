/* ==========================================================================
   SmartCampus Health Center, Infirmary & Emergency Response Module
   Features:
   - OPD Token Booking & Live Queue Tracker (Token #MED-XX, circular progress)
   - Medical Pass / Sick Leave Request & Auto-Attendance Excusal Sync
   - Emergency Medical Ambulance / SOS GPS Dispatch
   - Confidential EHR Records & Digital Prescriptions (HIPAA/DPDP Compliant)
   - Dispensary & Pharmacy Real-Time Stock Availability Tracker
   - Campus Doctor / Staff Management Workspace
   ========================================================================== */

let currentHealthTab = 'queue'; // 'queue' | 'leave' | 'ehr' | 'pharmacy' | 'ambulance'
let pharmacySearchQuery = '';

function renderHealthView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  const health = state.healthData || {};
  const isDoctorOrStaff = user.role === 'faculty' || user.role === 'admin' || user.role === 'security';
  const myAppointments = (health.appointments || []).filter(a => a.studentName === user.name || isDoctorOrStaff);
  const myLeaves = (health.medicalLeaves || []).filter(l => l.studentName === user.name || isDoctorOrStaff);
  const activeServing = health.activeTokenServing || 11;

  // Filter pharmacy inventory
  const inventory = (health.pharmacyInventory || []).filter(item => {
    if (!pharmacySearchQuery) return true;
    return item.name.toLowerCase().includes(pharmacySearchQuery.toLowerCase()) ||
           item.category.toLowerCase().includes(pharmacySearchQuery.toLowerCase());
  });

  return `
    <div class="view-animate-in">
      <!-- Health Header Banner -->
      <div class="health-header-card">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div class="health-pulse-icon">🏥</div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <h2 style="margin: 0; font-size: 1.6rem;">Campus Health Center & Infirmary</h2>
                <span class="badge badge-available"><span class="badge-dot"></span> OPD LIVE</span>
              </div>
              <p style="margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.88rem;">
                24/7 Primary Care, Doctor Consultations, EHR Records, and Digital Medical Leave Sync.
              </p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-sos" onclick="window.openMedicalAmbulanceModal()" style="padding: 0.65rem 1.15rem; font-weight: 700;">
              <span>🚑</span> AMBULANCE SOS
            </button>
            <button class="btn btn-primary" onclick="window.openBookHealthAppointmentModal()">
              <span>🩺</span> Book OPD Token
            </button>
          </div>
        </div>

        <!-- Quick Telemetry Bar -->
        <div class="health-vitals-strip">
          <div class="health-vital-chip">
            <span class="vital-label">Current Token Serving</span>
            <span class="vital-val" style="color: var(--primary-light);">#MED-${activeServing}</span>
          </div>
          <div class="health-vital-chip">
            <span class="vital-label">Duty Doctors Active</span>
            <span class="vital-val">${(health.doctors || []).filter(d => d.status === 'available').length} Available</span>
          </div>
          <div class="health-vital-chip">
            <span class="vital-label">Campus Ambulance</span>
            <span class="vital-val" style="color: ${health.ambulanceDispatch?.status === 'dispatched' ? 'var(--status-sos)' : '#34d399'};">
              ${health.ambulanceDispatch?.status === 'dispatched' ? '🚨 Dispatched (ETA 3m)' : '🟢 Standby at Bay 1'}
            </span>
          </div>
          <div class="health-vital-chip">
            <span class="vital-label">Medical Leave Sync</span>
            <span class="vital-val" style="color: #34d399;">Active (Auto-Excused)</span>
          </div>
        </div>
      </div>

      <!-- Module Navigation Tabs -->
      <div class="tabs-nav" style="margin: 1.5rem 0 1.25rem;">
        <button class="tab-btn ${currentHealthTab === 'queue' ? 'active' : ''}" onclick="window.setHealthTab('queue')">
          🎟️ OPD Queue & Doctors (${health.appointments?.length || 0})
        </button>
        <button class="tab-btn ${currentHealthTab === 'leave' ? 'active' : ''}" onclick="window.setHealthTab('leave')">
          📋 Sick Leave & Attendance Pass (${myLeaves.length})
        </button>
        <button class="tab-btn ${currentHealthTab === 'ehr' ? 'active' : ''}" onclick="window.setHealthTab('ehr')">
          🔒 Confidential EHR & Prescriptions
        </button>
        <button class="tab-btn ${currentHealthTab === 'pharmacy' ? 'active' : ''}" onclick="window.setHealthTab('pharmacy')">
          💊 Dispensary Stock Tracker
        </button>
      </div>

      <!-- Tab 1: OPD Queue & Doctor Scheduling -->
      ${currentHealthTab === 'queue' ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Live Token Tracker Card -->
          <div class="card" style="position: relative; overflow: hidden; border-top: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
              <h3 class="card-title" style="margin: 0;">Live OPD Queue Tracker</h3>
              <span class="badge badge-available">Real-Time Sync</span>
            </div>

            <div class="token-display-hero">
              <div class="token-circle-glow">
                <span class="token-circle-prefix">NOW SERVING</span>
                <span class="token-circle-number">#MED-${activeServing}</span>
                <span class="token-circle-sub">Room 1 • Dr. Ananya Sen</span>
              </div>
              <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 0.8rem;">
                Estimated consult time: 8-10 mins/patient &bull; Next token in queue: <b>#MED-${activeServing + 1}</b>
              </p>
            </div>

            <!-- Doctor/Staff Fast Queue Advance Control -->
            <div style="margin-top: 1.2rem; padding: 1rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-card);">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-cyan);">Doctor / Staff Console</span>
                  <div style="font-size: 0.85rem; font-weight: 600;">Consultation Control</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.advanceHealthQueue()">
                  <span>🔔</span> Call Next Patient (#MED-${activeServing + 1})
                </button>
              </div>
            </div>

            <!-- Queue Token List -->
            <div style="margin-top: 1.5rem;">
              <h4 style="font-size: 0.95rem; margin-bottom: 0.8rem; color: var(--text-secondary);">Upcoming Tokens</h4>
              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                ${(health.appointments || []).map(apt => {
                  const isCurrent = apt.tokenNumber === activeServing;
                  const isPast = apt.tokenNumber < activeServing;
                  return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: ${isCurrent ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-surface)'}; border: 1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}; border-radius: var(--radius-md);">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: ${isCurrent ? 'var(--primary-light)' : 'var(--text-primary)'};">
                          #MED-${apt.tokenNumber}
                        </span>
                        <div>
                          <div style="font-size: 0.88rem; font-weight: 600;">${apt.studentName} <span style="font-size: 0.75rem; color: var(--text-muted);">(${apt.studentId})</span></div>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">${apt.reason}</div>
                        </div>
                      </div>
                      <span class="badge ${isPast ? 'badge-available' : isCurrent ? 'badge-occupied' : 'badge-pending'}">
                        ${isPast ? 'Completed' : isCurrent ? 'In Consult' : 'Waiting'}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Duty Doctors Roster -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 1.2rem;">Duty Medical Officers & Counselors</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${(health.doctors || []).map(doc => `
                <div class="doctor-roster-card">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 2.2rem; background: var(--bg-surface); width: 52px; height: 52px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle);">
                      ${doc.avatar}
                    </div>
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; justify-content: space-between;">
                        <h4 style="margin: 0; font-size: 1.05rem;">${doc.name}</h4>
                        <span class="badge ${doc.status === 'available' ? 'badge-available' : 'badge-pending'}">
                          ${doc.status === 'available' ? '● On Duty' : '● In Session'}
                        </span>
                      </div>
                      <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600; margin-top: 0.15rem;">
                        ${doc.specialization}
                      </div>
                      <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem; display: flex; gap: 1rem;">
                        <span>📍 ${doc.room}</span>
                        <span>⏰ ${doc.timing}</span>
                      </div>
                    </div>
                  </div>
                  <div style="margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">
                      Queue: <b>${doc.queueLength} Patients Waiting</b>
                    </span>
                    <button class="btn btn-xs btn-outline" onclick="window.quickBookDoctor('${doc.id}', '${doc.name}')">
                      Select Doctor
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      ` : ''}

      <!-- Tab 2: Medical Sick Leave & Attendance Excusal -->
      ${currentHealthTab === 'leave' ? `
        <div class="card">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <h3 class="card-title" style="margin: 0;">Infirmary Medical Pass & Sick Leave Integration</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0.2rem 0 0;">
                Doctor-approved sick leaves are digitally signed and automatically update academic lecture attendance to 'Excused'.
              </p>
            </div>
            <button class="btn btn-primary" onclick="window.openSubmitMedicalLeaveModal()">
              <span>📝</span> Submit Medical Leave Pass
            </button>
          </div>

          <!-- Academic Sync Banner -->
          <div class="medical-sync-banner">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-size: 1.8rem;">⚡</span>
              <div>
                <h4 style="margin: 0; font-size: 0.98rem; color: #1e40af;">Automated Academic Attendance Protection</h4>
                <p style="margin: 0.15rem 0 0; font-size: 0.82rem; color: #3b82f6;">
                  When a doctor approves your medical certificate, missed class sessions during the convalescence window are automatically marked as <b>Excused</b>, preserving your 75% minimum eligibility cutoff.
                </p>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #1e40af;">Current Attendance</span>
              <div style="font-size: 1.5rem; font-weight: 800; color: #1d4ed8;">${state.attendance?.overall || 89.7}%</div>
            </div>
          </div>

          <!-- Leaves List -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem;">
            ${myLeaves.map(leave => `
              <div class="medical-pass-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--primary);">
                        ${leave.id}
                      </span>
                      <span class="badge ${leave.status === 'approved' ? 'badge-available' : 'badge-pending'}">
                        ${leave.status === 'approved' ? '✓ DOCTOR APPROVED & ATTENDANCE EXCUSED' : '⏳ PENDING INFIRMARY REVIEW'}
                      </span>
                    </div>
                    <h4 style="margin: 0.35rem 0 0.1rem; font-size: 1.1rem;">${leave.reason}</h4>
                    <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">
                      Patient: <b>${leave.studentName}</b> (${leave.studentId}) &bull; Attending Physician: <b>${leave.doctorName}</b>
                    </p>
                  </div>

                  <!-- Digital Verification QR Pill -->
                  <div style="text-align: right;">
                    <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.72rem; font-family: monospace;">
                      <span>📱 QR AUTH:</span>
                      <span style="color: var(--primary-light);">${leave.certificateQr.slice(0, 16)}...</span>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
                      Approved: ${leave.approvedAt || 'Awaiting Signature'}
                    </div>
                  </div>
                </div>

                <div style="margin-top: 1rem; padding: 0.85rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div style="display: flex; gap: 2rem;">
                    <div>
                      <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Leave Duration</span>
                      <div style="font-size: 0.9rem; font-weight: 600;">${leave.startDate} to ${leave.endDate} (${leave.days} Days)</div>
                    </div>
                    <div>
                      <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Courses Excused</span>
                      <div style="font-size: 0.9rem; font-weight: 600; color: #34d399;">
                        ${(leave.affectedCourses || []).map(c => `[${c}]`).join(' ')} &bull; Attendance Synchronized
                      </div>
                    </div>
                  </div>

                  ${leave.status === 'pending' ? `
                    <button class="btn btn-sm btn-primary" onclick="window.doctorApproveLeave('${leave.id}')">
                      <span>✍️</span> Doctor Sign & Sync Attendance
                    </button>
                  ` : `
                    <div style="display: flex; gap: 0.5rem;">
                      <button class="btn btn-xs btn-outline" onclick="window.showToast('Digital Certificate Downloaded (PDF with Cryptographic Signature).')">
                        📄 Download PDF Pass
                      </button>
                    </div>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Tab 3: Confidential EHR & Prescriptions -->
      ${currentHealthTab === 'ehr' ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Student Vitals & Health Passport Card -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 class="card-title" style="margin: 0;">Student Health Passport (EHR)</h3>
              <span class="badge badge-available">🔒 HIPAA / DPDP Private</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1.2rem; padding: 1.1rem; background: var(--bg-surface); border-radius: var(--radius-lg); margin-bottom: 1.2rem;">
              <div style="font-size: 2.4rem;">🧑‍🎓</div>
              <div>
                <h4 style="margin: 0; font-size: 1.15rem;">${user.name}</h4>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${user.department} &bull; ${user.studentId}</div>
                <div style="margin-top: 0.35rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <span class="feature-pill" style="color: #ef4444; font-weight: 700;">Blood: B+ve</span>
                  <span class="feature-pill">Penicillin Allergy</span>
                  <span class="feature-pill">Asthma: Negative</span>
                </div>
              </div>
            </div>

            <!-- Vitals Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); text-align: center;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Blood Pressure</span>
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">118/76 mmHg</div>
              </div>
              <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); text-align: center;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Resting Pulse</span>
                <div style="font-size: 1.15rem; font-weight: 800; color: #34d399; margin-top: 0.2rem;">72 bpm</div>
              </div>
              <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); text-align: center;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Blood Oxygen (SpO2)</span>
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary-light); margin-top: 0.2rem;">99%</div>
              </div>
              <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); text-align: center;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Body Temperature</span>
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">98.4 °F</div>
              </div>
            </div>

            <div style="font-size: 0.78rem; color: var(--text-secondary); background: rgba(16, 185, 129, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(16, 185, 129, 0.2);">
              🛡️ <b>Privacy Guarantee:</b> Electronic Health Records are encrypted with AES-256 and only accessible to accredited Campus Medical Officers during active OPD token check-in.
            </div>
          </div>

          <!-- Digital Prescriptions Repository -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 1.25rem;">Active Digital Prescriptions</h3>
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${(health.ehrRecords?.[0]?.prescriptions || []).map(rx => `
                <div style="border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: 1.25rem; background: var(--bg-surface);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
                    <div>
                      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700;">
                        Prescription #${rx.id} &bull; ${rx.date}
                      </div>
                      <h4 style="margin: 0.2rem 0; font-size: 1.05rem;">${rx.diagnosis}</h4>
                      <span style="font-size: 0.8rem; color: var(--text-muted);">Attending: ${rx.doctor}</span>
                    </div>
                    <button class="btn btn-xs btn-outline" onclick="window.showToast('Digital Prescription sent to Campus Pharmacy Dispensary.')">
                      Send to Dispensary
                    </button>
                  </div>

                  <!-- Medicine Items -->
                  <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.75rem;">
                    ${rx.medicines.map(med => `
                      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); padding: 0.65rem 0.9rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <div>
                          <div style="font-weight: 700; font-size: 0.88rem;">💊 ${med.name}</div>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">${med.dosage} &bull; ${med.timing} &bull; ${med.duration}</div>
                        </div>
                        <div style="display: flex; gap: 0.3rem;">
                          ${(med.timingSlots || []).map(ts => `
                            <span style="font-size: 0.68rem; padding: 0.15rem 0.45rem; background: var(--bg-surface); border-radius: var(--radius-sm); font-weight: 600;">${ts}</span>
                          `).join('')}
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <div style="margin-top: 0.8rem; font-size: 0.8rem; color: var(--text-secondary); font-style: italic;">
                    Notes: "${rx.notes}"
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      ` : ''}

      <!-- Tab 4: Dispensary Pharmacy Inventory -->
      ${currentHealthTab === 'pharmacy' ? `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <h3 class="card-title" style="margin: 0;">Campus Dispensary & Medicine Stock Tracker</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0.2rem 0 0;">
                Live availability of essential medications, first-aid supplies, and inhalers at the Central Infirmary Pharmacy.
              </p>
            </div>
            
            <!-- Medicine Search Bar -->
            <div style="display: flex; gap: 0.5rem; width: 100%; max-width: 340px;">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search Paracetamol, Inhaler, ORS..." 
                value="${pharmacySearchQuery}"
                oninput="window.handlePharmacySearch(this.value)"
              />
            </div>
          </div>

          <!-- Inventory Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
            ${inventory.map(item => `
              <div style="border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: 1.1rem; background: var(--bg-surface); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">${item.category}</span>
                    <span class="badge ${item.status === 'in_stock' ? 'badge-available' : 'badge-pending'}">
                      ${item.status === 'in_stock' ? 'In Stock' : 'Low Stock'}
                    </span>
                  </div>
                  <h4 style="font-size: 1.05rem; margin: 0.4rem 0 0.2rem;">${item.name}</h4>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Threshold: ${item.minThreshold} ${item.unit}</div>
                </div>

                <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle);">
                  <div>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Current Quantity</span>
                    <div style="font-size: 1.25rem; font-weight: 800; color: ${item.stockQty < item.minThreshold ? 'var(--status-pending)' : 'var(--text-primary)'};">
                      ${item.stockQty} <span style="font-size: 0.8rem; font-weight: 500;">${item.unit}</span>
                    </div>
                  </div>
                  <button class="btn btn-xs btn-outline" onclick="window.showToast('${item.name} requested at Infirmary Counter 1.')">
                    Request Pickup
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

// Global Tab Handlers
window.setHealthTab = function(tab) {
  currentHealthTab = tab;
  window.appRouter.renderCurrentView();
};

window.handlePharmacySearch = function(query) {
  pharmacySearchQuery = query;
  window.appRouter.renderCurrentView();
};

window.advanceHealthQueue = function() {
  window.campusState.advanceHealthQueue();
  window.appRouter.renderCurrentView();
};

window.quickBookDoctor = function(docId, docName) {
  window.openBookHealthAppointmentModal(docId, docName);
};

window.doctorApproveLeave = function(leaveId) {
  const res = window.campusState.approveMedicalLeave(leaveId);
  if (res.success) {
    window.appRouter.renderCurrentView();
  }
};

// Book Appointment Modal
window.openBookHealthAppointmentModal = function(preDocId, preDocName) {
  const doctors = window.campusState.data.healthData?.doctors || [];
  const html = `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.4rem;">🩺</span>
            <h3 style="margin: 0; font-size: 1.2rem;">Book OPD Doctor Appointment</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal()">&times;</button>
        </div>
        <form onsubmit="window.handleBookHealthAppointment(event)">
          <div class="form-group">
            <label class="form-label">Consulting Doctor</label>
            <select class="form-control" id="apt-doctor" required>
              ${doctors.map(d => `
                <option value="${d.id}" data-name="${d.name}" ${preDocId === d.id ? 'selected' : ''}>
                  ${d.name} (${d.specialization}) - Room: ${d.room}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Chief Complaint / Symptoms</label>
            <input type="text" class="form-control" id="apt-reason" placeholder="e.g. Acute migraine, fever, sports ankle injury..." required />
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Time Slot</label>
            <select class="form-control" id="apt-slot">
              <option value="Immediate Walk-In (Next Token)">Immediate Walk-In (Next Token)</option>
              <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
              <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
              <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" onclick="window.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Generate OPD Token</button>
          </div>
        </form>
      </div>
    </div>
  `;
  window.appendModalToDOM(html);
};

window.handleBookHealthAppointment = function(e) {
  e.preventDefault();
  const docSelect = document.getElementById('apt-doctor');
  const docId = docSelect.value;
  const docName = docSelect.options[docSelect.selectedIndex].dataset.name;
  const reason = document.getElementById('apt-reason').value;
  const time = document.getElementById('apt-slot').value;

  window.campusState.bookHealthAppointment({
    doctorId: docId,
    doctorName: docName,
    reason: reason,
    time: time
  });

  window.closeModal();
  window.appRouter.renderCurrentView();
};

// Submit Medical Leave Modal
window.openSubmitMedicalLeaveModal = function() {
  const html = `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.4rem;">📋</span>
            <h3 style="margin: 0; font-size: 1.2rem;">Request Medical Sick Leave Pass</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal()">&times;</button>
        </div>
        <form onsubmit="window.handleSubmitMedicalLeave(event)">
          <div class="form-group">
            <label class="form-label">Medical Diagnosis / Reason</label>
            <input type="text" class="form-control" id="leave-reason" placeholder="e.g. Viral Pyrexia, Food Poisoning, Severe Sprain..." required />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="date" class="form-control" id="leave-start" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="date" class="form-control" id="leave-end" value="${new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]}" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Attending Campus Physician</label>
            <select class="form-control" id="leave-doctor">
              <option value="Dr. Ananya Sen, MD">Dr. Ananya Sen, MD (Chief Medical Officer)</option>
              <option value="Dr. Vikramaditya Rao, MS">Dr. Vikramaditya Rao, MS (Sports Medicine)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Academic Courses to Excuse</label>
            <input type="text" class="form-control" id="leave-courses" value="CS302, CS304, EE308" required />
            <small style="color: var(--text-muted); font-size: 0.75rem;">Comma-separated course codes for automated attendance sync.</small>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" onclick="window.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit to Infirmary</button>
          </div>
        </form>
      </div>
    </div>
  `;
  window.appendModalToDOM(html);
};

window.handleSubmitMedicalLeave = function(e) {
  e.preventDefault();
  const reason = document.getElementById('leave-reason').value;
  const startDate = document.getElementById('leave-start').value;
  const endDate = document.getElementById('leave-end').value;
  const doctorName = document.getElementById('leave-doctor').value;
  const coursesRaw = document.getElementById('leave-courses').value;
  const affectedCourses = coursesRaw.split(',').map(s => s.trim()).filter(Boolean);

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

  window.campusState.submitMedicalLeave({
    reason,
    startDate,
    endDate,
    days: diffDays,
    doctorName,
    affectedCourses
  });

  window.closeModal();
  window.appRouter.renderCurrentView();
};

// Medical Ambulance SOS Modal
window.openMedicalAmbulanceModal = function() {
  const html = `
    <div class="modal-backdrop">
      <div class="modal-card" style="border-top: 5px solid var(--status-sos);">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.5rem;">🚑</span>
            <h3 style="margin: 0; font-size: 1.25rem; color: var(--status-sos);">Dispatch Campus Emergency Ambulance</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal()">&times;</button>
        </div>
        <form onsubmit="window.handleMedicalAmbulanceDispatch(event)">
          <div style="background: rgba(225, 29, 72, 0.08); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(225, 29, 72, 0.2); margin-bottom: 1.25rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--status-sos);">🚨 IMMEDIATE GPS DISPATCH</div>
            <p style="margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--text-secondary);">
              This alert sounds an instantaneous siren at the Infirmary Ambulance Bay and Campus Security Control Room.
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Accident / Incident Location</label>
            <input type="text" class="form-control" id="ambulance-location" value="Main Academic Quadrangle (GPS: 10.0284 N, 76.3289 E)" required />
          </div>

          <div class="form-group">
            <label class="form-label">Triage Urgency Code</label>
            <select class="form-control" id="ambulance-triage">
              <option value="Code Red: Severe Trauma / Unconscious / Cardiac Distress">Code Red: Severe Trauma / Unconscious / Cardiac Distress</option>
              <option value="Code Yellow: Fracture / Acute Asthma Attack / Burn">Code Yellow: Fracture / Acute Asthma Attack / Burn</option>
              <option value="Code Blue: Medical Collapse / Heat Stroke">Code Blue: Medical Collapse / Heat Stroke</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Additional Dispatch Notes</label>
            <input type="text" class="form-control" id="ambulance-notes" placeholder="e.g. Patient fallen from stairway 3, bleeding from forehead..." required />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" onclick="window.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-sos">DISPATCH AMBULANCE NOW</button>
          </div>
        </form>
      </div>
    </div>
  `;
  window.appendModalToDOM(html);
};

window.handleMedicalAmbulanceDispatch = function(e) {
  e.preventDefault();
  const location = document.getElementById('ambulance-location').value;
  const triage = document.getElementById('ambulance-triage').value;
  const notes = document.getElementById('ambulance-notes').value;

  window.campusState.triggerMedicalAmbulanceSOS({
    location: location,
    notes: `${triage} — ${notes}`
  });

  window.closeModal();
  window.appRouter.renderCurrentView();
};
