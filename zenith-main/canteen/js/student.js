/**
 * Smart Canteen Management Platform
 * Student Portal Logic - Modern Clean Premium Black & Lavender Theme
 */

class StudentPortal {
  constructor(storage, audio) {
    this.storage = storage;
    this.audio = audio;
    this.cart = [];
    this.activeCategory = "all";
    this.activeDietary = "all";
    this.searchQuery = "";
    this.activeTab = "home"; // 'home' | 'menu' | 'orders' | 'tracker' | 'wallet' | 'favorites' | 'feedback' | 'profile'
    this.selectedPickupTime = "ASAP";
    this.selectedPaymentMethod = "Campus Wallet";
    this.currentTrackingOrderId = null;

    this.init();
  }

  init() {
    this.storage.on("menuUpdated", () => {
      if (this.activeTab === "menu" || this.activeTab === "home") this.renderActiveView();
      if (this.activeTab === "favorites") this.renderFavorites();
    });
    this.storage.on("ordersUpdated", () => {
      this.updateActiveOrderPill();
      if (this.activeTab === "tracker") this.renderOrderTracker();
      if (this.activeTab === "orders") this.renderPastOrders();
    });
    this.storage.on("userUpdated", () => {
      this.updateHeaderUserInfo();
      if (this.activeTab === "favorites") this.renderFavorites();
      if (this.activeTab === "wallet") this.renderWalletView();
      if (this.activeTab === "profile") this.renderProfileView();
    });

    // Check for existing active order
    const orders = this.storage.getOrders();
    const user = this.storage.getUser();
    const activeOrder = orders.find(o => 
      o.userId === user.id && 
      !["COLLECTED", "CANCELLED"].includes(o.orderStatus)
    );
    if (activeOrder) {
      this.currentTrackingOrderId = activeOrder.id;
    }
  }

