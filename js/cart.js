/**
 * FAYONKA - Cart JavaScript
 */

let cartItems = [];
let shippingRate = 0;
let discountData = null;

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadShippingOptions();
});

function loadCart() {
  cartItems = DB.getCart();
  renderCart();
  updateSummary();
}

function renderCart() {
  const emptyState = document.getElementById('emptyCartState');
  const cartLayout = document.getElementById('cartLayout');
  const countHeader = document.getElementById('cartCountHeader');
  const listContainer = document.getElementById('cartItemsList');

  if (cartItems.length === 0) {
    emptyState.style.display = 'block';
    cartLayout.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  cartLayout.style.display = 'grid';
  countHeader.textContent = cartItems.length;

  listContainer.innerHTML = cartItems.map(item => `
    <div class="cart-item-row" id="cart-item-${item.cartId}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      
      <div class="cart-item-details">
        <a href="product-details.html?id=${item.productId}" class="cart-item-title">${item.name}</a>
        
        <div class="cart-item-variant">
          ${item.color ? `<span>اللون: <strong>${item.color}</strong></span>` : ''}
          ${item.color && item.size ? '<span style="color:var(--border)">|</span>' : ''}
          ${item.size ? `<span>المقاس: <strong>${item.size}</strong></span>` : ''}
        </div>
        
        <div class="cart-item-price">${App.formatPrice(item.price)}</div>
      </div>

      <div class="cart-item-actions">
        <div class="quantity-selector">
          <button class="qty-btn" onclick="updateItemQty('${item.cartId}', 1)">+</button>
          <div class="qty-value">${item.qty}</div>
          <button class="qty-btn" onclick="updateItemQty('${item.cartId}', -1)">-</button>
        </div>
        
        <button class="cart-item-remove" onclick="removeItem('${item.cartId}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          حذف
        </button>
      </div>
    </div>
  `).join('');
}

window.updateItemQty = function(cartId, change) {
  const item = cartItems.find(i => i.cartId === cartId);
  if (!item) return;

  const newQty = item.qty + change;
  if (newQty < 1) return;

  const maxQty = item.maxQty || 10;
  if (newQty > maxQty) {
    App.toast('warning', 'عذراً', 'الكمية المطلوبة غير متوفرة');
    return;
  }

  DB.updateCartItem(cartId, newQty);
  loadCart();
}

window.removeItem = function(cartId) {
  DB.removeFromCart(cartId);
  App.toast('info', 'تم الحذف', 'تم إزالة المنتج من السلة');
  loadCart();
}

window.clearCartConfirm = function() {
  if (confirm('هل أنت متأكدة من إفراغ السلة بالكامل؟')) {
    DB.clearCart();
    loadCart();
  }
}

function loadShippingOptions() {
  const shipping = DB.getShipping();
  const select = document.getElementById('shippingGovSelect');
  
  if (shipping && shipping.governorates) {
    shipping.governorates.forEach(gov => {
      const option = document.createElement('option');
      option.value = gov.name;
      option.textContent = gov.name;
      select.appendChild(option);
    });
  }
}

window.calculateShipping = function() {
  const govName = document.getElementById('shippingGovSelect').value;
  if (!govName) {
    shippingRate = 0;
  } else {
    shippingRate = DB.getShippingRate(govName);
  }
  
  // Save selected gov for checkout
  localStorage.setItem('fayonka_selected_gov', govName);
  
  updateSummary();
}

window.applyCoupon = function() {
  const code = document.getElementById('couponCode').value.trim();
  const msgEl = document.getElementById('couponMessage');
  const subtotal = DB.getCartTotal();

  if (!code) {
    msgEl.textContent = 'الرجاء إدخال كود الخصم';
    msgEl.style.color = 'var(--danger)';
    return;
  }

  const result = DB.validateCoupon(code, subtotal);
  
  if (result.valid) {
    discountData = result;
    msgEl.textContent = 'تم تفعيل الكوبون بنجاح!';
    msgEl.style.color = 'var(--success)';
    
    // Save for checkout
    localStorage.setItem('fayonka_coupon', code);
    
    updateSummary();
  } else {
    discountData = null;
    msgEl.textContent = result.message || 'كود غير صحيح أو منتهي';
    msgEl.style.color = 'var(--danger)';
    localStorage.removeItem('fayonka_coupon');
    updateSummary();
  }
}

function updateSummary() {
  const subtotal = DB.getCartTotal();
  document.getElementById('summarySubtotal').textContent = App.formatPrice(subtotal);
  
  // Shipping
  const shippingEl = document.getElementById('summaryShipping');
  if (shippingRate > 0) {
    shippingEl.textContent = App.formatPrice(shippingRate);
    shippingEl.style.color = 'var(--text-primary)';
  } else if (document.getElementById('shippingGovSelect').value) {
    shippingEl.textContent = 'مجاني';
    shippingEl.style.color = 'var(--success)';
  } else {
    shippingEl.textContent = '---';
    shippingEl.style.color = 'var(--text-muted)';
  }

  // Discount
  let discountAmount = 0;
  const discountRow = document.getElementById('summaryDiscountRow');
  
  // Auto-check stored coupon if any
  if (!discountData) {
    const savedCoupon = localStorage.getItem('fayonka_coupon');
    if (savedCoupon) {
      const res = DB.validateCoupon(savedCoupon, subtotal);
      if (res.valid) {
        discountData = res;
        document.getElementById('couponCode').value = savedCoupon;
      } else {
        localStorage.removeItem('fayonka_coupon');
      }
    }
  }

  if (discountData) {
    if (discountData.type === 'percentage') {
      discountAmount = subtotal * (discountData.value / 100);
    } else {
      discountAmount = discountData.value;
    }
    
    discountRow.style.display = 'flex';
    document.getElementById('summaryDiscount').textContent = `-${App.formatPrice(discountAmount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  // Total
  const total = (subtotal + shippingRate) - discountAmount;
  document.getElementById('summaryTotal').textContent = App.formatPrice(Math.max(0, total));
  
  // Check free shipping threshold
  const shippingConfig = DB.getShipping();
  if (shippingConfig && shippingConfig.freeShippingThreshold > 0) {
    if (subtotal >= shippingConfig.freeShippingThreshold) {
      shippingRate = 0; // Override
      shippingEl.textContent = 'مجاني';
      shippingEl.style.color = 'var(--success)';
      document.getElementById('summaryTotal').textContent = App.formatPrice(Math.max(0, subtotal - discountAmount));
    }
  }
}
