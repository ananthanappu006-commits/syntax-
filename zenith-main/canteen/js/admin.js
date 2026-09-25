/**
 * Smart Canteen Management Platform
 * Admin & Kitchen Staff Console - Modern Clean Premium Black & Lavender Theme
 */

class AdminConsole {
  constructor(storage, audio) {
    this.storage = storage;
    this.audio = audio;
    this.activeTab = "orders"; // 'orders' | 'menu' | 'inventory' | 'analytics' | 'feedback'

    this.init();
  }

  init() {
    this.storage.on("ordersUpdated", () => {
      this.renderMetrics();
      if (this.activeTab === "orders") this.renderOrders();
      if (this.activeTab === "analytics") this.renderAnalytics();
    });
    this.storage.on("menuUpdated", () => {
      if (this.activeTab === "menu") this.renderMenuManager();
    });
    this.storage.on("inventoryUpdated", () => {
      this.renderMetrics();
      if (this.activeTab === "inventory") this.renderInventory();
    });
    this.storage.on("feedbackUpdated", () => {
      if (this.activeTab === "feedback") this.renderFeedback();
    });
  }

  // --- Metrics Overview (PRD Section 6) ---
  renderMetrics() {
    const orders = this.storage.getOrders();
    const inventory = this.storage.getInventory();

    const todayOrdersCount = orders.length + 420;
    const pendingOrdersCount = orders.filter(o => ["PLACED", "PAYMENT_CONFIRMED", "ACCEPTED", "PREPARING"].includes(o.orderStatus)).length;
    const completedOrdersCount = orders.filter(o => o.orderStatus === "COLLECTED").length + 380;
    const cancelledOrdersCount = orders.filter(o => o.orderStatus === "CANCELLED").length + 15;

    const liveSales = orders.filter(o => o.orderStatus !== "CANCELLED").reduce((s, o) => s + o.total, 0);
    const totalSales = 38450 + liveSales;

    const lowStockCount = inventory.filter(i => i.status === "Low Stock" || i.status === "Critical").length;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("metric-today-orders", todayOrdersCount);
    setEl("metric-pending-orders", pendingOrdersCount);
    setEl("metric-completed-orders", completedOrdersCount);
    setEl("metric-cancelled-orders", cancelledOrdersCount);
    setEl("metric-today-sales", `₹${totalSales.toLocaleString("en-IN")}`);
    setEl("metric-low-stock", lowStockCount);
    setEl("metric-active-queue", pendingOrdersCount + 18);
  }

