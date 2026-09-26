/* ==========================================================================
   SmartCampus Interactive Campus Map & Navigation
   ========================================================================== */

let selectedBuildingId = 'main_block';

const CAMPUS_BUILDINGS = [
  {
    id: 'main_block',
    name: 'Main Academic Block',
    code: 'MB',
    floors: 4,
    color: '#8fb359',
    description: 'Houses Department of Electrical & Mechanical Engineering, Dean Offices, and Lecture Halls 101–206.',
    facilities: ['EEE Power Systems Lab 1', 'Lecture Room 204', 'Physics Lab', 'Faculty Lounge'],
    x: 180,
    y: 120,
    width: 220,
    height: 140
  },
  {
    id: 'tech_tower',
    name: 'Tech & Computing Tower',
    code: 'TT',
    floors: 6,
    color: '#ff9f7d',
    description: 'Hub for Computer Science, AI Innovation Rigs, Cloud Data Center, and Smart Seminar Auditorium.',
    facilities: ['AI & Robotics Lab', 'Smart Seminar Hall (3rd Floor)', 'High Performance Computing Center', 'Incubation Cell'],
    x: 460,
    y: 90,
    width: 200,
    height: 180
  },
  {
    id: 'library',
    name: 'Central Library & Archives',
    code: 'LIB',
    floors: 3,
    color: '#ffc2a6',
    description: '30,000+ reference volumes, quiet study cubicles, IEEE digital database terminals, and lost & found custody desk.',
    facilities: ['Digital Research Wing', 'Periodicals Hall', 'Help Desk & Lost/Found Custody'],
    x: 720,
    y: 130,
    width: 160,
    height: 130
  },
  {
    id: 'science_wing',
    name: 'Science & Research Complex',
    code: 'SW',
    floors: 3,
    color: '#6d8c38',
    description: 'Advanced Chemistry synthesis lab, biotechnology hoods, and instrumentation laboratories.',
    facilities: ['Advanced Chemistry Lab', 'Molecular Biology Center', 'Materials Testing Lab'],
    x: 180,
    y: 310,
    width: 190,
    height: 130
  },
  {
    id: 'cafeteria',
    name: 'Campus Cafeteria & Food Court',
    code: 'CAFE',
    floors: 2,
    color: '#f0744c',
    description: 'Daily vegetarian & non-vegetarian dining, coffee kiosks, open terrace seating.',
    facilities: ['Main Dining Hall', 'Bakery & Juice Bar', 'Student Common Area'],
    x: 430,
    y: 330,
    width: 170,
    height: 110
  },
  {
    id: 'sports',
    name: 'Sports Complex & Pavilion',
    code: 'SPORT',
    floors: 1,
    color: '#a3c476',
    description: 'Basketball courts, indoor badminton arena, gym, and athletics track pavilion.',
    facilities: ['Indoor Badminton Courts', 'Fitness Gymnasium', 'First Aid Station'],
    x: 660,
    y: 310,
    width: 220,
    height: 130
  },
  {
    id: 'security_gate',
    name: 'Main Gate & Security Command',
    code: 'SEC',
    floors: 1,
    color: '#f43f5e',
    description: 'Campus emergency dispatch station, CCTV control room, and visitor registration gate.',
    facilities: ['24/7 Security Dispatch', 'Emergency First-Aid Post', 'Lost Property Locker'],
    x: 60,
    y: 220,
    width: 80,
    height: 80
  }
];

