/**
 * FAYONKA - Checkout JavaScript
 */

let cartItems = [];
let shippingRate = 0;
let discountData = null;
let orderTotal = 0;
let orderDataToSubmit = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check if cart is empty
  cartItems = DB.getCart();
  if (cartItems.length === 0) {
    App.toast('warning', 'عذراً', 'سلة المشتريات فارغة');
    setTimeout(() => { window.location.href = 'cart.html'; }, 1500);
    return;
  }

  loadGovernorates();
  loadCartSummary();
});

function loadGovernorates() {
  const shipping = DB.getShipping();
  const select = document.getElementById('customerGov');
  
  if (shipping && shipping.governorates) {
    shipping.governorates.forEach(gov => {
      const option = document.createElement('option');
      option.value = gov.name;
      option.textContent = gov.name;
      select.appendChild(option);
    });
  }

  // Pre-select if available from cart
  const savedGov = localStorage.getItem('fayonka_selected_gov');
  if (savedGov) {
    select.value = savedGov;
    updateCheckoutSummary();
  }
}

function loadCartSummary() {
  const list = document.getElementById('checkoutItemsList');
  
  list.innerHTML = cartItems.map(item => `
    <div class="summary-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="summary-item-details">
        <div class="summary-item-title">${item.name}</div>
        <div class="summary-item-meta">
          ${item.size ? 'م: ' + item.size : ''} 
          ${item.color && item.size ? '|' : ''} 
          ${item.color ? 'ل: ' + item.color : ''}
        </div>
        <div class="summary-item-meta">الكمية: ${item.qty}</div>
      </div>
      <div style="font-weight:700;font-size:0.9rem">${App.formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  updateCheckoutSummary();
}

window.updateCheckoutSummary = function() {
  const subtotal = DB.getCartTotal();
  const govSelect = document.getElementById('customerGov');
  
  if (govSelect.value) {
    shippingRate = DB.getShippingRate(govSelect.value);
  } else {
    shippingRate = 0;
  }

  // Check discount
  let discountAmount = 0;
  const savedCoupon = localStorage.getItem('fayonka_coupon');
  
  if (savedCoupon) {
    const res = DB.validateCoupon(savedCoupon, subtotal);
    if (res.valid) {
      discountData = res;
      discountAmount = res.type === 'percentage' ? subtotal * (res.value / 100) : res.value;
      
      document.getElementById('coDiscountRow').style.display = 'flex';
      document.getElementById('coDiscount').textContent = `-${App.formatPrice(discountAmount)}`;
    } else {
      localStorage.removeItem('fayonka_coupon');
      discountData = null;
      document.getElementById('coDiscountRow').style.display = 'none';
    }
  } else {
    document.getElementById('coDiscountRow').style.display = 'none';
  }

  // Check free shipping threshold
  const shippingConfig = DB.getShipping();
  if (shippingConfig && shippingConfig.freeShippingThreshold > 0 && subtotal >= shippingConfig.freeShippingThreshold) {
    shippingRate = 0;
  }

  orderTotal = (subtotal + shippingRate) - discountAmount;
  orderTotal = Math.max(0, orderTotal);

  document.getElementById('coSubtotal').textContent = App.formatPrice(subtotal);
  document.getElementById('coShipping').textContent = shippingRate === 0 ? (govSelect.value ? 'مجاني' : '---') : App.formatPrice(shippingRate);
  document.getElementById('coTotal').textContent = App.formatPrice(orderTotal);
}

// STEP NAVIGATION
window.goToReview = function() {
  const form = document.getElementById('shippingForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Collect data
  orderDataToSubmit = {
    customer: {
      name: document.getElementById('customerName').value,
      phone: document.getElementById('customerPhone').value,
      whatsapp: document.getElementById('customerWhatsapp').value,
      governorate: document.getElementById('customerGov').value,
      city: document.getElementById('customerCity').value,
      address: document.getElementById('customerAddress').value,
      notes: document.getElementById('customerNotes').value
    },
    items: cartItems,
    subtotal: DB.getCartTotal(),
    shipping: shippingRate,
    discount: discountData ? (discountData.type === 'percentage' ? DB.getCartTotal() * (discountData.value / 100) : discountData.value) : 0,
    couponCode: discountData ? localStorage.getItem('fayonka_coupon') : null,
    total: orderTotal,
    paymentMethod: 'cod'
  };

  // Populate Review
  document.getElementById('revName').textContent = orderDataToSubmit.customer.name;
  document.getElementById('revPhone').textContent = `${orderDataToSubmit.customer.phone} / واتس: ${orderDataToSubmit.customer.whatsapp}`;
  document.getElementById('revAddress').textContent = `${orderDataToSubmit.customer.governorate}، ${orderDataToSubmit.customer.city} - ${orderDataToSubmit.customer.address}`;
  document.getElementById('revTotal').textContent = App.formatPrice(orderTotal);

  // Switch UI
  document.getElementById('stepShippingForm').classList.remove('active');
  document.getElementById('stepReviewForm').classList.add('active');
  
  document.getElementById('step2Indicator').classList.remove('active');
  document.getElementById('step2Indicator').classList.add('completed');
  document.getElementById('step2Indicator').querySelector('.step-circle').textContent = '✓';
  
  document.getElementById('step3Indicator').classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.backToShipping = function() {
  document.getElementById('stepReviewForm').classList.remove('active');
  document.getElementById('stepShippingForm').classList.add('active');
  
  document.getElementById('step3Indicator').classList.remove('active');
  
  document.getElementById('step2Indicator').classList.add('active');
  document.getElementById('step2Indicator').classList.remove('completed');
  document.getElementById('step2Indicator').querySelector('.step-circle').textContent = '2';
}

window.submitOrder = function() {
  if (!orderDataToSubmit) return;

  const order = DB.createOrder(orderDataToSubmit);
  
  if (order) {
    // If coupon used, update usage
    if (orderDataToSubmit.couponCode) {
      DB.useCoupon(orderDataToSubmit.couponCode);
      localStorage.removeItem('fayonka_coupon');
    }

    // Success UI
    document.getElementById('stepReviewForm').classList.remove('active');
    document.getElementById('stepSuccess').classList.add('active');
    
    document.getElementById('step3Indicator').classList.remove('active');
    document.getElementById('step3Indicator').classList.add('completed');
    document.getElementById('step3Indicator').querySelector('.step-circle').textContent = '✓';
    
    document.getElementById('successOrderId').textContent = order.id;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    App.toast('error', 'خطأ', 'حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مرة أخرى');
  }
}