  // --- Live Orders Kanban Board ---
  renderOrders() {
    const container = document.getElementById("admin-orders-container");
    if (!container) return;

    const orders = this.storage.getOrders();

    const placedOrders = orders.filter(o => ["PLACED", "PAYMENT_CONFIRMED"].includes(o.orderStatus));
    const preparingOrders = orders.filter(o => ["ACCEPTED", "PREPARING"].includes(o.orderStatus));
    const readyOrders = orders.filter(o => o.orderStatus === "READY");
    const completedOrders = orders.filter(o => ["COLLECTED", "CANCELLED"].includes(o.orderStatus));

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 class="section-title">Live Kitchen Dispatch Board</h2>
          <p class="section-subtitle">Real-time incoming orders, preparation status, and counter pickup workflow</p>
        </div>
        <button class="btn-primary" onclick="window.adminConsole.simulateIncomingOrder()">
          + Simulate Incoming Student Order
        </button>
      </div>

      <div class="kanban-grid">
        <!-- Col 1: Placed / Paid -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>New Orders</span>
            </div>
            <span class="kanban-counter">${placedOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${placedOrders.length === 0 ? '<div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">No new incoming orders</div>' : ''}
            ${placedOrders.map(o => this.renderOrderCard(o, "PLACED")).join("")}
          </div>
        </div>

        <!-- Col 2: Preparing -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>In Preparation</span>
            </div>
            <span class="kanban-counter" style="color: var(--warning);">${preparingOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${preparingOrders.length === 0 ? '<div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">No orders currently cooking</div>' : ''}
            ${preparingOrders.map(o => this.renderOrderCard(o, "PREPARING")).join("")}
          </div>
        </div>

        <!-- Col 3: Ready at Counter -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>Ready at Counter</span>
            </div>
            <span class="kanban-counter" style="color: var(--success);">${readyOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${readyOrders.length === 0 ? '<div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">No orders awaiting collection</div>' : ''}
            ${readyOrders.map(o => this.renderOrderCard(o, "READY")).join("")}
          </div>
        </div>

        <!-- Col 4: Completed -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>Collected / Past</span>
            </div>
            <span class="kanban-counter">${completedOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${completedOrders.map(o => this.renderOrderCard(o, "COMPLETED")).join("")}
          </div>
        </div>
      </div>
    `;
  }

  renderOrderCard(order, colType) {
    let actionBtns = "";

    if (colType === "PLACED") {
      actionBtns = `
        <button class="btn-primary" style="flex: 1; padding: 0.4rem 0.6rem; font-size: 0.8rem;" onclick="window.adminConsole.updateStatus('${order.id}', 'PREPARING')">
          Accept & Cook →
        </button>
        <button class="btn-secondary" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; color: var(--error); border-color: rgba(244, 63, 94, 0.4);" onclick="window.adminConsole.cancelOrderPrompt('${order.id}')">Cancel</button>
      `;
    } else if (colType === "PREPARING") {
      actionBtns = `
        <button class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #10B981, #059669); color: #fff; padding: 0.4rem 0.6rem; font-size: 0.8rem;" onclick="window.adminConsole.updateStatus('${order.id}', 'READY')">
          Mark Ready 
        </button>
      `;
    } else if (colType === "READY") {
      actionBtns = `
        <button class="btn-primary" style="width: 100%; padding: 0.4rem 0.6rem; font-size: 0.8rem;" onclick="window.adminConsole.updateStatus('${order.id}', 'COLLECTED')">
          Mark Collected 
        </button>
      `;
    } else {
      actionBtns = `
        <div style="font-size: 0.75rem; color: var(--text-secondary);">
          Status: <strong style="color: var(--lavender-bright);">${order.orderStatus}</strong>
        </div>
      `;
    }

    return `
      <div class="admin-order-ticket" data-id="${order.id}">
        <div class="ticket-header">
          <span class="ticket-token">Token #${order.tokenNumber}</span>
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">${order.orderType || 'Standard'} • ${order.pickupTime || 'Now'}</span>
        </div>
        <div style="font-size: 0.92rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.25rem;">
          ${order.userName} <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 500;">(${order.userPhone || ''})</span>
        </div>
        <div style="border-top: 1px dashed var(--glass-border-subtle); border-bottom: 1px dashed var(--glass-border-subtle); padding: 0.5rem 0; margin-bottom: 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.84rem; color: var(--text-secondary);">
          ${order.items.map(it => `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span><strong style="color: var(--brand-orange-deep);">${it.quantity}×</strong> ${it.name}</span>
              <span style="font-weight: 700; color: var(--text-dark);">₹${it.price * it.quantity}</span>
            </div>
          `).join("")}
          ${order.notes ? `<div style="color: #D97706; font-style: italic; font-size: 0.75rem; background: rgba(245, 158, 11, 0.08); padding: 3px 6px; border-radius: 4px;">Note: "${order.notes}"</div>` : ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.85rem;">
          <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">${order.paymentMethod || 'Razorpay UPI'}</span>
          <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; color: var(--brand-orange-deep);">₹${order.total.toFixed(2)}</span>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          ${actionBtns}
        </div>
      </div>
    `;
  }

  updateStatus(orderId, nextStatus) {
    const order = this.storage.updateOrderStatus(orderId, nextStatus);
    if (!order) return;

    if (nextStatus === "READY") {
      this.audio.playOrderReady();
      window.app.showToast(`Order Ready! #${order.tokenNumber}`, "Notified student for Counter 2 pickup.", "bell");
    } else {
      this.audio.playTap();
      window.app.showToast(`Order #${order.tokenNumber}`, `Status moved to ${nextStatus}`, "info");
    }
  }

  cancelOrderPrompt(orderId) {
    const reason = prompt("Enter cancellation reason (Student will receive full refund to Campus Wallet):", "Ingredient out of stock");
    if (reason !== null) {
      this.storage.updateOrderStatus(orderId, "CANCELLED");
      this.audio.playTap();
      window.app.showToast("Order Cancelled", "Order cancelled and student refunded.", "warning");
    }
  }

  simulateIncomingOrder() {
    const mockStudents = [
      { name: "Sneha Roy", phone: "+91 94455 66778" },
      { name: "Vikram Sen", phone: "+91 97788 11223" },
      { name: "Kavya Nair", phone: "+91 98877 33445" }
    ];
    const randStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    const menu = this.storage.getMenuItems().filter(m => m.available);
    const randItem = menu[Math.floor(Math.random() * menu.length)];

    const newOrd = this.storage.createOrder({
      userId: "usr_sim_" + Date.now(),
      userName: randStudent.name,
      userPhone: randStudent.phone,
      items: [
        { itemId: randItem.id, name: randItem.name, price: randItem.price, quantity: 1, isVeg: randItem.isVeg }
      ],
      subtotal: randItem.price,
      discount: Math.round(randItem.price * 0.1),
      total: randItem.price - Math.round(randItem.price * 0.1),
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      orderType: "Immediate",
      pickupTime: "Now",
      notes: "Simulated live student test order"
    });

    this.audio.playOrderSuccess();
    window.app.showToast(`New Order! #${newOrd.tokenNumber}`, `${randStudent.name} ordered ${randItem.name}`, "bell");
  }

  // --- Menu Management ---
  renderMenuManager() {
    const container = document.getElementById("admin-menu-container");
    if (!container) return;

    const items = this.storage.getMenuItems();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 class="section-title">Menu & Food Availability Manager</h2>
          <p class="section-subtitle">Real-time food availability toggling, daily specials designation, and pricing controls</p>
        </div>
        <button class="btn-primary" onclick="window.adminConsole.openAddFoodModal()">
          + Add New Food Item
        </button>
      </div>

      <div class="white-table-wrapper">
        <table class="navy-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock / Prep</th>
              <th>Daily Special</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/chicken_biryani.jpg'" />
                    <div>
                      <div style="font-weight: 700; color: var(--text-dark);">${item.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-secondary);">${item.isVeg ? '<span class="status-dot dot-ready"></span> Pure Veg' : '<span class="status-dot dot-critical"></span> Non-Veg'}</div>
                    </div>
                  </div>
                </td>
                <td><span style="text-transform: capitalize; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">${item.category}</span></td>
                <td><strong style="color: var(--brand-orange-deep); font-size: 0.95rem;">₹${item.price}</strong></td>
                <td>
                  <div style="font-weight: 700; color: var(--text-dark);">${item.stockQuantity} portions</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">~${item.prepTimeMinutes || 8} mins</div>
                </td>
                <td>
                  <button class="btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; ${item.isSpecial ? 'background: rgba(255, 94, 0, 0.1); border-color: rgba(255, 94, 0, 0.35); color: var(--brand-orange-deep); font-weight: 700;' : ''}" onclick="window.adminConsole.toggleSpecial('${item.id}')">
                    ${item.isSpecial ? 'Active Special' : 'Make Special'}
                  </button>
                </td>
                <td>
                  <button class="status-pill ${item.available ? 'Available' : 'Critical'}" style="cursor: pointer; border: none;" onclick="window.adminConsole.toggleAvailability('${item.id}')">
                    ${item.available ? 'Available' : 'Sold Out'}
                  </button>
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn-secondary" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;" onclick="window.adminConsole.openEditFoodModal('${item.id}')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px; margin-right:2px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit
                    </button>
                    <button class="btn-secondary" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; color: var(--error); border-color: rgba(244, 63, 94, 0.4);" onclick="window.adminConsole.deleteFoodItem('${item.id}')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  toggleAvailability(id) {
    const item = this.storage.getMenuItems().find(i => i.id === id);
    if (!item) return;

    const newStatus = !item.available;
    this.storage.updateMenuItem(id, { available: newStatus });
    this.audio.playTap();
    window.app.showToast(
      `Availability Updated`,
      `${item.name} marked as ${newStatus ? 'Available' : 'Sold Out'}.`,
      newStatus ? "success" : "warning"
    );
  }

  toggleSpecial(id) {
    const item = this.storage.getMenuItems().find(i => i.id === id);
    if (!item) return;

    const newSpecial = !item.isSpecial;
    this.storage.updateMenuItem(id, { isSpecial: newSpecial });
    this.audio.playTap();
    window.app.showToast(
      `Special Status Updated`,
      `${item.name} ${newSpecial ? 'set as Today\'s Special!' : 'removed from daily specials.'}`,
      "star"
    );
  }

  openAddFoodModal() {
    const modal = document.getElementById("edit-food-modal");
    if (!modal) return;

    document.getElementById("food-modal-title").textContent = "Add New Food Item";
    document.getElementById("food-id-input").value = "";
    document.getElementById("food-name-input").value = "";
    document.getElementById("food-cat-input").value = "lunch";
    document.getElementById("food-price-input").value = "80";
    document.getElementById("food-stock-input").value = "30";
    document.getElementById("food-prep-input").value = "8";
    document.getElementById("food-veg-input").checked = true;
    document.getElementById("food-desc-input").value = "";
    document.getElementById("food-image-input").value = "assets/chicken_biryani.jpg";

    modal.classList.add("open");
  }

  openEditFoodModal(id) {
    const item = this.storage.getMenuItems().find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById("edit-food-modal");
    if (!modal) return;

    document.getElementById("food-modal-title").textContent = `Edit Food Item: ${item.name}`;
    document.getElementById("food-id-input").value = item.id;
    document.getElementById("food-name-input").value = item.name;
    document.getElementById("food-cat-input").value = item.category;
    document.getElementById("food-price-input").value = item.price;
    document.getElementById("food-stock-input").value = item.stockQuantity;
    document.getElementById("food-prep-input").value = item.prepTimeMinutes || 8;
    document.getElementById("food-veg-input").checked = item.isVeg;
    document.getElementById("food-desc-input").value = item.description;
    document.getElementById("food-image-input").value = item.image;

    modal.classList.add("open");
  }

  saveFoodItem() {
    const id = document.getElementById("food-id-input").value;
    const name = document.getElementById("food-name-input").value.trim();
    const category = document.getElementById("food-cat-input").value;
    const price = parseFloat(document.getElementById("food-price-input").value) || 50;
    const stockQuantity = parseInt(document.getElementById("food-stock-input").value) || 20;
    const prepTimeMinutes = parseInt(document.getElementById("food-prep-input").value) || 8;
    const isVeg = document.getElementById("food-veg-input").checked;
    const description = document.getElementById("food-desc-input").value.trim();
    const image = document.getElementById("food-image-input").value;

    if (!name) {
      alert("Please provide a food name");
      return;
    }

    if (id) {
      this.storage.updateMenuItem(id, { name, category, price, stockQuantity, prepTimeMinutes, isVeg, description, image });
      window.app.showToast("Item Updated", `${name} changes saved.`, "info");
    } else {
      this.storage.addMenuItem({ name, category, price, stockQuantity, prepTimeMinutes, isVeg, description, image, tag: "New Item" });
      window.app.showToast("Item Added", `${name} added to canteen menu.`, "success");
    }

    const modal = document.getElementById("edit-food-modal");
    if (modal) modal.classList.remove("open");
    this.renderMenuManager();
  }

  deleteFoodItem(id) {
    if (!confirm("Are you sure you want to delete this food item from the menu?")) return;
    this.storage.deleteMenuItem(id);
    this.audio.playTap();
    window.app.showToast("Item Deleted", "Food item removed from menu.", "warning");
    this.renderMenuManager();
  }

  // --- Inventory Management ---
  renderInventory() {
    const container = document.getElementById("admin-inventory-container");
    if (!container) return;

    const inventory = this.storage.getInventory();
    const criticalItems = inventory.filter(i => i.status === "Critical" || i.status === "Low Stock");

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 class="section-title">Canteen Ingredient Inventory</h2>
          <p class="section-subtitle">Real-time stock monitoring, threshold alerts, and automated purchasing management</p>
        </div>
      </div>

      ${criticalItems.length > 0 ? `
        <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 1.15rem 1.35rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <strong style="color: #DC2626;">Low Stock Alert:</strong>
              <span style="color: var(--text-secondary); font-size: 0.88rem; margin-left: 4px; font-weight: 600;">
                ${criticalItems.map(c => `${c.name} (${c.quantity} ${c.unit})`).join(", ")} below safe operating thresholds!
              </span>
            </div>
          </div>
          <button class="btn-primary" style="background: linear-gradient(135deg, #DC2626, #B91C1C); color: #fff; font-size: 0.8rem;" onclick="window.adminConsole.restockAllCritical()">
            Restock All Critical Items
          </button>
        </div>
      ` : ''}

      <div class="white-table-wrapper">
        <table class="navy-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Current Stock</th>
              <th>Minimum Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          <            ${inventory.map(inv => {
              const statusClass = inv.status.replace(/\s+/g, '-');
              return `
                <tr>
                  <td><strong style="color: var(--text-dark);">${inv.name}</strong> <span style="font-size: 0.75rem; color: var(--text-secondary);">(${inv.category})</span></td>
                  <td>
                    <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--brand-orange-deep);">${inv.quantity}</span>
                    <span style="color: var(--text-secondary); font-size: 0.85rem; font-weight: 600;">${inv.unit}</span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); font-weight: 600;">${inv.minThreshold} ${inv.unit}</span>
                  </td>
                  <td>
                    <span class="status-pill ${statusClass}">
                      ● ${inv.status}
                    </span>
                  </td>
                  <td style="font-size: 0.82rem; color: var(--text-secondary);">${inv.lastUpdated}</td>ndary);">${inv.lastUpdated}</td>
                  <td>
                    <div style="display: flex; gap: 0.4rem;">
                      <button class="btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="window.adminConsole.quickRestock('${inv.id}', 10)">
                        +10 ${inv.unit}
                      </button>
                      <button class="btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="window.adminConsole.customRestock('${inv.id}')">
                        Custom
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  quickRestock(id, amount) {
    const item = this.storage.restockInventory(id, amount);
    if (!item) return;
    this.audio.playTap();
    window.app.showToast("Stock Restocked", `Added +${amount} ${item.unit} to ${item.name}`, "success");
  }

  customRestock(id) {
    const item = this.storage.getInventory().find(i => i.id === id);
    if (!item) return;
    const amt = prompt(`Enter restock quantity in ${item.unit} for ${item.name}:`, "15");
    if (amt && !isNaN(amt)) {
      this.quickRestock(id, parseFloat(amt));
    }
  }

  restockAllCritical() {
    const inventory = this.storage.getInventory();
    inventory.forEach(inv => {
      if (inv.status === "Critical" || inv.status === "Low Stock") {
        this.storage.restockInventory(inv.id, 20);
      }
    });
    this.audio.playTap();
    window.app.showToast("Restocked!", "All critical stock replenished by +20 units.", "success");
  }

  // --- Analytics & Reports ---
  renderAnalytics() {
    const container = document.getElementById("admin-analytics-container");
    if (!container) return;

    const orders = this.storage.getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) + 38450;
    const razorpayOrders = orders.filter(o => o.paymentMethod === "Razorpay" || o.paymentMethod === "UPI" || !o.paymentMethod);
    const razorpayRevenue = Math.round(totalRevenue * 0.775);
    const counterRevenue = totalRevenue - razorpayRevenue;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(255, 94, 0, 0.12); color: var(--brand-orange-deep); display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 3h12M6 8h12M6 13l7 8M6 13h3a4 4 0 0 0 0-8"/></svg>
            </div>
            <h2 class="section-title" style="margin-bottom: 0;">Revenue & Financial Analytics</h2>
          </div>
          <p class="section-subtitle">Real-time campus sales turnover, Razorpay digital settlements, and audit reports</p>
        </div>
        <button class="btn-secondary" onclick="window.adminConsole.exportReportCSV()" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Revenue Audit (CSV)
        </button>
      </div>

      <!-- Financial KPI Cards (The Rupees Overview) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.4rem; box-shadow: var(--glass-shadow);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Today's Gross Sales</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255, 94, 0, 0.12); color: var(--brand-orange-deep); display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 3h12M6 8h12M6 13l7 8M6 13h3a4 4 0 0 0 0-8"/></svg>
            </div>
          </div>
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-dark);">₹${totalRevenue.toLocaleString("en-IN")}</div>
          <div style="font-size: 0.8rem; color: var(--success); font-weight: 700; margin-top: 0.35rem; display: flex; align-items: center; gap: 0.3rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            <span>+18.4% higher than yesterday</span>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.4rem; box-shadow: var(--glass-shadow);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Razorpay UPI Gateway</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(16, 185, 129, 0.12); color: #059669; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #059669;">₹${razorpayRevenue.toLocaleString("en-IN")}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.35rem;">77.5% digital settlements</div>
        </div>

        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.4rem; box-shadow: var(--glass-shadow);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Counter POS / Cash</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.12); color: #2563EB; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
          </div>
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-dark);">₹${counterRevenue.toLocaleString("en-IN")}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.35rem;">22.5% in-person billing</div>
        </div>

        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.4rem; box-shadow: var(--glass-shadow);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Average Order Value</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); color: #D97706; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-dark);">₹98.50</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.35rem;">Across ${orders.length + 380} campus trays</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Chart 1: Weekly Revenue Trend (₹) -->
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.25rem;">7-Day Revenue Trend (₹)</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.25rem;">Gross sales volume generated across campus breakfast, lunch & snacks</div>
          <div style="width: 100%; height: 210px;">
            ${this.renderWeeklyTrendSvg()}
          </div>
        </div>

        <!-- Chart 2: Hourly Rush Periods -->
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.25rem;">Peak Hourly Rush & Volume</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.25rem;">Live order counts peaking during lunch hours (12:00 PM – 2:00 PM)</div>
          <div style="width: 100%; height: 210px;">
            ${this.renderHourlyChartSvg()}
          </div>
        </div>

        <!-- Chart 3: Top Revenue Generating Dishes -->
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.25rem;">Top Dishes by Revenue (₹)</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.25rem;">Highest grossing campus meals and order volume breakdown</div>
          <div style="display: flex; flex-direction: column; gap: 0.95rem; padding-top: 0.5rem;">
            ${this.renderTopItemsBars()}
          </div>
        </div>

        <!-- Chart 4: Efficiency Metrics -->
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.25rem;">Kitchen Operations & Speed</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.25rem;">Preparation throughput and student dining satisfaction metrics</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 0.75rem;">
            <div style="background: var(--bg-surface-warm); padding: 1.15rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--glass-border-subtle);">
              <div style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: var(--brand-orange-deep);">7.4 mins</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.2rem;">Avg. Kitchen Prep Time</div>
            </div>
            <div style="background: var(--bg-surface-warm); padding: 1.15rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--glass-border-subtle);">
              <div style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: var(--success);">4.8 / 5.0</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.2rem;">Student Food Rating</div>
            </div>
            <div style="background: var(--bg-surface-warm); padding: 1.15rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--glass-border-subtle);">
              <div style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: #2563EB;">94.2%</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.2rem;">Ingredient Utilization</div>
            </div>
            <div style="background: var(--bg-surface-warm); padding: 1.15rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--glass-border-subtle);">
              <div style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: var(--success);">-38%</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; margin-top: 0.2rem;">Food Waste Reduction</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Payment & Billing Ledger Table -->
      <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--glass-shadow); margin-top: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.2rem;">Live Payment & Billing Audit Ledger</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">Real-time settlement records for student orders & Razorpay transactions</p>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #059669; background: rgba(16, 185, 129, 0.1); padding: 0.35rem 0.85rem; border-radius: 999px; border: 1px solid rgba(16, 185, 129, 0.25);">
            100% Reconciled
          </span>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Student Customer</th>
                <th>Dishes Ordered</th>
                <th>Payment Method</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Order Time</th>
              </tr>
            </thead>
            <tbody>
              ${orders.slice(0, 10).map(o => `
                <tr>
                  <td><strong style="color: var(--brand-orange-deep); font-weight: 800;">#${o.tokenNumber}</strong></td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-dark);">${o.userName || "Campus Student"}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${o.userPhone || "+91 98765 43210"}</div>
                  </td>
                  <td>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">
                      ${o.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                    </span>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; font-weight: 700; color: #2563EB; font-size: 0.82rem;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      ${o.paymentMethod || "Razorpay UPI"}
                    </span>
                  </td>
                  <td><strong style="font-size: 0.95rem; color: var(--text-dark);">₹${o.total}</strong></td>
                  <td>
                    <span class="status-pill Available" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">
                      ${o.paymentStatus || "Paid"}
                    </span>
                  </td>
                  <td><span style="font-size: 0.8rem; color: var(--text-muted);">${o.placedAt || "Just now"}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderHourlyChartSvg() {
    const hours = [
      { label: "8 AM", val: 35 },
      { label: "9 AM", val: 62 },
      { label: "10 AM", val: 40 },
      { label: "11 AM", val: 48 },
      { label: "12 PM", val: 110, peak: true },
      { label: "1 PM", val: 142, peak: true },
      { label: "2 PM", val: 85 },
      { label: "3 PM", val: 30 },
      { label: "4 PM", val: 68 },
      { label: "5 PM", val: 75 }
    ];

    const maxVal = 160;
    const w = 460;
    const h = 200;
    const barWidth = 26;
    const gap = 16;

    const bars = hours.map((d, i) => {
      const barH = (d.val / maxVal) * 140;
      const x = 30 + i * (barWidth + gap);
      const y = h - 35 - barH;
      const fill = d.peak ? "url(#orangePeakGrad)" : "rgba(255, 94, 0, 0.25)";

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="5" fill="${fill}">
          <title>${d.label}: ${d.val} orders</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" font-weight="700" fill="#1F2937" text-anchor="middle">${d.val}</text>
        <text x="${x + barWidth / 2}" y="${h - 12}" font-size="10" font-weight="600" fill="#6B7280" text-anchor="middle">${d.label}</text>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="orangePeakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF5E00"/>
            <stop offset="100%" stop-color="#EA580C"/>
          </linearGradient>
        </defs>
        <line x1="20" y1="${h - 30}" x2="${w - 10}" y2="${h - 30}" stroke="rgba(0, 0, 0, 0.08)" stroke-width="1"/>
        ${bars}
      </svg>
    `;
  }

  renderTopItemsBars() {
    const topItems = [
      { name: "Chicken Dum Biryani", count: 142, revenue: 18460, pct: 100 },
      { name: "Deluxe Veg Thali Meals", count: 96, revenue: 8160, pct: 67 },
      { name: "Sizzling Paneer Fried Rice", count: 83, revenue: 7885, pct: 58 },
      { name: "Samosa with Masala Chai", count: 76, revenue: 3040, pct: 53 },
      { name: "Crispy Masala Dosa", count: 61, revenue: 3050, pct: 43 }
    ];

    return topItems.map((item, idx) => `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
          <span style="font-weight: 700; color: var(--text-dark);">${idx + 1}. ${item.name}</span>
          <span style="font-weight: 800; color: var(--brand-orange-deep);">₹${item.revenue.toLocaleString("en-IN")} <span style="font-weight: 500; font-size: 0.78rem; color: var(--text-muted);">(${item.count} orders)</span></span>
        </div>
        <div style="width: 100%; height: 8px; background: rgba(0, 0, 0, 0.06); border-radius: var(--radius-full); overflow: hidden;">
          <div style="width: ${item.pct}%; height: 100%; background: linear-gradient(90deg, #FF6B00, #FF9500); border-radius: var(--radius-full);"></div>
        </div>
      </div>
    `).join("");
  }

  renderWeeklyTrendSvg() {
    const days = [
      { day: "Mon", sales: 32400 },
      { day: "Tue", sales: 36100 },
      { day: "Wed", sales: 41200 },
      { day: "Thu", sales: 38900 },
      { day: "Fri", sales: 44500 },
      { day: "Sat", sales: 29800 },
      { day: "Today", sales: 38450 }
    ];

    const maxSales = 50000;
    const w = 460;
    const h = 200;

    const points = days.map((d, i) => {
      const x = 40 + i * (w - 80) / (days.length - 1);
      const y = h - 40 - (d.sales / maxSales) * 120;
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, "");
    const areaD = `${pathD} L ${points[points.length - 1].x} ${h - 30} L ${points[0].x} ${h - 30} Z`;

    const dots = points.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#FF5E00" stroke="#FFFFFF" stroke-width="2"/>
      <text x="${p.x}" y="${p.y - 8}" font-size="10" font-weight="800" fill="#1F2937" text-anchor="middle">₹${Math.round(p.sales / 1000)}k</text>
      <text x="${p.x}" y="${h - 12}" font-size="10" font-weight="600" fill="#6B7280" text-anchor="middle">${p.day}</text>
    `).join("");

    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="weeklyAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF5E00" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#FF5E00" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="20" y1="${h - 30}" x2="${w - 20}" y2="${h - 30}" stroke="rgba(0, 0, 0, 0.08)" stroke-width="1"/>
        <path d="${areaD}" fill="url(#weeklyAreaGrad)"/>
        <path d="${pathD}" fill="none" stroke="#FF5E00" stroke-width="2.5" stroke-linecap="round"/>
        ${dots}
      </svg>
    `;
  }

  exportReportCSV() {
    const orders = this.storage.getOrders();
    let csv = "Order ID,Token,Student,Phone,Items,Payment Method,Payment Status,Total,Status,Placed At\n";
    orders.forEach(o => {
      const itemsStr = o.items.map(i => `${i.quantity}x ${i.name}`).join(" | ");
      csv += `"${o.id}","${o.tokenNumber}","${o.userName}","${o.userPhone}","${itemsStr}","${o.paymentMethod}","${o.paymentStatus}","${o.total}","${o.orderStatus}","${o.placedAt}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `campus_canteen_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.app.showToast("Report Downloaded", "CSV sales audit saved.", "info");
  }

  // --- Feedback Review Center ---
  renderFeedback() {
    const container = document.getElementById("admin-feedback-container");
    if (!container) return;

    const feedbackList = this.storage.getFeedback();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 class="section-title">Student Reviews & Satisfaction Ratings</h2>
          <p class="section-subtitle">Monitor customer feedback, service scores, and reply to suggestions</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #F59E0B;">4.8</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Food Quality</div>
        </div>
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--brand-orange-deep);">4.7</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Service Speed</div>
        </div>
        <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; box-shadow: var(--glass-shadow);">
          <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #059669;">4.9</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Value for Money</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${feedbackList.map(fb => `
          <div style="background: #FFFFFF; border: 1.5px solid var(--glass-border-subtle); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--glass-shadow);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <div>
                <strong style="color: var(--text-dark); font-size: 0.95rem; font-weight: 800;">${fb.userName}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.5rem;">Token #${fb.tokenNumber} • ${fb.createdAt}</span>
              </div>
              <div style="color: #F59E0B; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 0.25rem;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>${fb.ratingFood || 5}.0</span>
              </div>
            </div>

            <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0.75rem; line-height: 1.5;">
              "${fb.comment || 'Good food and quick service.'}"
            </p>

            ${fb.reply ? `
              <div style="background: var(--bg-surface-warm); border-left: 3px solid var(--brand-orange); padding: 0.75rem 1rem; border-radius: 4px; font-size: 0.85rem;">
                <strong style="color: var(--brand-orange-deep);">Canteen Staff Reply:</strong>
                <span style="color: var(--text-secondary); margin-left: 4px;">${fb.reply}</span>
              </div>
            ` : `
              <button class="btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;" onclick="window.adminConsole.replyToFeedback('${fb.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px; margin-right:4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Reply to Student
              </button>
            `}
          </div>
        `).join("")}
      </div>
    `;
  }

  replyToFeedback(id) {
    const text = prompt("Enter your response to the student review:");
    if (text && text.trim()) {
      this.storage.replyFeedback(id, text.trim());
      this.audio.playTap();
      window.app.showToast("Reply Published", "Sent response to student feedback.", "info");
      this.renderFeedback();
    }
  }

  // --- Switch Admin Tabs ---
  switchAdminTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll(".admin-nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    const views = [
      "admin-orders-container",
      "admin-menu-container",
      "admin-inventory-container",
      "admin-analytics-container",
      "admin-feedback-container"
    ];

    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.style.display = "none";
    });

    const targetEl = document.getElementById(`admin-${tab}-container`);
    if (targetEl) targetEl.style.display = "block";

    if (tab === "orders") this.renderOrders();
    if (tab === "menu") this.renderMenuManager();
    if (tab === "inventory") this.renderInventory();
    if (tab === "analytics") this.renderAnalytics();
    if (tab === "feedback") this.renderFeedback();
  }
}

window.AdminConsole = AdminConsole;