function renderMapView() {
  const building = CAMPUS_BUILDINGS.find(b => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>🗺️ Digital Campus Navigation & Map</h2>
          <p>Interactive 2D schematic of campus buildings, facilities, and real-time paths.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <input type="text" class="form-control" style="width: 260px;" placeholder="🔍 Find room or building..." onkeyup="window.handleMapSearch(this.value)" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 1.5rem;">
        <!-- Interactive Map Canvas -->
        <div class="card" style="padding: 1rem; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 0 0.5rem;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">Click any building to inspect floors & services</span>
            <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">GPS Accuracy: ±1.2m</span>
          </div>

          <div class="map-canvas-container">
            <svg class="campus-svg-map" viewBox="0 0 950 500">
              <!-- Grid Backdrop -->
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
                </pattern>
                <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#1e293b" />
                  <stop offset="50%" stop-color="#334155" />
                  <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
              </defs>
              <rect width="950" height="500" fill="url(#grid)" />

              <!-- Campus Walkways & Roads -->
              <path d="M 100 260 L 900 260" stroke="url(#roadGrad)" stroke-width="24" stroke-linecap="round" />
              <path d="M 290 80 L 290 450" stroke="url(#roadGrad)" stroke-width="18" stroke-linecap="round" />
              <path d="M 540 80 L 540 450" stroke="url(#roadGrad)" stroke-width="18" stroke-linecap="round" />
              <path d="M 800 100 L 800 450" stroke="url(#roadGrad)" stroke-width="18" stroke-linecap="round" />

              <!-- Central Plaza Green Garden -->
              <circle cx="410" cy="260" r="45" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="2" stroke-dasharray="4 4" />
              <text x="410" y="264" fill="#34d399" font-size="11" text-anchor="middle" font-weight="700">CENTRAL LAWN</text>

              <!-- Buildings -->
              ${CAMPUS_BUILDINGS.map(b => {
    const isSelected = b.id === selectedBuildingId;
    return `
                  <g class="map-building" onclick="window.selectBuilding('${b.id}')">
                    <!-- Glow if selected -->
                    ${isSelected ? `
                      <rect x="${b.x - 4}" y="${b.y - 4}" width="${b.width + 8}" height="${b.height + 8}" rx="12" fill="none" stroke="${b.color}" stroke-width="3" filter="drop-shadow(0 0 12px ${b.color})">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                      </rect>
                    ` : ''}

                    <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="10" 
                          fill="${isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.85)'}" 
                          stroke="${isSelected ? b.color : 'rgba(255,255,255,0.15)'}" 
                          stroke-width="${isSelected ? 2 : 1.2}" />

                    <!-- Building Header Bar -->
                    <rect x="${b.x}" y="${b.y}" width="${b.width}" height="28" rx="10" fill="${b.color}" opacity="0.25" />
                    
                    <text x="${b.x + 12}" y="${b.y + 19}" fill="${b.color}" font-weight="800" font-size="11" letter-spacing="1">
                      [${b.code}] ${b.name.toUpperCase()}
                    </text>

                    <text x="${b.x + 12}" y="${b.y + 50}" fill="#cbd5e1" font-size="11" font-weight="600">
                      ${b.floors} Floors &bull; ${b.facilities.length} Main Labs
                    </text>
                    
                    <text x="${b.x + 12}" y="${b.y + 70}" fill="#94a3b8" font-size="10">
                      • ${b.facilities[0] || 'Academic Facilities'}
                    </text>
                    ${b.facilities[1] ? `
                      <text x="${b.x + 12}" y="${b.y + 88}" fill="#94a3b8" font-size="10">
                        • ${b.facilities[1]}
                      </text>
                    ` : ''}

                    <!-- Entry Point Marker -->
                    <circle cx="${b.x + b.width / 2}" cy="${b.y + b.height}" r="4" fill="${b.color}" />
                  </g>
                `;
  }).join('')}
            </svg>
          </div>
        </div>

        <!-- Building Inspector Sidebar -->
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1rem;">
            <span class="badge" style="background: ${building.color}25; color: ${building.color}; border: 1px solid ${building.color}40; margin-bottom: 0.5rem;">
              ${building.code} &bull; ${building.floors} FLOORS
            </span>
            <h3 style="font-size: 1.3rem;">${building.name}</h3>
            <p style="font-size: 0.85rem; margin-top: 0.4rem; line-height: 1.4;">${building.description}</p>
          </div>

          <h4 style="font-size: 0.95rem; margin-bottom: 0.6rem;">Key Facilities Inside:</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
            ${building.facilities.map(f => `
              <div style="background: var(--bg-surface); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem; display: flex; align-items: center; justify-content: space-between;">
                <span>🏢 ${f}</span>
                <span class="badge badge-available" style="font-size: 0.65rem;">Active</span>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.6rem;">
            <button class="btn btn-primary" onclick="window.simulateNavigationRoute('${building.name}')">
              <span>🚶</span> Start Walking Guidance
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.appRouter.navigate('rooms')">
              Check Room Schedule Here
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.selectBuilding = function (id) {
  selectedBuildingId = id;
  window.appRouter.renderCurrentView();
};

window.handleMapSearch = function (query) {
  if (!query) return;
  const q = query.toLowerCase();
  const match = CAMPUS_BUILDINGS.find(b =>
    b.name.toLowerCase().includes(q) ||
    b.facilities.some(f => f.toLowerCase().includes(q))
  );
  if (match) {
    selectedBuildingId = match.id;
    window.appRouter.renderCurrentView();
  }
};

window.simulateNavigationRoute = function (name) {
  window.showToast(`Navigation active: Calculating shortest route to ${name} (3 mins walk).`);
};