  // --- Cart Operations ---
  addToCart(itemId) {
    const item = this.storage.getMenuItems().find(i => i.id === itemId);
    if (!item || !item.available) return;

    const existing = this.cart.find(c => c.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg,
        image: item.image,
        quantity: 1
      });
    }

    this.audio.playTap();
    this.renderActiveView();
    this.renderCart();
    this.updateCartBadge();
  }

  updateCartQty(itemId, delta) {
    const idx = this.cart.findIndex(c => c.itemId === itemId);
    if (idx !== -1) {
      this.cart[idx].quantity += delta;
      if (this.cart[idx].quantity <= 0) {
        this.cart.splice(idx, 1);
      }
    }
    this.audio.playTap();
    this.renderActiveView();
    this.renderCart();
    this.updateCartBadge();
  }

  clearCart() {
    this.cart = [];
    this.renderActiveView();
    this.renderCart();
    this.updateCartBadge();
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.round(subtotal * 0.10 * 100) / 100; // 10% Campus discount
    const gst = Math.round((subtotal - discount) * 0.05 * 100) / 100; // 5% GST
    const total = Math.max(0, Math.round((subtotal - discount + gst) * 100) / 100);
    return { subtotal, discount, gst, total };
  }

  updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const count = this.cart.reduce((acc, i) => acc + i.quantity, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  toggleFavorite(itemId, event) {
    if (event) event.stopPropagation();
    const isFav = this.storage.toggleFavorite(itemId);
    this.audio.playTap();
    this.renderActiveView();
    window.app.showToast(
      isFav ? "Saved to Favorites" : "Removed from Favorites",
      isFav ? "Dish added to your campus favorites list." : "Dish removed from favorites.",
      isFav ? "heart" : "info"
    );
  }

  // --- Render Food Card HTML (Liquid Glass Wok Aesthetic) ---
  renderFoodCard(item) {
    const user = this.storage.getUser();
    const isFav = (user.favorites || []).includes(item.id);
    const inCart = this.cart.find(c => c.itemId === item.id);
    const isAvailable = item.available && item.stockQuantity > 0;
    const isLowStock = isAvailable && item.stockQuantity <= 5;

    let availBadge = `<span class="status-badge available"><span class="diet-dot veg-dot" style="width:6px; height:6px;"></span> Available</span>`;
    if (!isAvailable) {
      availBadge = `<span class="status-badge sold-out">Sold Out</span>`;
    } else if (isLowStock) {
      availBadge = `<span class="status-badge low-stock">Only ${item.stockQuantity} Left!</span>`;
    }

    let btnHtml = "";
    if (!isAvailable) {
      btnHtml = `<button class="btn-primary" disabled style="opacity: 0.6; cursor: not-allowed;">Sold Out</button>`;
    } else if (inCart) {
      btnHtml = `
        <div class="quantity-stepper">
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span class="stepper-value">${inCart.quantity}</span>
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      `;
    } else {
      btnHtml = `
        <button class="btn-primary" onclick="window.studentPortal.addToCart('${item.id}')">
          <svg class="ui-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add to Tray</span>
        </button>
      `;
    }

    const favIconSvg = isFav
      ? `<svg class="ui-icon heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
      : `<svg class="ui-icon heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

    return `
      <div class="food-card ${!isAvailable ? 'sold-out' : ''}" data-id="${item.id}">
        <div class="food-card-thumb">
          <img src="${item.image}" alt="${item.name}" class="food-card-img" loading="lazy" onerror="this.src='assets/chicken_biryani.jpg'" />
          ${item.isSpecial ? `
            <div class="card-tag-badge">
              <svg class="ui-icon star-icon" width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${item.tag || "Today's Special"}</span>
            </div>
          ` : ''}
          <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="window.studentPortal.toggleFavorite('${item.id}', event)" title="${isFav ? 'Remove favorite' : 'Add to favorites'}">
            ${favIconSvg}
          </button>
          <div class="card-veg-symbol">
            <span class="${item.isVeg ? 'symbol-veg' : 'symbol-nonveg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
          </div>
        </div>
        <div class="food-card-content">
          <div class="food-name-row">
            <h3 class="food-name-title">${item.name}</h3>
            <div class="food-rating-tag">
              <svg class="ui-icon star-icon" width="12" height="12" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${item.rating || 4.8}</span>
            </div>
          </div>
          <p class="food-brief">${item.description}</p>
          <div class="food-status-row">
            ${availBadge}
            <span class="prep-time-text">
              <svg class="ui-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>~${item.prepTimeMinutes || 8} mins</span>
            </span>
          </div>
          <div class="food-card-bottom">
            <div class="food-price-amount">₹${item.price}</div>
            ${btnHtml}
          </div>
        </div>
      </div>
    `;
  }

  filterByCategory(catId) {
    this.activeCategory = catId;
    document.querySelectorAll(".cat-pill-btn").forEach(p => {
      p.classList.toggle("active", p.dataset.cat === catId);
    });
    this.switchStudentTab("menu");
  }

  handleSubscribe(event) {
    if (event) event.preventDefault();
    const input = document.getElementById("newsletter-email");
    const val = input ? input.value.trim() : "";
    if (!val || !val.includes("@")) {
      window.app.showToast("Please enter a valid email", "Enter your campus student or staff email.", "warning");
      return;
    }
    if (input) input.value = "";
    this.audio.playSuccess();
    window.app.showToast("Subscribed to Campus Bites!", "You'll receive exclusive daily lunch deals & chef specials.", "success");
  }

  // --- Home Tab View (Replica of Reference Layout) ---
  renderHomeView() {
    const container = document.getElementById("student-home-view");
    if (!container) return;

    const items = this.storage.getMenuItems();
    const specials = items.filter(i => i.isSpecial);
    const popular = items.filter(i => !i.isSpecial);
    const fanFavorites = [...specials, ...popular].slice(0, 4);

    container.innerHTML = `
      <!-- 1. Category Explorer (Something For Every Craving) -->
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem;">
        <div>
          <div class="section-kicker">EXPLORE OUR MENU</div>
          <h2 class="section-title">Something For Every Craving.</h2>
          <p class="section-subtitle">Wok noodles, fragrant rice bowls, crisp tiffins, and fresh drinks—made daily with real ingredients.</p>
        </div>
        <button class="btn-secondary" onclick="window.studentPortal.switchStudentTab('menu')">
          View Full Menu →
        </button>
      </div>

      <div class="category-explorer-grid">
        <div class="category-bubble-card" onclick="window.studentPortal.filterByCategory('lunch')">
          <div class="category-thumb-wrapper">
            <img src="assets/hero_noodles.jpg" alt="Wok Noodles" class="category-thumb-img" />
          </div>
          <div class="category-card-name">Wok Noodles</div>
          <div class="category-card-desc">Wok-fired goodness & spice</div>
        </div>

        <div class="category-bubble-card" onclick="window.studentPortal.filterByCategory('lunch')">
          <div class="category-thumb-wrapper">
            <img src="assets/paneer_fried_rice.jpg" alt="Rice Bowls" class="category-thumb-img" />
          </div>
          <div class="category-card-name">Rice Bowls</div>
          <div class="category-card-desc">Hearty, wholesome & satisfying</div>
        </div>

        <div class="category-bubble-card" onclick="window.studentPortal.filterByCategory('breakfast')">
          <div class="category-thumb-wrapper">
            <img src="assets/masala_dosa.jpg" alt="Breakfast & Tiffins" class="category-thumb-img" />
          </div>
          <div class="category-card-name">Breakfast & Tiffins</div>
          <div class="category-card-desc">Crisp dosas, idlis & filter coffee</div>
        </div>

        <div class="category-bubble-card" onclick="window.studentPortal.filterByCategory('snacks')">
          <div class="category-thumb-wrapper">
            <img src="assets/samosa_chai.jpg" alt="Snacks & Bites" class="category-thumb-img" />
          </div>
          <div class="category-card-name">Snacks & Bites</div>
          <div class="category-card-desc">Crispy samosas & hot masala chai</div>
        </div>

        <div class="category-bubble-card" onclick="window.studentPortal.filterByCategory('beverages')">
          <div class="category-thumb-wrapper">
            <img src="assets/lime_juice.jpg" alt="Cold Beverages" class="category-thumb-img" />
          </div>
          <div class="category-card-name">Drinks & Juices</div>
          <div class="category-card-desc">Refreshing, chilled & bold</div>
        </div>
      </div>

      <!-- 2. Signature Dishes (Fan Favorites) -->
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem;">
        <div>
          <div class="section-kicker">SIGNATURE DISHES</div>
          <h2 class="section-title">Fan Favorites</h2>
          <p class="section-subtitle">Our most-loved campus bowls. Try them once, crave them forever.</p>
        </div>
        <button class="btn-secondary" onclick="window.studentPortal.switchStudentTab('menu')">
          Explore All Dishes →
        </button>
      </div>

      <div class="food-grid">
        ${fanFavorites.map(item => this.renderFoodCard(item)).join("")}
      </div>

      <!-- 3. Limited Time Promo Wide Banner -->
      <div class="promo-wide-banner">
        <div class="promo-text-wrap">
          <div class="promo-badge-tag">LIMITED TIME SPECIAL</div>
          <h3 class="promo-title">Sizzling Paneer Fried Rice & Dum Biryani Combo</h3>
          <p class="promo-desc">
            Wok-seared paneer cubes, crunchy bell peppers, tossed in fragrant spices and savory chili glaze. Cooked fresh to order in limited daily campus lunch batches.
          </p>
          <button class="promo-banner-cta" onclick="window.studentPortal.addToCart('item_3')">
            <span>Order Special Now</span>
            <span>↗</span>
          </button>
        </div>
        <div class="promo-visual-wrap">
          <img src="assets/paneer_fried_rice.jpg" alt="Limited Time Special" class="promo-dish-img" />
          <div class="promo-floating-sticker">
            <span>LIMITED</span>
            <span>TIME</span>
            <span>ONLY</span>
          </div>
        </div>
      </div>

      <!-- 4. Dining With Purpose & Student Reviews Spotlight -->
      <div class="spotlight-two-col">
        <div class="spotlight-card">
          <div class="spotlight-kicker">OUR STORY</div>
          <h3 class="spotlight-title">Dining With Purpose.</h3>
          <p class="spotlight-desc">
            At Campus Canteen, we believe good food fuels great minds. Every bowl and thali is cooked fresh daily with locally sourced ingredients, aromatic spices, and zero compromise on hygiene.
          </p>
          <div class="spotlight-photo-wrap">
            <img src="assets/canteen_kitchen.jpg" alt="Campus Kitchen" />
          </div>
        </div>

        <div class="spotlight-card">
          <div class="spotlight-kicker">WHAT PEOPLE ARE SAYING</div>
          <div class="quote-stars-row" style="display: flex; gap: 4px; color: #FFB800;">
            <svg class="ui-icon star-icon" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg class="ui-icon star-icon" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg class="ui-icon star-icon" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg class="ui-icon star-icon" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg class="ui-icon star-icon" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="quote-text">
            “The flavors are incredible, and skipping the 20-minute physical lunch rush queue with live token tracking on my phone has been a total game-changer for my study schedule!”
          </p>
          <div class="quote-author-info">
            <img src="assets/student_dining.jpg" alt="Student Jessica" class="quote-author-avatar" />
            <div>
              <div class="quote-author-name">Jessica M.</div>
              <div class="quote-author-role">Computer Science & Eng. • Class of '26</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Rewards & Campus Perks (Eat More. Earn More.) -->
      <div class="rewards-perks-section">
        <div class="rewards-left-info">
          <div class="rewards-kicker">CAMPUS REWARDS</div>
          <h3 class="rewards-title">Eat More.<br />Earn More.</h3>
          <p class="rewards-desc">Join Campus Rewards for free and start earning points on every order. Redeem for exclusive meal discounts and perks.</p>
          <button class="btn-primary" style="align-self: flex-start;" onclick="window.studentPortal.switchStudentTab('menu')">
            <span>Explore Menu</span>
            <svg class="ui-icon arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </button>
        </div>

        <div class="rewards-cards-grid">
          <div class="reward-pillar-card">
            <div class="reward-icon">
              <svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div class="reward-card-title">1 Point Per ₹10</div>
            <div class="reward-card-sub">Instant reward points credited on every online meal order</div>
          </div>

          <div class="reward-pillar-card">
            <div class="reward-icon">
              <svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div class="reward-card-title">Exclusive Deals</div>
            <div class="reward-card-sub">Special flash lunch discounts and student combos</div>
          </div>

          <div class="reward-pillar-card">
            <div class="reward-icon">
              <svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            </div>
            <div class="reward-card-title">Birthday Treats</div>
            <div class="reward-card-sub">Enjoy a complimentary sweet dessert or cold beverage</div>
          </div>

          <div class="reward-pillar-card">
            <div class="reward-icon">
              <svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div class="reward-card-title">Skip The Queue</div>
            <div class="reward-card-sub">Priority counter pickup and automated token alerts</div>
          </div>
        </div>
      </div>

      <!-- 6. Skip The Line. Order On Campus Banner -->
      <div class="skip-line-banner">
        <div class="skip-line-text">
          <h3>Skip The Line. Order Directly.</h3>
          <p>Order ahead on your laptop or phone, track your food preparation in real time, and walk straight to the counter when your token flashes green.</p>
        </div>
        <div class="skip-badges-wrap">
          <div class="mockup-app-pill" onclick="window.studentPortal.switchStudentTab('menu')">
            <svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Start Quick Order</span>
          </div>
          <div class="qr-code-pill" title="Scan to Order on Mobile">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="#FF5E00"/>
              <rect x="11" y="11" width="18" height="18" rx="2" fill="#FFFFFF"/>
              <rect x="15" y="15" width="10" height="10" fill="#FF5E00"/>
              <rect x="65" y="5" width="30" height="30" rx="4" fill="#FF5E00"/>
              <rect x="71" y="11" width="18" height="18" rx="2" fill="#FFFFFF"/>
              <rect x="75" y="15" width="10" height="10" fill="#FF5E00"/>
              <rect x="5" y="65" width="30" height="30" rx="4" fill="#FF5E00"/>
              <rect x="11" y="71" width="18" height="18" rx="2" fill="#FFFFFF"/>
              <rect x="15" y="75" width="10" height="10" fill="#FF5E00"/>
              <rect x="42" y="15" width="14" height="24" fill="#FF5E00"/>
              <rect x="42" y="45" width="20" height="20" fill="#FF5E00"/>
              <rect x="68" y="48" width="16" height="8" fill="#FF5E00"/>
              <rect x="45" y="72" width="12" height="18" fill="#FF5E00"/>
              <rect x="72" y="68" width="18" height="18" fill="#FF5E00"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 7. Canteen Counters & Operating Hours -->
      <div class="section-header">
        <div class="section-kicker">LOCATIONS & SERVICE TIMES</div>
        <h2 class="section-title">Find Our Canteen Counters</h2>
        <p class="section-subtitle">Fresh meals are cooked across three specialized campus counters</p>
      </div>

      <div class="canteen-counters-grid">
        <div class="counter-location-card">
          <div class="counter-icon">
            <svg class="ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"/></svg>
          </div>
          <div class="counter-name">Main Dining Hall</div>
          <div class="counter-address">Ground Floor, Student Activity Center</div>
          <div class="counter-hours-badge">Open: 8:00 AM – 9:00 PM</div>
        </div>

        <div class="counter-location-card">
          <div class="counter-icon">
            <svg class="ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div class="counter-name">Express Wok & Quick Bites</div>
          <div class="counter-address">Counter 2, East Concourse Quad</div>
          <div class="counter-hours-badge">Open: 11:30 AM – 3:30 PM</div>
        </div>

        <div class="counter-location-card">
          <div class="counter-icon">
            <svg class="ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
          </div>
          <div class="counter-name">Beverage & Café Lounge</div>
          <div class="counter-address">Library North Garden Pavilion</div>
          <div class="counter-hours-badge">Open: 8:00 AM – 10:00 PM</div>
        </div>
      </div>

      <!-- 8. Stay In The Loop Newsletter -->
      <div class="stay-loop-strip">
        <div class="stay-loop-left">
          <h3>Stay In The Loop.</h3>
          <p>Get exclusive campus offers, new seasonal menu drops, and flash lunch notifications.</p>
        </div>
        <form class="stay-loop-form" onsubmit="window.studentPortal.handleSubscribe(event)">
          <input type="email" id="newsletter-email" class="stay-loop-input" placeholder="Enter your campus email..." required />
          <button type="submit" class="stay-loop-btn">Sign Up</button>
        </form>
      </div>
    `;
  }

  // --- Full Menu View ---
  renderMenu() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;

    const items = this.storage.getMenuItems();
    const filtered = items.filter(item => {
      // Category filter
      if (this.activeCategory === "specials" && !item.isSpecial) return false;
      if (this.activeCategory !== "all" && this.activeCategory !== "specials" && item.category !== this.activeCategory) return false;

      // Dietary filter
      if (this.activeDietary === "veg" && !item.isVeg) return false;
      if (this.activeDietary === "nonveg" && item.isVeg) return false;

      // Search filter
      if (this.searchQuery.trim() !== "") {
        const q = this.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        const matchesTag = (item.tag || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary); background: #FFFFFF; border-radius: var(--radius-md); border: 1.5px solid var(--glass-border-subtle); box-shadow: var(--glass-shadow);">
          <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 0.85rem; color: var(--brand-orange);">
            <svg class="ui-icon" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <svg class="ui-icon" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin-bottom: 0.35rem; color: var(--text-dark);">No matching food items</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">Try selecting a different category, veg/non-veg filter, or keyword search.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => this.renderFoodCard(item)).join("");
  }

  // --- Favorites Tab View ---
  renderFavorites() {
    const container = document.getElementById("student-favorites-view");
    if (!container) return;

    const user = this.storage.getUser();
    const favIds = user.favorites || [];
    const allItems = this.storage.getMenuItems();
    const favItems = allItems.filter(i => favIds.includes(i.id));

    if (favItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px solid var(--glass-border-subtle); box-shadow: var(--glass-shadow); max-width: 600px; margin: 2rem auto;">
          <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--brand-orange);">
            <svg class="ui-icon heart-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.4rem;">No Favorites Saved Yet</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.75rem; font-size: 0.92rem;">Tap the heart icon on any dish to save your campus favorites here!</p>
          <button class="btn-primary" onclick="window.studentPortal.switchStudentTab('menu')">
            <span>Explore Daily Menu</span>
            <svg class="ui-icon arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="section-header">
        <h2 class="section-title" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <svg class="ui-icon heart-icon" width="24" height="24" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <span>Your Campus Favorites (${favItems.length})</span>
        </h2>
        <p class="section-subtitle">Quickly re-order the dishes you love the most</p>
      </div>
      <div class="food-grid">
        ${favItems.map(item => this.renderFoodCard(item)).join("")}
      </div>
    `;
  }

  // --- Profile View ---
  renderProfileView() {
    const container = document.getElementById("student-profile-view");
    if (!container) return;

    const auth = window.canteenAuth;
    const isAuthed = auth && auth.isAuthenticated();
    const user = isAuthed ? (auth.getUser() || this.storage.getUser()) : this.storage.getUser();

    if (!isAuthed) {
      container.innerHTML = `
        <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--glass-shadow-intense); text-align: center;">
          <div style="width: 72px; height: 72px; border-radius: 22px; background: rgba(255, 94, 0, 0.1); color: var(--brand-orange-deep); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <svg class="ui-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 class="section-title" style="margin-bottom: 0.5rem; font-size: 1.6rem;">Sign In to Your Campus Account</h2>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.8rem; line-height: 1.5;">
            Login with your Google account or campus credentials to manage your food orders, track live kitchen status, and access campus member benefits.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
            <button class="btn-primary" style="width: 100%; max-width: 320px; padding: 0.85rem 1.5rem;" onclick="window.canteenAuth.openAuthModal()">
              <span>Sign In or Register</span>
              <svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button class="btn-secondary" style="width: 100%; max-width: 320px;" onclick="window.studentPortal.switchStudentTab('menu')">
              Browse Daily Menu
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="max-width: 680px; margin: 0 auto; background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--glass-shadow-intense);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border-subtle); padding-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 68px; height: 68px; border-radius: 20px; background: var(--brand-gradient); color: #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px -2px rgba(255, 94, 0, 0.45); flex-shrink: 0; font-size: 1.6rem; font-weight: 800;">
              ${(user.displayName || user.name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 class="section-title" style="margin-bottom: 0.25rem; text-align: left; font-size: 1.75rem;">${user.displayName || user.name}</h2>
              <div style="font-size: 0.88rem; color: var(--text-secondary);">Campus ID: <strong style="color: var(--brand-orange-deep); font-weight: 800;">${user.studentId || "CS-2024"}</strong></div>
            </div>
          </div>
          <button class="btn-secondary" style="color: var(--error); border-color: rgba(239, 68, 68, 0.3); font-size: 0.82rem; padding: 0.45rem 0.85rem;" onclick="window.canteenAuth.signOut()">
            <svg class="ui-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.15rem; font-size: 0.92rem;">
          <div style="display: flex; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--glass-border-subtle);">
            <span style="color: var(--text-secondary); font-weight: 600;">Email Address</span>
            <span style="font-weight: 700; color: var(--text-dark);">${user.email}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--glass-border-subtle);">
            <span style="color: var(--text-secondary); font-weight: 600;">Phone Number</span>
            <span style="font-weight: 700; color: var(--text-dark);">${user.phone || "+91 98765 43210"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--glass-border-subtle);">
            <span style="color: var(--text-secondary); font-weight: 600;">Authentication Provider</span>
            <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 800; color: var(--brand-orange-deep);">
              <svg class="ui-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Firebase Verified</span>
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--glass-border-subtle);">
            <span style="color: var(--text-secondary); font-weight: 600;">Payment Gateway</span>
            <span style="font-weight: 800; color: var(--brand-orange-deep);">Razorpay Active</span>
          </div>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-primary" onclick="window.studentPortal.switchStudentTab('menu')">
            <span>Browse Daily Menu</span>
            <svg class="ui-icon arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </button>
          <button class="btn-secondary" onclick="window.studentPortal.switchStudentTab('orders')">
            View Order Receipts
          </button>
          <button class="btn-secondary" onclick="window.canteenAuth.openAuthModal()">
            Switch Account
          </button>
        </div>
      </div>
    `;
  }

  // --- Feedback View ---
  renderFeedbackView() {
    const container = document.getElementById("student-feedback-view");
    if (!container) return;

    const feedbackList = this.storage.getFeedback();

    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="section-title" style="display: flex; align-items: center; gap: 0.5rem; text-align: left;">
              <svg class="ui-icon star-icon" width="22" height="22" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Student Dining Reviews & Feedback</span>
            </h2>
            <p class="section-subtitle" style="text-align: left;">Real feedback from campus peers on food taste, kitchen hygiene, and pickup speed</p>
          </div>
          <button class="btn-primary" onclick="window.studentPortal.openGeneralFeedbackModal()">
            <span>+ Write a Review</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${feedbackList.map(fb => `
            <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--glass-shadow);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div>
                  <strong style="color: var(--text-dark); font-size: 0.95rem;">${fb.userName}</strong>
                  <span style="font-size: 0.8rem; color: var(--brand-orange-deep); margin-left: 0.5rem; font-weight: 700;">Token #${fb.tokenNumber} • ${fb.createdAt}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.35rem; color: #FFB800; font-weight: 800; font-size: 0.95rem;">
                  <svg class="ui-icon star-icon" width="16" height="16" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>${fb.ratingFood || 5}.0</span>
                </div>
              </div>

              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                "${fb.comment || 'Good food and quick service.'}"
              </p>

              ${fb.reply ? `
                <div style="background: var(--bg-surface-warm); border-left: 3px solid var(--brand-orange); padding: 0.75rem 1rem; border-radius: 4px; font-size: 0.85rem;">
                  <strong style="color: var(--brand-orange-deep);">Canteen Response:</strong>
                  <span style="color: var(--text-secondary); margin-left: 4px;">${fb.reply}</span>
                </div>
              ` : ''}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // --- Cart Drawer Rendering ---
  renderCart() {
    const list = document.getElementById("cart-items-list");
    const footer = document.getElementById("cart-footer");
    if (!list || !footer) return;

    if (this.cart.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 3.5rem 1rem; color: var(--text-secondary);">
          <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--brand-orange);">
            <svg class="ui-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </div>
          <p style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.35rem;">Your tray is empty</p>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Add some mouth-watering campus meals from the menu!</p>
        </div>
      `;
      footer.style.display = "none";
      return;
    }

    footer.style.display = "block";
    list.innerHTML = this.cart.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.85rem; padding: 0.95rem; background: #FFFFFF; border-radius: var(--radius-md); border: 1.5px solid var(--glass-border-subtle); box-shadow: 0 4px 14px rgba(220, 110, 30, 0.06);">
        <img src="${item.image}" alt="${item.name}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(0,0,0,0.06);" onerror="this.src='assets/chicken_biryani.jpg'" />
        <div style="flex: 1;">
          <div style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--text-dark); line-height: 1.25; margin-bottom: 0.2rem;">${item.name}</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); font-weight: 600;">₹${item.price} × ${item.quantity} = <strong style="color: var(--brand-orange-deep); font-weight: 800;">₹${item.price * item.quantity}</strong></div>
        </div>
        <div class="quantity-stepper">
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.itemId}', -1)">−</button>
          <span class="stepper-value">${item.quantity}</span>
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.itemId}', 1)">+</button>
        </div>
      </div>
    `).join("");

    const { subtotal, discount, gst, total } = this.getCartTotals();

    footer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.25rem; font-size: 0.88rem;">
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Subtotal</span>
          <span style="font-weight: 700; color: var(--text-dark);">₹${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 700;">
          <span>Campus Subsidy (10%)</span>
          <span>-₹${discount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>GST (5%)</span>
          <span style="font-weight: 700; color: var(--text-dark);">₹${gst.toFixed(2)}</span>
        </div>
        <div style="border-top: 1.5px dashed var(--glass-border-subtle); margin: 0.45rem 0;"></div>
        <div style="display: flex; justify-content: space-between; font-family: var(--font-heading); font-size: 1.35rem; font-weight: 900; color: var(--brand-orange-deep);">
          <span>Total Payable</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
      </div>
      <button class="btn-primary" style="width: 100%; padding: 0.95rem; font-size: 1rem;" onclick="window.studentPortal.processRazorpayPayment()">
        <span>Proceed to Payment</span>
        <span class="arrow-icon">→</span>
      </button>
    `;
  }

  // --- Razorpay Payment Integration ---
  processRazorpayPayment() {
    if (this.cart.length === 0) {
      window.app.showToast("Tray is Empty", "Add some items before proceeding to payment.", "cart");
      return;
    }

    // MANDATORY AUTH CHECK: Login/Sign Up is mandatory for booking
    if (!window.canteenAuth || !window.canteenAuth.isAuthenticated()) {
      this.closeCartDrawer();
      window.canteenAuth.openAuthModal({
        purpose: "booking",
        title: "Sign In Required for Booking",
        message: "Account login is mandatory to place meal bookings & receive your live queue token.",
        onSuccess: () => {
          this.processRazorpayPayment();
        }
      });
      return;
    }

    this.closeCartDrawer();

    const { subtotal, discount, gst, total } = this.getCartTotals();
    const user = this.storage.getUser();

    // Check if Razorpay SDK is available
    if (typeof Razorpay === "undefined") {
      window.app.showToast("Loading Razorpay", "Initializing secure payment checkout...", "info");
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => this.launchRazorpayCheckout(total, subtotal, discount, gst, user);
      script.onerror = () => {
        window.app.showToast("Gateway Error", "Failed to connect to Razorpay. Check internet connection.", "error");
      };
      document.body.appendChild(script);
    } else {
      this.launchRazorpayCheckout(total, subtotal, discount, gst, user);
    }
  }

  launchRazorpayCheckout(total, subtotal, discount, gst, user) {
    const amountInPaise = Math.round(total * 100);

    const options = {
      key: "rzp_test_TgNoq5ZbtB5tOp",
      amount: amountInPaise,
      currency: "INR",
      name: "EAT, UP! Campus Canteen",
      description: `Campus Dining Order • ${this.cart.length} item(s)`,
      image: "assets/hero_noodles.jpg",
      handler: (response) => {
        this.handleRazorpaySuccess(response, { total, subtotal, discount, gst, user });
      },
      prefill: {
        name: user.name || "Rahul Sharma",
        email: user.email || "rahul.sharma@campus.edu",
        contact: user.phone || "+919876543210"
      },
      notes: {
        pickup_time: this.selectedPickupTime || "ASAP",
        platform: "Smart Canteen Management Web"
      },
      theme: {
        color: "#FF5E00"
      },
      modal: {
        ondismiss: () => {
          window.app.showToast("Payment Cancelled", "Your order has not been placed. Items are still in your tray.", "info");
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on("payment.failed", (response) => {
        this.audio.playTap();
        window.app.showToast(
          "Payment Failed",
          response.error?.description || "Transaction failed. Please try again.",
          "error"
        );
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      window.app.showToast("Gateway Error", "Unable to open Razorpay checkout.", "error");
    }
  }

  handleRazorpaySuccess(razorpayResponse, { total, subtotal, discount, user }) {
    const paymentId = razorpayResponse.razorpay_payment_id || `pay_${Date.now()}`;

    const orderData = {
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      items: this.cart.map(c => ({
        itemId: c.itemId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        isVeg: c.isVeg
      })),
      subtotal,
      discount,
      total,
      paymentMethod: `Razorpay (${paymentId})`,
      paymentId: paymentId,
      paymentStatus: "Paid",
      orderType: this.selectedPickupTime === "ASAP" ? "Immediate" : "Pre-Order",
      pickupTime: this.selectedPickupTime === "ASAP" ? "ASAP (~10 mins)" : this.selectedPickupTime,
      notes: `Online Paid via Razorpay [ID: ${paymentId}]`
    };

    this.finalizeOrderPlacement(orderData);
  }

  setPickupTime(timeStr) {
    this.selectedPickupTime = timeStr;
    document.querySelectorAll(".time-slot-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.time === timeStr);
    });
  }

  finalizeOrderPlacement(orderData) {
    const newOrder = this.storage.createOrder(orderData);
    this.currentTrackingOrderId = newOrder.id;
    this.cart = [];
    this.updateCartBadge();
    this.renderActiveView();

    this.audio.playOrderSuccess();

    window.app.showToast(
      `Order Confirmed! Token #${newOrder.tokenNumber}`,
      `Your meal is in queue. Monitor live cooking progress!`,
      "success"
    );

    this.switchStudentTab("tracker");
  }

  // --- Dedicated Queue Card & Order Tracking ---
  renderOrderTracker() {
    const container = document.getElementById("order-tracker-container");
    if (!container) return;

    const orders = this.storage.getOrders();
    const user = this.storage.getUser();

    let targetOrder = null;
    if (this.currentTrackingOrderId) {
      targetOrder = orders.find(o => o.id === this.currentTrackingOrderId);
    }
    if (!targetOrder) {
      targetOrder = orders.find(o => o.userId === user.id && !["COLLECTED", "CANCELLED"].includes(o.orderStatus));
    }
    if (!targetOrder) {
      targetOrder = orders.find(o => o.userId === user.id);
    }

    if (!targetOrder) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px solid var(--glass-border-subtle); box-shadow: var(--glass-shadow); max-width: 600px; margin: 2rem auto;">
          <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--brand-orange);">
            <svg class="ui-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="12" x="2" y="6" rx="2"/>
              <line x1="12" y1="6" x2="12" y2="18" stroke-dasharray="2 2"/>
            </svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.35rem;">No Active Orders</h3>
          <p style="margin-bottom: 1.75rem; font-size: 0.92rem; color: var(--text-muted);">You don't have any ongoing canteen orders right now.</p>
          <button class="btn-primary" onclick="window.studentPortal.switchStudentTab('menu')">
            <span>Browse Daily Menu</span>
            <svg class="ui-icon arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </button>
        </div>
      `;
      return;
    }

    const { tokenNumber, orderStatus, pickupTime, orderType, total, items, placedAt, estimatedWaitMins } = targetOrder;

    const timelineSteps = [
      { key: "PLACED", title: "Order Confirmed", desc: "Received at central campus kitchen" },
      { key: "PAYMENT_CONFIRMED", title: "Payment Completed", desc: `${targetOrder.paymentMethod} verified` },
      { key: "PREPARING", title: "Preparing", desc: "Chef is cooking your fresh meal" },
      { key: "READY", title: "Ready for Pickup", desc: "Hot at Counter 2 ready to collect" },
      { key: "COLLECTED", title: "Collected", desc: "Handed over to student" }
    ];

    const statusHierarchy = ["PLACED", "PAYMENT_CONFIRMED", "PREPARING", "READY", "COLLECTED"];
    let currentIdx = statusHierarchy.indexOf(orderStatus);
    if (orderStatus === "ACCEPTED") currentIdx = 1;

    const isReady = orderStatus === "READY";
    const isCollected = orderStatus === "COLLECTED";

    const progressPercent = Math.min(100, Math.max(10, ((currentIdx + 1) / timelineSteps.length) * 100));

    container.innerHTML = `
      <div class="order-tracking-layout">
        <!-- Main Tracking Left -->
        <div class="tracking-main-card">

          ${isReady ? `
            <div style="background: rgba(22, 163, 74, 0.1); border: 1.5px solid var(--success); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin-bottom: 1.5rem; box-shadow: 0 4px 16px rgba(22, 163, 74, 0.2);">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <h3 style="color: var(--success); font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; margin: 0;">ORDER READY FOR PICKUP!</h3>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-dark);">Please head over to <strong>Counter 2</strong> and present Token <strong>#${tokenNumber}</strong>.</p>
            </div>
          ` : ''}

          <!-- Dedicated Queue Card in Liquid Glass Theme -->
          <div class="queue-card-navy">
            <div class="token-center-display">
              <div class="token-small-title">Campus Food Token</div>
              <div class="token-giant-number">#${tokenNumber}</div>
              <div class="token-sub-instruction">Present this token at Counter 2 when marked ready</div>
            </div>

            <!-- Queue Progress Bar -->
            <div class="queue-progress-bar-container">
              <div class="queue-progress-labels">
                <span>Kitchen Queue Flow</span>
                <span>${progressPercent}% Complete</span>
              </div>
              <div class="queue-progress-track">
                <div class="queue-progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <!-- Queue Metrics Strip -->
            <div class="queue-metrics-strip">
              <div class="queue-metric-item">
                <span class="queue-metric-num">${tokenNumber}</span>
                <span class="queue-metric-desc">Your Token</span>
              </div>
              <div class="queue-metric-item">
                <span class="queue-metric-num" style="color: var(--brand-orange);">#A1038</span>
                <span class="queue-metric-desc">Now Serving</span>
              </div>
              <div class="queue-metric-item">
                <span class="queue-metric-num">${isReady ? '0' : '3'}</span>
                <span class="queue-metric-desc">People Ahead</span>
              </div>
              <div class="queue-metric-item">
                <span class="queue-metric-num" style="color: ${isReady ? 'var(--success)' : 'var(--brand-orange-deep)'};">
                  ${isReady ? '0 min' : (estimatedWaitMins || '6') + ' min'}
                </span>
                <span class="queue-metric-desc">Est. Waiting</span>
              </div>
            </div>
          </div>

          <!-- Order Tracking Timeline -->
          <h3 class="timeline-title">Order Status Timeline</h3>
          <div class="order-timeline-track">
            ${timelineSteps.map((step, idx) => {
              let cls = "";
              if (currentIdx > idx) cls = "completed";
              else if (currentIdx === idx) cls = "active";

              let icon = idx + 1;
              if (currentIdx > idx) {
                icon = `<svg class="ui-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
              }

              return `
                <div class="timeline-step ${cls}">
                  <div class="step-circle">${icon}</div>
                  <div class="step-details">
                    <div class="step-heading">${step.title}</div>
                    <div class="step-subinfo">${step.desc}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

        </div>

        <!-- Order Summary Sidebar Right -->
        <div class="order-summary-card">
          <div class="summary-heading">Order Receipt</div>
          <div style="font-size: 0.88rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.35rem;">
            <div><strong>Service:</strong> ${orderType} (${pickupTime})</div>
            <div><strong>Placed:</strong> ${new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Payment:</strong> ${targetOrder.paymentMethod} (${targetOrder.paymentStatus})</div>
          </div>

          <div class="order-items-table">
            ${items.map(it => `
              <div class="order-item-line">
                <div>
                  <strong style="color: var(--text-dark);">${it.quantity}×</strong> ${it.name}
                </div>
                <span style="font-weight: 700; color: var(--brand-orange-deep);">₹${it.price * it.quantity}</span>
              </div>
            `).join("")}
          </div>

          <div class="summary-math">
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal</span>
              <span>₹${targetOrder.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 700;">
              <span>Campus Subsidy</span>
              <span>-₹${(targetOrder.discount || 0).toFixed(2)}</span>
            </div>
            <div class="summary-math-total">
              <span>Total Paid</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>

          ${isCollected && !targetOrder.hasFeedback ? `
            <button class="btn-primary" style="width: 100%; margin-top: 0.5rem;" onclick="window.studentPortal.openFeedbackModal('${targetOrder.id}')">
              <svg class="ui-icon star-icon" width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Rate Food & Service</span>
            </button>
          ` : ''}

          <button class="btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;" onclick="window.print()">
            <svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            <span>Print Digital Receipt</span>
          </button>
        </div>
      </div>
    `;
  }

  // --- Past Orders History ---
  renderPastOrders() {
    const container = document.getElementById("student-orders-view");
    if (!container) return;

    const user = this.storage.getUser();
    const orders = this.storage.getOrders().filter(o => o.userId === user.id);

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px solid var(--glass-border-subtle); box-shadow: var(--glass-shadow); max-width: 600px; margin: 2rem auto;">
          <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--brand-orange);">
            <svg class="ui-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.35rem;">No Past Orders Yet</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem;">Your previous campus meals and payment receipts will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="section-header">
        <h2 class="section-title" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <svg class="ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>
          <span>Order History & Receipts (${orders.length})</span>
        </h2>
        <p class="section-subtitle">Review previous campus meals or reorder favorites with one click</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 880px; margin: 0 auto;">
        ${orders.map(o => `
          <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.4rem; box-shadow: var(--glass-shadow);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <div>
                <span class="ticket-token">Token #${o.tokenNumber}</span>
                <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 0.6rem;">${new Date(o.placedAt).toLocaleDateString()} at ${new Date(o.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span class="status-pill ${o.orderStatus === 'COLLECTED' ? 'Available' : (o.orderStatus === 'CANCELLED' ? 'Critical' : 'Low-Stock')}">
                ${o.orderStatus}
              </span>
            </div>

            <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
              ${o.items.map(it => `<div><strong style="color: var(--text-dark);">${it.quantity}×</strong> ${it.name}</div>`).join("")}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border-subtle); padding-top: 0.85rem;">
              <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 900; color: var(--brand-orange-deep);">₹${o.total.toFixed(2)}</div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-secondary" style="display: flex; align-items: center; gap: 0.4rem;" onclick="window.studentPortal.reorderItems('${o.id}')">
                  <svg class="ui-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                  <span>Re-order</span>
                </button>
                ${o.orderStatus === 'COLLECTED' ? `
                  <button class="btn-primary" style="display: flex; align-items: center; gap: 0.4rem;" onclick="window.studentPortal.openFeedbackModal('${o.id}')">
                    <svg class="ui-icon star-icon" width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>${o.hasFeedback ? 'Reviewed' : 'Rate'}</span>
                  </button>
                ` : `
                  <button class="btn-primary" onclick="window.studentPortal.viewActiveOrder('${o.id}')">
                    <span>Track Live</span>
                    <svg class="ui-icon arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                  </button>
                `}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  reorderItems(orderId) {
    const order = this.storage.getOrders().find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(it => {
      this.addToCart(it.itemId);
    });

    this.openCartDrawer();
    window.app.showToast("Items Added", "Re-ordered items loaded into your tray.", "cart");
  }

  viewActiveOrder(orderId) {
    this.currentTrackingOrderId = orderId;
    this.switchStudentTab("tracker");
  }

  // --- Feedback Modal ---
  openFeedbackModal(orderId) {
    const modal = document.getElementById("feedback-modal");
    if (!modal) return;

    modal.dataset.orderId = orderId;
    const order = this.storage.getOrders().find(o => o.id === orderId);
    if (order) {
      document.getElementById("feedback-token-label").textContent = `Order #${order.tokenNumber}`;
    }

    modal.classList.add("open");
  }

  openGeneralFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (!modal) return;
    modal.dataset.orderId = "";
    document.getElementById("feedback-token-label").textContent = "General Dining Feedback";
    modal.classList.add("open");
  }

  closeFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (modal) modal.classList.remove("open");
  }

  submitFeedback() {
    const modal = document.getElementById("feedback-modal");
    const orderId = modal ? modal.dataset.orderId : null;
    const foodRating = 5;
    const serviceRating = 5;
    const valueRating = 5;
    const comment = document.getElementById("feedback-comment-input")?.value || "";

    const user = this.storage.getUser();
    const order = this.storage.getOrders().find(o => o.id === orderId);

    this.storage.addFeedback({
      orderId,
      tokenNumber: order ? order.tokenNumber : "General",
      userName: user.name,
      ratingFood: foodRating,
      ratingService: serviceRating,
      ratingValue: valueRating,
      comment
    });

    this.closeFeedbackModal();
    this.audio.playTap();
    window.app.showToast("Review Submitted!", "Thank you for helping us improve campus dining!", "star");
    if (this.activeTab === "feedback") this.renderFeedbackView();
    if (this.activeTab === "orders") this.renderPastOrders();
    if (this.activeTab === "tracker") this.renderOrderTracker();
  }

  // --- Active Tab Switching ---
  switchStudentTab(tab) {
    this.activeTab = tab;

    // Update top nav links
    document.querySelectorAll(".top-nav-link").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    // Update mobile bottom nav buttons
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    const views = [
      "student-home-view",
      "student-menu-view",
      "student-orders-view",
      "student-tracker-view",
      "student-wallet-view",
      "student-favorites-view",
      "student-feedback-view",
      "student-profile-view"
    ];

    views.forEach(vId => {
      const el = document.getElementById(vId);
      if (el) el.style.display = "none";
    });

    const heroEl = document.getElementById("student-hero-banner");
    if (heroEl) heroEl.style.display = (tab === "home") ? "grid" : "none";

    const targetView = document.getElementById(`student-${tab}-view`);
    if (targetView) targetView.style.display = "block";

    this.renderActiveView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderActiveView() {
    switch (this.activeTab) {
      case "home":
        this.renderHomeView();
        break;
      case "menu":
        this.renderMenu();
        break;
      case "orders":
        this.renderPastOrders();
        break;
      case "tracker":
        this.renderOrderTracker();
        break;
      case "wallet":
        this.renderProfileView();
        break;
      case "favorites":
        this.renderFavorites();
        break;
      case "feedback":
        this.renderFeedbackView();
        break;
      case "profile":
        this.renderProfileView();
        break;
    }
  }

  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.add("open");
  }

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.remove("open");
  }

  updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }

  updateActiveOrderPill() {
    const pill = document.getElementById("nav-active-order-pill");
    if (!pill) return;

    const user = this.storage.getUser();
    const orders = this.storage.getOrders();
    const active = orders.find(o => o.userId === user.id && !["COLLECTED", "CANCELLED"].includes(o.orderStatus));

    if (active) {
      pill.style.display = "flex";
      pill.innerHTML = `
        <svg class="ui-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span>Token #${active.tokenNumber}: <strong>${active.orderStatus}</strong></span>
      `;
      pill.onclick = () => {
        this.currentTrackingOrderId = active.id;
        this.switchStudentTab("tracker");
      };
    } else {
      pill.style.display = "none";
    }
  }

  updateHeaderUserInfo() {
    const user = this.storage.getUser();
    const walletEl = document.getElementById("nav-wallet-balance");
    if (walletEl) {
      walletEl.textContent = `₹${user.walletBalance.toFixed(2)}`;
    }
  }
}

window.StudentPortal = StudentPortal;
