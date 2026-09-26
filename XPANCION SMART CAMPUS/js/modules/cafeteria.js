/* ==========================================================================
   SmartCampus Online Cafeteria & OTP Parcel Pickup System
   Standard White & Blue Theme with Northern & Southern Indian Specialties
   ========================================================================== */

let currentCanteenCategory = 'all';
let filterVegOnly = false;
let canteenViewMode = 'menu'; // menu | cart | my_orders | counter_desk

function renderCafeteriaView() {
  const state = window.campusState.data;
  const user = state.currentUser || { role: 'student', name: 'Student User' };
  const isStaff = user.role !== 'student';

  // Safeguard: Students can never access staff parcel counter desk
  if (!isStaff && canteenViewMode === 'counter_desk') {
    canteenViewMode = 'menu';
  }

  let menu = state.canteenMenu || [];

  if (currentCanteenCategory !== 'all') {
    const cat = currentCanteenCategory.toLowerCase();
    menu = menu.filter(m => {
      const matchCat = (m.category || '').toLowerCase().includes(cat);
      const matchReg = (m.region || '').toLowerCase().includes(cat);
      return matchCat || matchReg;
    });
  }

  if (filterVegOnly) {
    menu = menu.filter(m => m.isVeg);
  }

  const cart = state.canteenCart || [];
  const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const myOrders = (state.canteenOrders || []).filter(o => o.user === user.name);

  // Time-of-day dynamic meal recommendation
  const currentHour = new Date().getHours();
  const mealContext = currentHour < 11 
    ? '🌅 Breakfast & Tiffin Service is Live &bull; Fresh Dosas, Idlis & Filter Coffee'
    : currentHour < 16
    ? '☀️ Lunch Service Active &bull; Royal North & South Thalis, Meals & Bowls'
    : '☕ Evening Refreshments &bull; Piping Hot Samosas, Chai, Pav Bhaji & Shakes';

  return `
    <div class="view-animate-in">
      <!-- Aesthetic Liquid-Glass Hero Showcase -->
      <div class="canteen-hero-showcase">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
          <div style="max-width: 650px;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.25); border-radius: 9999px; padding: 0.25rem 0.8rem; font-size: 0.76rem; font-weight: 700; color: #1d4ed8; margin-bottom: 0.75rem;">
              <span>⚡</span> ${mealContext}
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem; letter-spacing: -0.02em;">
              🍱 Smart Food Hall & Express Pickup
            </h2>
            <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 0;">
              Savor authentic Northern & Southern Indian delicacies prepared fresh daily. Order ahead from your device, pay online via Razorpay, and collect seamlessly using your 4-digit pickup OTP.
            </p>
          </div>

          <!-- Navigation Tabs Pill Group -->
          <div class="canteen-nav-pill-group">
            <button class="btn btn-sm ${canteenViewMode === 'menu' ? 'btn-primary' : 'btn-outline'}" style="border-radius: 9999px;" onclick="window.setCanteenViewMode('menu')">
              <span>🍽️</span> Menu
            </button>
            <button class="btn btn-sm ${canteenViewMode === 'cart' ? 'btn-primary' : 'btn-outline'}" style="border-radius: 9999px; position: relative;" onclick="window.setCanteenViewMode('cart')">
              <span>🛒</span> My Cart ${cartTotalQty > 0 ? `<span style="background: #2563eb; color: #ffffff; font-size: 0.7rem; font-weight: 800; padding: 1px 6px; border-radius: 9999px; margin-left: 3px;">${cartTotalQty}</span>` : ''}
            </button>
            <button class="btn btn-sm ${canteenViewMode === 'my_orders' ? 'btn-primary' : 'btn-outline'}" style="border-radius: 9999px;" onclick="window.setCanteenViewMode('my_orders')">
              <span>🧾</span> Active Orders (${myOrders.filter(o => o.status !== 'collected').length})
            </button>
            ${isStaff ? `
              <button class="btn btn-sm ${canteenViewMode === 'counter_desk' ? 'btn-primary' : 'btn-outline'}" style="border-radius: 9999px;" onclick="window.setCanteenViewMode('counter_desk')">
                <span>🧑‍🍳</span> Parcel Counter Desk
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Quick Live Service Pills -->
        <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(0, 0, 0, 0.06);">
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 9999px; border: 1px solid #a7f3d0;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span> All 4 Counters Live
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 600; color: #1e40af; background: #eff6ff; padding: 0.2rem 0.65rem; border-radius: 9999px; border: 1px solid #bfdbfe;">
            🕒 Avg Prep: 5-8 Mins
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 600; color: #1e40af; background: #eff6ff; padding: 0.2rem 0.65rem; border-radius: 9999px; border: 1px solid #bfdbfe;">
            💳 Razorpay Instant Online Pay
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 600; color: #0f172a; background: #f8fafc; padding: 0.2rem 0.65rem; border-radius: 9999px; border: 1px solid #e2e8f0;">
            🔒 4-Digit Pickup OTP Issued
          </span>
        </div>
      </div>

      <!-- Main Section Switching -->
      ${canteenViewMode === 'menu' ? renderCanteenMenuSection(menu, cart, cartTotalQty, cartTotalPrice) : ''}
      ${canteenViewMode === 'cart' ? renderCanteenCartSection(cart, cartTotalQty, cartTotalPrice) : ''}
      ${canteenViewMode === 'my_orders' ? renderCanteenMyOrdersSection(myOrders) : ''}
      ${canteenViewMode === 'counter_desk' && isStaff ? renderCanteenCounterDeskSection(state.canteenOrders || []) : ''}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 1. Menu Section with Categories & Cart Dock
// --------------------------------------------------------------------------
function renderCanteenMenuSection(menu, cart, cartTotalQty, cartTotalPrice) {
  return `
    <!-- Top Filter Controls -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
      <div class="tabs-nav" style="margin-bottom: 0; background: var(--bg-card); padding: 0.3rem 0.4rem; border-radius: 9999px; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
        <button class="tab-btn ${currentCanteenCategory === 'all' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('all')">
          All Delicacies
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'north' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('north')">
          🏔️ North Indian
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'south' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('south')">
          🌴 South Indian
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'meals' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('meals')">
          🍛 Meals & Thali
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'breakfast' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('breakfast')">
          🥞 Breakfast & Tiffin
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'snacks' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('snacks')">
          🥟 Snacks & Wraps
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'beverage' ? 'active' : ''}" style="border-radius: 9999px; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.setCanteenCategory('beverage')">
          🧋 Brews & Shakes
        </button>
      </div>

      <!-- Veg Only Switch -->
      <button class="btn btn-sm ${filterVegOnly ? 'btn-primary' : 'btn-outline'}" onclick="window.toggleVegFilter()" style="border-radius: var(--radius-full); padding: 0.45rem 0.9rem; font-weight: 700;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${filterVegOnly ? '#ffffff' : '#059669'}; margin-right: 4px;"></span>
        ${filterVegOnly ? 'Pure Veg Active' : 'Filter Pure Veg'}
      </button>
    </div>

    <!-- Express Live Window Banner -->
    <div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(2, 62, 138, 0.04) 100%); border: 1.5px solid #bfdbfe; border-radius: var(--radius-xl); padding: 1.1rem 1.4rem; margin-bottom: 1.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem; background: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15); border: 1px solid #bfdbfe;">
          📦
        </div>
        <div>
          <h4 style="font-size: 1rem; color: #1e3a8a; font-weight: 800; margin-bottom: 0.15rem; font-family: var(--font-heading);">
            Express Counter 2 Window is Active
          </h4>
          <p style="font-size: 0.82rem; color: #475569; margin: 0;">
            Pre-order to avoid lecture queues. Checkout with <b>Razorpay</b>, receive your <b>Instant 4-digit Pickup OTP</b>, and collect hot at Counter 2!
          </p>
        </div>
      </div>
      <div style="display: flex; gap: 0.6rem; align-items: center;">
        <span class="badge" style="background: #ffffff; color: #059669; border: 1px solid #a7f3d0; font-weight: 700;">🟢 Fast Track Window</span>
        <span class="badge" style="background: #2563eb; color: #ffffff; font-weight: 700;">Counter 2 East Wing</span>
      </div>
    </div>

    <!-- Realistic Food Cards Grid -->
    <div class="items-grid" style="margin-bottom: 5.5rem;">
      ${menu.map(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const qty = cartItem ? cartItem.qty : 0;
        const isNorth = (item.region || '').includes('North');
        const isSouth = (item.region || '').includes('South');
        const regionClass = isNorth ? 'north' : isSouth ? 'south' : 'snack';
        const regionLabel = isNorth ? '🏔️ North Indian' : isSouth ? '🌴 South Indian' : '✨ Chef Special';

        return `
          <div class="food-card">
            <!-- Realistic Image Container -->
            <div class="food-img-wrapper">
              <img 
                src="${item.image}" 
                alt="${item.name}" 
                class="food-img" 
                loading="lazy" 
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';"
              />
              
              <!-- Gradient Bottom Overlay -->
              <div class="food-img-gradient-overlay"></div>

              <!-- Region Pill Badge -->
              <span class="food-region-pill ${regionClass}">
                ${regionLabel}
              </span>

              <!-- Prep Time Overlay Tag -->
              <div class="food-img-tag">
                <span>🕒 ${item.prepTime}</span>
              </div>

              <!-- Veg / Non-Veg Indicator -->
              <div class="food-veg-indicator" title="${item.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}">
                <div style="width: 14px; height: 14px; border: 1.5px solid ${item.isVeg ? '#059669' : '#dc2626'}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 6px; height: 6px; border-radius: 50%; background: ${item.isVeg ? '#059669' : '#dc2626'};"></div>
                </div>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="food-card-body" style="padding: 1.25rem;">
              <div class="food-title-row">
                <div>
                  <h4 class="food-title">${item.name}</h4>
                  <span style="font-size: 0.74rem; color: var(--text-muted); font-weight: 600;">${item.category}</span>
                </div>
                <div class="food-price">₹${item.price}</div>
              </div>

              <p class="food-desc" style="font-size: 0.82rem; line-height: 1.45; color: var(--text-secondary); margin: 0.4rem 0 0.85rem;">
                ${item.description}
              </p>

              <div class="food-meta-row" style="padding-top: 0.65rem; border-top: 1px solid var(--border-subtle); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem;">
                <span style="color: #f59e0b; font-weight: 700;">★ ${item.rating} (Rating)</span>
                <span style="color: #2563eb; font-weight: 700;">📍 ${item.counter.split('(')[0].trim()}</span>
              </div>

              <!-- Action Controls -->
              <div>
                ${qty > 0 ? `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: var(--radius-md); padding: 0.35rem 0.75rem;">
                    <button class="btn btn-sm btn-outline" style="padding: 0.2rem 0.65rem; font-size: 1rem; border-color: #93c5fd; color: #1d4ed8; background: #ffffff;" onclick="window.updateCartQty('${item.id}', -1)">−</button>
                    <span style="font-weight: 800; font-size: 0.95rem; color: #1e3a8a;">${qty} in Tray</span>
                    <button class="btn btn-sm btn-primary" style="padding: 0.2rem 0.65rem; font-size: 1rem;" onclick="window.updateCartQty('${item.id}', 1)">+</button>
                  </div>
                ` : `
                  <button class="btn-add-tray" onclick="window.addFoodToCart('${item.id}')">
                    <span>➕</span> Add to Tray
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Floating Docked Cart Bar (White & Blue) -->
    ${cartTotalQty > 0 ? `
      <div class="canteen-cart-dock">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
            🛒
          </div>
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a;">
              ${cartTotalQty} Item${cartTotalQty > 1 ? 's' : ''} in Parcel Tray
            </div>
            <div style="font-size: 0.85rem; color: #2563eb; font-weight: 700;">
              Total: ₹${cartTotalPrice} (Incl. Taxes)
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary" onclick="window.campusState.clearCart(); window.appRouter.renderCurrentView();">
            Clear
          </button>
          <button class="btn btn-outline" style="border-color: #93c5fd; color: #1d4ed8; background: #ffffff;" onclick="window.setCanteenViewMode('cart')">
            <span>🛒</span> View Cart (${cartTotalQty})
          </button>
          <button class="btn btn-primary" onclick="window.proceedToRazorpayPayment(${cartTotalPrice + 10})">
            <span>💳</span> Pay via Razorpay (₹${cartTotalPrice + 10}) →
          </button>
        </div>
      </div>
    ` : ''}
  `;
}

// --------------------------------------------------------------------------
// 1.5. Dedicated Cart View & Razorpay Express Order Summary
// --------------------------------------------------------------------------
function renderCanteenCartSection(cart, cartTotalQty, cartTotalPrice) {
  const packagingFee = 10;
  const grandTotal = cartTotalPrice + (cart.length > 0 ? packagingFee : 0);

  if (cart.length === 0) {
    return `
      <div class="card" style="text-align: center; padding: 4rem 1.5rem; max-width: 650px; margin: 2rem auto; border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); border: 1.5px dashed var(--border-subtle);">
        <div style="width: 80px; height: 80px; margin: 0 auto 1.25rem; background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">
          🛒
        </div>
        <h3 style="font-size: 1.4rem; color: #0f172a; margin-bottom: 0.5rem; font-family: var(--font-heading);">Your Parcel Tray is Empty</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem; line-height: 1.5;">
          Select delicious Northern or Southern delicacies from our live cafeteria menu, customize your order, and complete payment smoothly via Razorpay.
        </p>
        <button class="btn btn-primary" onclick="window.setCanteenViewMode('menu')">
          <span>🍽️</span> Explore Cafeteria Menu
        </button>
      </div>
    `;
  }

  return `
    <div style="margin-bottom: 3.5rem;">
      <!-- Title Row -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.4rem; color: #0f172a; display: flex; align-items: center; gap: 0.6rem; font-family: var(--font-heading);">
            <span>🛒</span> Review Your Parcel Tray (${cartTotalQty} item${cartTotalQty > 1 ? 's' : ''})
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Verify your tray items, choose your pickup counter window, and pay securely via Razorpay.
          </p>
        </div>
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <button class="btn btn-sm btn-outline" onclick="window.setCanteenViewMode('menu')">
            ← Add More Dishes
          </button>
          <button class="btn btn-sm btn-outline" style="color: #dc2626; border-color: #fecaca;" onclick="window.campusState.clearCart(); window.appRouter.renderCurrentView();">
            🗑️ Clear Tray
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.75rem; align-items: start;">
        <!-- Left Column: Itemized List -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${cart.map(item => `
            <div class="card" style="padding: 1.15rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; gap: 1rem; min-width: 220px; flex: 1;">
                <img 
                  src="${item.image}" 
                  alt="${item.name}" 
                  style="width: 76px; height: 76px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid #bfdbfe;" 
                  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80';"
                />
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <div style="width: 14px; height: 14px; border: 1.5px solid ${item.isVeg ? '#059669' : '#dc2626'}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 6px; height: 6px; border-radius: 50%; background: ${item.isVeg ? '#059669' : '#dc2626'};"></div>
                    </div>
                    <h4 style="font-size: 1rem; color: #0f172a; margin: 0; font-weight: 700;">${item.name}</h4>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem;">
                    <span>${item.region || 'Specialty'}</span>
                    <span>&bull;</span>
                    <span style="color: #2563eb; font-weight: 600;">${item.counter ? item.counter.split('(')[0].trim() : 'Counter 2'}</span>
                  </div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #1d4ed8; margin-top: 0.35rem;">
                    ₹${item.price} each
                  </div>
                </div>
              </div>

              <!-- Quantity Controls & Line Total -->
              <div style="display: flex; align-items: center; gap: 1.25rem;">
                <div style="display: flex; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 0.25rem 0.5rem; gap: 0.65rem;">
                  <button class="btn btn-sm btn-outline" style="padding: 0.15rem 0.6rem; font-size: 0.9rem; border-color: #93c5fd; background: #ffffff;" onclick="window.updateCartQty('${item.id}', -1)">−</button>
                  <span style="font-weight: 800; font-size: 0.95rem; color: #1e3a8a; min-width: 22px; text-align: center;">${item.qty}</span>
                  <button class="btn btn-sm btn-primary" style="padding: 0.15rem 0.6rem; font-size: 0.9rem;" onclick="window.updateCartQty('${item.id}', 1)">+</button>
                </div>

                <div style="text-align: right; min-width: 75px;">
                  <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">LINE TOTAL</div>
                  <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">₹${item.price * item.qty}</div>
                </div>

                <button class="btn btn-sm" style="background: transparent; color: #94a3b8; border: none; padding: 0.4rem; cursor: pointer; font-size: 1.1rem;" title="Remove from tray" onclick="window.removeFoodFromCart('${item.id}')">
                  ✕
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Right Column: Express Checkout & Razorpay Details -->
        <div class="card" style="padding: 1.6rem; border-radius: var(--radius-xl); border: 1.5px solid #bfdbfe; background: var(--bg-card); position: sticky; top: 1.5rem; box-shadow: var(--shadow-md);">
          <h4 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-heading);">
            <span>🧾</span> Order Summary & Pickup
          </h4>

          <!-- Express Counter Selector -->
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-weight: 700; font-size: 0.85rem; color: #1e3a8a;">
              Select Parcel Window Counter *
            </label>
            <select class="form-select" id="cart-pickup-counter" style="font-size: 0.88rem; padding: 0.6rem 0.8rem; border-color: #93c5fd; background: #ffffff;">
              <option value="Parcel Counter 2 (Express Pickup Window)" selected>Counter 2 - Express Parcel Window (East Wing)</option>
              <option value="Counter 1 (North & South Tiffin Counter)">Counter 1 - North & South Tiffin Counter</option>
              <option value="Counter 3 (Tandoor & Non-Veg Special)">Counter 3 - Tandoor & Non-Veg Special</option>
              <option value="Counter 4 (Beverages & Desserts)">Counter 4 - Beverages & Desserts Bar</option>
            </select>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.35rem;">
              ⚡ Hot parcels will be labeled with your unique Token and released via 4-digit OTP.
            </div>
          </div>

          <!-- Price Calculation Box -->
          <div style="background: #f8fafc; padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.55rem; font-size: 0.85rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">Dishes Subtotal (${cartTotalQty} item${cartTotalQty > 1 ? 's' : ''})</span>
              <span style="font-weight: 600; color: #0f172a;">₹${cartTotalPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">Eco-Friendly Thermal Parcel Packaging</span>
              <span style="font-weight: 600; color: #0f172a;">₹${packagingFee}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">Convenience & GST Fees</span>
              <span style="font-weight: 700; color: #059669;">₹0 (Subsidized by Campus)</span>
            </div>
            <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 0.75rem; margin-top: 0.25rem; display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 900; color: #1d4ed8;">
              <span>Grand Total</span>
              <span>₹${grandTotal}</span>
            </div>
          </div>

          <!-- Razorpay Official Gateway Badge -->
          <div style="background: linear-gradient(135deg, #0c2340 0%, #023e8a 100%); color: #ffffff; padding: 0.9rem 1.1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; box-shadow: 0 4px 12px rgba(2, 62, 138, 0.2);">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.15rem; font-weight: 900; letter-spacing: -0.02em;">Razorpay</span>
                <span style="background: #2563eb; color: #ffffff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">OFFICIAL GATEWAY</span>
              </div>
              <div style="font-size: 0.72rem; color: #bae6fd; margin-top: 2px;">
                UPI &bull; Google Pay &bull; PhonePe &bull; Cards &bull; NetBanking
              </div>
            </div>
            <div style="font-size: 1.6rem;">🛡️</div>
          </div>

          <!-- Primary CTA Button: Proceed to Pay via Razorpay -->
          <button 
            type="button"
            class="btn btn-primary" 
            style="width: 100%; padding: 0.9rem 1rem; font-size: 1.05rem; font-weight: 800; background: linear-gradient(135deg, #2563eb, #1d4ed8); border: none; box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4); display: flex; align-items: center; justify-content: center; gap: 0.6rem; cursor: pointer;"
            onclick="window.proceedToRazorpayPayment(${grandTotal})"
          >
            <span>Proceed to Pay</span>
            <span style="background: rgba(255,255,255,0.22); padding: 2px 10px; border-radius: 4px; font-size: 0.95rem;">₹${grandTotal}</span>
            <span>💳 →</span>
          </button>

          <!-- Alternative Option Trigger -->
          <button 
            type="button"
            class="btn btn-outline" 
            style="width: 100%; margin-top: 0.75rem; font-size: 0.82rem; border-color: var(--border-subtle); color: #475569;"
            onclick="window.openCanteenCheckoutModal()"
          >
            Other Options (Campus RFID / Cash on Delivery)
          </button>

          <div style="margin-top: 1rem; font-size: 0.74rem; color: var(--text-muted); text-align: center; line-height: 1.45;">
            🔒 256-bit encrypted checkout &bull; Instant 4-digit Collection OTP generated immediately after payment.
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. Active Orders & OTP Parcel Passes
// --------------------------------------------------------------------------
function renderCanteenMyOrdersSection(myOrders) {
  return `
    <div style="margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1rem; color: #0f172a;">🧾 Your Cafeteria Parcel Passes</h3>
      
      ${myOrders.length === 0 ? `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🍽️</div>
          <h4>No active orders placed yet</h4>
          <p style="font-size: 0.85rem; margin: 0.5rem 0 1.25rem;">Choose delicious Northern or Southern dishes from the menu and pick up your parcel at Counter 2 using your secure OTP.</p>
          <button class="btn btn-primary" onclick="window.setCanteenViewMode('menu')">Browse Today's Menu</button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;">
          ${myOrders.map(order => `
            <div class="card" style="border-color: ${order.status === 'ready_for_pickup' ? 'var(--status-available)' : order.status === 'collected' ? 'var(--border-subtle)' : '#93c5fd'}; position: relative; overflow: hidden;">
              ${order.status === 'ready_for_pickup' ? `
                <div style="position: absolute; top: 0; right: 0; background: #059669; color: #ffffff; font-weight: 800; font-size: 0.7rem; padding: 0.25rem 0.8rem; border-bottom-left-radius: var(--radius-sm); text-transform: uppercase;">
                  READY FOR COLLECTION!
                </div>
              ` : ''}

              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <div>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">ORDER TOKEN</span>
                  <div style="font-size: 1.4rem; font-weight: 800; color: #1d4ed8; font-family: var(--font-heading);">${order.token}</div>
                </div>
                <span class="badge ${order.status === 'collected' ? 'badge-available' : order.status === 'ready_for_pickup' ? 'badge-primary' : 'badge-pending'}">
                  ${order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <!-- High Visibility OTP Display Card (White & Blue) -->
              <div class="canteen-otp-card">
                <div style="font-size: 0.72rem; text-transform: uppercase; color: #475569; letter-spacing: 0.08em; font-weight: 700;">
                  PARCEL PICKUP OTP
                </div>
                <div class="canteen-otp-code">
                  ${order.otp}
                </div>
                <div style="font-size: 0.78rem; color: #2563eb; font-weight: 600;">
                  🔒 Share this 4-digit OTP at <b>${order.pickupCounter}</b>
                </div>
              </div>

              <!-- Items Breakdown -->
              <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; margin-bottom: 0.85rem; font-size: 0.82rem; background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                ${order.items.map(it => `
                  <div style="display: flex; justify-content: space-between;">
                    <span>${it.qty}x ${it.name}</span>
                    <b>₹${it.price * it.qty}</b>
                  </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem; font-weight: 800; color: #1d4ed8;">
                  <span>Total Paid</span>
                  <span>₹${order.totalAmount}</span>
                </div>
              </div>

              <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
                <span>🕒 Ordered at: ${order.time}</span>
                <span>💳 ${order.paymentMethod}</span>
              </div>

              <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-sm btn-primary" style="width: 100%;" onclick="window.openOrderPassModal('${order.id}')">
                  <span>📱</span> View Digital Pickup Pass
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. Parcel Counter Live Desk (Operator / Staff Terminal)
// --------------------------------------------------------------------------
function renderCanteenCounterDeskSection(allOrders) {
  const activeOrders = allOrders.filter(o => o.status !== 'collected');

  return `
    <div style="margin-bottom: 2rem;">
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.3rem;">PARCEL WINDOW TERMINAL</span>
            <h3 style="font-size: 1.3rem;">Express Parcel Counter #2 (Live Dispatch)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Counter operators can verify student OTPs here to dispense hot packed parcels.</p>
          </div>
          
          <!-- Instant OTP Verification Form for Staff -->
          <div style="background: #eff6ff; padding: 0.85rem 1.2rem; border-radius: var(--radius-md); border: 1px solid #bfdbfe; display: flex; align-items: center; gap: 0.6rem;">
            <input type="text" id="staff-verify-otp" placeholder="Enter 4-digit OTP" maxlength="4" style="background: #ffffff; border: 1px solid #93c5fd; color: #1e3a8a; font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; width: 140px; padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); text-align: center; outline: none; letter-spacing: 0.15rem;" />
            <button class="btn btn-sm btn-primary" onclick="window.staffVerifyOTPInput()">
              ✅ Verify & Handover
            </button>
          </div>
        </div>

        <!-- Live Queue of Waiting Parcels -->
        <h4 style="font-size: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; color: #0f172a;">
          <span>⏳</span> Pending Counter Collections (${activeOrders.length})
        </h4>

        ${activeOrders.length === 0 ? `
          <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 2rem 0;">No parcels pending collection at this counter.</p>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
            ${activeOrders.map(order => `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.1rem; display: flex; flex-direction: column; gap: 0.6rem;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">TOKEN</span>
                    <h4 style="font-size: 1.25rem; color: #1d4ed8;">${order.token}</h4>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">CUSTOMER OTP</div>
                    <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #1e40af; background: #dbeafe; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm);">${order.otp}</span>
                  </div>
                </div>

                <div style="font-size: 0.82rem; color: var(--text-primary);">
                  <b>Customer:</b> ${order.user}<br/>
                  <b>Items:</b> ${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}<br/>
                  <div style="margin-top: 0.25rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                    <span class="badge ${order.paymentMethod.includes('Cash') ? 'badge-pending' : 'badge-available'}" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${order.paymentMethod}</span>
                    ${order.paymentMethod.includes('Cash') ? `<span style="font-weight: 800; color: #b45309; font-size: 0.78rem; background: #fffbeb; padding: 0.15rem 0.4rem; border-radius: 4px; border: 1px solid #fde68a;">💵 Collect: ₹${order.totalAmount}</span>` : ''}
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
                  ${order.status === 'preparing' ? `
                    <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="window.campusState.updateCanteenOrderStatus('${order.id}', 'ready_for_pickup'); window.appRouter.renderCurrentView();">
                      Mark Ready for Pickup
                    </button>
                  ` : ''}
                  <button class="btn btn-sm btn-primary" style="flex: 1;" onclick="window.staffDirectHandover('${order.id}')">
                    Mark Handed Over
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// Helper Interactions & Handlers
// --------------------------------------------------------------------------
window.setCanteenViewMode = function(mode) {
  canteenViewMode = mode;
  window.appRouter.renderCurrentView();
};

window.setCanteenCategory = function(cat) {
  currentCanteenCategory = cat;
  window.appRouter.renderCurrentView();
};

window.toggleVegFilter = function() {
  filterVegOnly = !filterVegOnly;
  window.appRouter.renderCurrentView();
};

window.addFoodToCart = function(foodId) {
  window.campusState.addToCart(foodId);
  window.showToast('Item added to parcel tray!');
  window.appRouter.renderCurrentView();
};

window.updateCartQty = function(foodId, delta) {
  window.campusState.updateCartQty(foodId, delta);
  window.appRouter.renderCurrentView();
};

window.removeFoodFromCart = function(foodId) {
  if (!window.campusState.data.canteenCart) return;
  window.campusState.data.canteenCart = window.campusState.data.canteenCart.filter(c => c.id !== foodId);
  window.campusState.saveState();
  window.showToast('Item removed from parcel tray.');
  window.appRouter.renderCurrentView();
};

// Checkout & Digital Payment Modal
window.openCanteenCheckoutModal = function() {
  const state = window.campusState.data;
  const cart = state.canteenCart || [];
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packagingFee = 10; // eco parcel container packaging
  const total = subtotal + packagingFee;

  const modalHTML = `
    <div class="modal-backdrop active" id="canteen-checkout-modal">
      <div class="modal-container" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.5rem;">🍱</span>
            <h3>Checkout & Parcel Order</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal('canteen-checkout-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Items Summary -->
          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; border: 1px solid var(--border-subtle);">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.6rem; color: #0f172a;">Order Breakdown:</h4>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem;">
              ${cart.map(item => `
                <div style="display: flex; justify-content: space-between;">
                  <span>${item.qty}x ${item.name}</span>
                  <b>₹${item.price * item.qty}</b>
                </div>
              `).join('')}
              <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.8rem; margin-top: 0.2rem;">
                <span>Eco-Friendly Parcel Packing Fee</span>
                <span>₹${packagingFee}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; font-size: 1.05rem; font-weight: 800; color: #1d4ed8;">
                <span>Grand Total</span>
                <span>₹${total}</span>
              </div>
            </div>
          </div>

          <!-- Pickup Counter Selector -->
          <div class="form-group">
            <label class="form-label">Select Express Collection Counter *</label>
            <select class="form-select" id="order-pickup-counter">
              <option value="Parcel Counter 2 (Express Pickup Window)" selected>Counter 2 - Express Parcel Window (East Wing)</option>
              <option value="Counter 1 (North & South Tiffin Counter)">Counter 1 - North & South Tiffin Counter</option>
              <option value="Counter 3 (Tandoor & Non-Veg Special)">Counter 3 - Tandoor & Non-Veg Special</option>
              <option value="Counter 4 (Beverages & Desserts)">Counter 4 - Beverages & Desserts Bar</option>
            </select>
          </div>

          <!-- Payment Options -->
          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">Payment Method *</label>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.3rem;">
              <!-- Razorpay Featured Option -->
              <label style="background: #eff6ff; border: 1.5px solid #2563eb; border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);">
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <input type="radio" name="pay-method" value="Razorpay Online" checked />
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.45rem;">
                      <b style="font-size: 0.92rem; color: #1e3a8a;">Razorpay Secure Payment Gateway</b>
                      <span style="background: #2563eb; color: #ffffff; font-size: 0.65rem; font-weight: 800; padding: 1px 6px; border-radius: 4px;">FAST & DIRECT</span>
                    </div>
                    <div style="font-size: 0.76rem; color: #3b82f6; font-weight: 500;">UPI (Google Pay, PhonePe, Paytm), Cards & NetBanking</div>
                  </div>
                </div>
                <span style="font-size: 1.3rem;">💳</span>
              </label>

              <label style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <input type="radio" name="pay-method" value="Campus SmartCard RFID" />
                  <div>
                    <b style="font-size: 0.9rem; color: #0f172a;">Campus SmartCard (RFID)</b>
                    <div style="font-size: 0.75rem; color: #059669; font-weight: 600;">Available Balance: ₹850.00</div>
                  </div>
                </div>
                <span>🪪</span>
              </label>

              <label style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <input type="radio" name="pay-method" value="Cash on Delivery (Pay at Counter)" />
                  <div>
                    <b style="font-size: 0.9rem; color: #0f172a;">Cash on Delivery (COD)</b>
                    <div style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">Pay cash directly at the counter window upon OTP parcel collection</div>
                  </div>
                </div>
                <span>💵</span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="window.closeModal('canteen-checkout-modal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="window.confirmCanteenPayment(${total})">
            <span>🔒</span> Proceed to Pay ₹${total}
          </button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.confirmCanteenPayment = function(totalAmount) {
  const counterEl = document.getElementById('order-pickup-counter');
  const counter = counterEl ? counterEl.value : 'Parcel Counter 2 (Express Pickup Window)';
  const payMethod = document.querySelector('input[name="pay-method"]:checked')?.value || 'Razorpay Online';

  // If Razorpay chosen, trigger official Razorpay Checkout Flow
  if (payMethod.includes('Razorpay')) {
    window.closeModal('canteen-checkout-modal');
    window.proceedToRazorpayPayment(totalAmount, counter);
    return;
  }

  const order = window.campusState.placeCanteenOrder({
    totalAmount,
    pickupCounter: counter,
    paymentMethod: payMethod
  });

  window.closeModal('canteen-checkout-modal');
  const isCOD = payMethod.includes('Cash');
  const msg = isCOD 
    ? `Order ${order.token} placed (Cash on Delivery: ₹${totalAmount})! Pay at counter. OTP: ${order.otp}.`
    : `Payment of ₹${totalAmount} received! Your OTP is ${order.otp}.`;
  window.showToast(msg);
  
  // Switch to My Orders and open digital pass
  canteenViewMode = 'my_orders';
  window.appRouter.renderCurrentView();
  window.openOrderPassModal(order.id);
};

// --------------------------------------------------------------------------
// Razorpay Standard Integration Flow
// --------------------------------------------------------------------------
window.proceedToRazorpayPayment = function(totalAmount, pickupCounter) {
  const state = window.campusState.data;
  const cart = state.canteenCart || [];
  
  if (cart.length === 0) {
    window.showToast('Your parcel tray is empty! Please add some delicacies first.');
    return;
  }

  // Calculate total if not provided
  if (!totalAmount) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalAmount = subtotal + 10; // packaging fee
  }

  // Resolve counter
  let counter = pickupCounter;
  if (!counter) {
    const counterEl = document.getElementById('cart-pickup-counter') || document.getElementById('order-pickup-counter');
    counter = counterEl ? counterEl.value : 'Parcel Counter 2 (Express Pickup Window)';
  }

  const user = state.currentUser || { name: 'Campus Student', email: 'student@smartcampus.edu' };
  const itemsSummary = cart.map(i => `${i.qty}x ${i.name}`).join(', ');

  // Check if Razorpay Checkout SDK is loaded
  if (typeof window.Razorpay === 'undefined') {
    const proceedWithFallback = confirm('Razorpay checkout SDK is loading or unavailable. Would you like to proceed with campus simulated instant checkout?');
    if (proceedWithFallback) {
      const simPaymentId = 'rzp_sim_' + Math.floor(100000 + Math.random() * 900000);
      const order = window.campusState.placeCanteenOrder({
        totalAmount: totalAmount,
        pickupCounter: counter,
        paymentMethod: `Razorpay Online (${simPaymentId})`,
        razorpayPaymentId: simPaymentId
      });
      window.campusState.clearCart();
      canteenViewMode = 'my_orders';
      window.appRouter.renderCurrentView();
      window.openOrderPassModal(order.id);
      window.showToast(`🎉 Order Placed! Razorpay Ref: ${simPaymentId}. OTP: ${order.otp}`);
    }
    return;
  }

  // Official Razorpay Checkout Configuration
  const options = {
    key: 'rzp_test_TgNoq5ZbtB5tOp',
    amount: Math.round(totalAmount * 100), // in paise (e.g., ₹170 = 17000 paise)
    currency: 'INR',
    name: 'XPANCION SMART CAMPUS',
    description: `Canteen Parcel Tray Order (${cart.length} item${cart.length > 1 ? 's' : ''})`,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80',
    prefill: {
      name: user.name || 'Campus Student',
      email: user.email || 'student@smartcampus.edu',
      contact: '9876543210'
    },
    notes: {
      pickup_counter: counter,
      campus: 'XPANCION SMART CAMPUS',
      items: itemsSummary.slice(0, 100)
    },
    theme: {
      color: '#2563eb'
    },
    handler: function (response) {
      const paymentId = response.razorpay_payment_id || `pay_${Date.now()}`;
      
      // Successfully paid! Register order in campus state
      const order = window.campusState.placeCanteenOrder({
        totalAmount: totalAmount,
        pickupCounter: counter,
        paymentMethod: `Razorpay Online (${paymentId})`,
        razorpayPaymentId: paymentId
      });

      // Clear the Cart
      window.campusState.clearCart();

      // Close modal if open
      window.closeModal('canteen-checkout-modal');

      // Navigate to My Orders and open digital collection pass
      canteenViewMode = 'my_orders';
      window.appRouter.renderCurrentView();
      window.openOrderPassModal(order.id);

      window.showToast(`🎉 Payment Successful! Razorpay ID: ${paymentId}. Your Pickup OTP is ${order.otp}.`);
    },
    modal: {
      ondismiss: function() {
        window.showToast('Razorpay payment cancelled.');
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      const reason = response.error ? response.error.description : 'Transaction was not completed';
      window.showToast(`❌ Payment Failed: ${reason}`);
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay invocation error:', err);
    window.showToast('Error initializing Razorpay: ' + err.message);
  }
};

// Digital Parcel Pickup Pass & OTP Modal (White & Blue)
window.openOrderPassModal = function(orderId) {
  const state = window.campusState.data;
  const order = (state.canteenOrders || []).find(o => o.id === orderId);
  if (!order) return;

  const modalHTML = `
    <div class="modal-backdrop active" id="order-pass-modal">
      <div class="modal-container" style="max-width: 440px; text-align: center;">
        <div class="modal-header">
          <h3>📦 Parcel Collection Pass</h3>
          <button class="modal-close" onclick="window.closeModal('order-pass-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #bfdbfe; border-radius: var(--radius-lg); padding: 1.4rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: #1d4ed8; letter-spacing: 0.1em; font-weight: 800;">
              SMARTCAMPUS CAFETERIA PARCEL PASS
            </div>

            <div style="margin: 0.5rem 0;">
              <span style="font-size: 0.8rem; color: #475569; font-weight: 600;">ORDER TOKEN</span>
              <div style="font-size: 2.2rem; font-weight: 900; color: #1e3a8a; font-family: var(--font-heading);">${order.token}</div>
            </div>

            <!-- Prominent OTP Code Block -->
            <div style="background: #ffffff; border: 2px dashed #2563eb; border-radius: var(--radius-md); padding: 1rem; margin: 1rem 0; box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">
                COLLECTION OTP
              </div>
              <div style="font-size: 2.6rem; font-weight: 900; letter-spacing: 0.35em; color: #1d4ed8; font-family: var(--font-heading); margin: 0.2rem 0;">
                ${order.otp}
              </div>
              <div style="font-size: 0.78rem; color: #059669; font-weight: 600;">
                Show or read this code at the parcel window
              </div>
            </div>

            <div style="font-size: 0.88rem; color: #0f172a; font-weight: 700;">
              📍 ${order.pickupCounter}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
              Status: <b style="color: #2563eb;">${order.status.replace(/_/g, ' ').toUpperCase()}</b> &bull; ${order.estimatedReady}
            </div>
            <div style="margin-top: 0.45rem;">
              <span class="badge ${order.paymentMethod.includes('Cash') ? 'badge-pending' : 'badge-available'}">
                💳 ${order.paymentMethod}
              </span>
              ${order.paymentMethod.includes('Cash') ? `
                <div style="margin-top: 0.4rem; font-size: 0.78rem; font-weight: 700; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm); padding: 0.35rem 0.6rem;">
                  💵 Cash on Delivery: Please pay ₹${order.totalAmount} in cash at the counter window.
                </div>
              ` : ''}
            </div>

            <!-- QR Code for fast contactless counter scanner -->
            <div class="qr-code-box" style="margin: 1.25rem auto 0; width: 140px; height: 140px; padding: 0.75rem; background: #ffffff; border: 1px solid #bfdbfe; border-radius: var(--radius-md);">
              <svg viewBox="0 0 100 100" width="115" height="115">
                <rect x="5" y="5" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="13" y="13" width="9" height="9" fill="#1e3a8a" />
                <rect x="70" y="5" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="78" y="13" width="9" height="9" fill="#1e3a8a" />
                <rect x="5" y="70" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="13" y="78" width="9" height="9" fill="#1e3a8a" />
                <rect x="35" y="10" width="10" height="10" fill="#2563eb" />
                <rect x="50" y="15" width="15" height="5" fill="#1e3a8a" />
                <rect x="35" y="35" width="30" height="30" fill="#3b82f6" rx="4" />
                <rect x="70" y="50" width="15" height="8" fill="#1e3a8a" />
                <rect x="40" y="75" width="20" height="10" fill="#2563eb" />
              </svg>
            </div>
          </div>

          <p style="font-size: 0.78rem; color: var(--text-muted);">
            Once food is packed, staff will call token <b>${order.token}</b>. Share OTP <b>${order.otp}</b> to collect your parcel.
          </p>
        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button class="btn btn-secondary" onclick="window.closeModal('order-pass-modal')">Done</button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

// Staff Terminal Verification Logic
window.staffVerifyOTPInput = function() {
  const input = document.getElementById('staff-verify-otp');
  if (!input || !input.value.trim()) {
    window.showToast('Please type a 4-digit OTP.');
    return;
  }

  const otp = input.value.trim();
  const state = window.campusState.data;
  const match = (state.canteenOrders || []).find(o => o.otp === otp && o.status !== 'collected');

  if (match) {
    const res = window.campusState.verifyCanteenOTP(match.id, otp);
    if (res.success) {
      window.showToast(`✅ OTP ${otp} Verified! Parcel for Token ${match.token} handed over.`);
      input.value = '';
      window.appRouter.renderCurrentView();
    }
  } else {
    window.showToast(`❌ Invalid OTP: No pending order found for OTP "${otp}".`);
  }
};

window.staffDirectHandover = function(orderId) {
  const order = window.campusState.data.canteenOrders.find(o => o.id === orderId);
  if (order) {
    window.campusState.verifyCanteenOTP(orderId, order.otp);
    window.showToast(`Parcel for token ${order.token} marked as collected!`);
    window.appRouter.renderCurrentView();
  }
};
