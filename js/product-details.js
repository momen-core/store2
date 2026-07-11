/**
 * FAYONKA - Product Details JavaScript
 */

let product = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
});

function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id) {
    showNotFound();
    return;
  }

  product = DB.getProductById(id);
  if (!product) {
    showNotFound();
    return;
  }

  // Track view
  DB.addRecentlyViewed(product.id);

  renderProduct();
  renderReviews();
  renderRelatedProducts();
  renderRecentlyViewed();
}

function showNotFound() {
  document.getElementById('notFoundState').style.display = 'block';
  document.getElementById('productLayout').style.display = 'none';
  document.getElementById('tabsSection').style.display = 'none';
}

function renderProduct() {
  document.getElementById('productLayout').style.opacity = '1';
  document.getElementById('tabsSection').style.display = 'block';

  // Breadcrumb
  document.getElementById('breadcrumbCat').textContent = product.category;
  document.getElementById('breadcrumbCat').href = `products.html?category=${product.categoryId}`;
  document.getElementById('breadcrumbName').textContent = product.name;

  // Header Info
  document.getElementById('productTitle').textContent = product.name;
  document.getElementById('productBrand').textContent = product.brand || 'فيونكة';
  document.getElementById('productSku').textContent = product.sku || 'N/A';
  
  // Rating
  document.getElementById('productStars').innerHTML = App.buildStars(product.rating || 0);
  document.getElementById('productReviewsCount').textContent = `(${product.reviewsCount || 0} تقييم)`;

  // Price
  const priceMain = document.getElementById('productPrice');
  const priceOldBox = document.getElementById('productPriceDiscount');
  
  priceMain.textContent = App.formatPrice(product.salePrice || product.price);
  
  if (product.discount > 0) {
    priceOldBox.style.display = 'block';
    document.getElementById('productPriceOld').textContent = App.formatPrice(product.price);
    document.getElementById('productPriceBadge').textContent = `وفري ${product.discount}%`;
  }

  // Description
  document.getElementById('productDescSnippet').textContent = product.description;
  document.getElementById('fullDescription').innerHTML = product.description.replace(/\n/g, '<br>');

  // Gallery
  renderGallery();
  
  // Badges
  let badges = '';
  if (product.isNew) badges += `<span class="badge badge-new">جديد</span>`;
  if (product.discount > 0) badges += `<span class="badge badge-sale">تخفيض</span>`;
  document.getElementById('productBadges').innerHTML = badges;

  // Dynamic Selectors (Size & Color)
  renderSelectors();

  // Stock Status
  renderStockStatus();

  // Wishlist Button
  const wlBtn = document.getElementById('wishlistBtn');
  if (DB.isInWishlist(product.id)) wlBtn.style.color = 'var(--danger)';
  
  wlBtn.onclick = () => {
    App.toggleWishlist(product.id);
    wlBtn.style.color = DB.isInWishlist(product.id) ? 'var(--danger)' : 'var(--text-secondary)';
  };

  // Add to cart buttons
  document.getElementById('addToCartBtn').onclick = () => handleAddToCart(false);
  document.getElementById('buyNowBtn').onclick = () => handleAddToCart(true);
}

function renderGallery() {
  const mainImg = document.getElementById('mainImage');
  const thumbsContainer = document.getElementById('thumbnailsContainer');
  const images = product.images || [];

  if (images.length === 0) {
    mainImg.src = 'https://via.placeholder.com/600x800/F5EEE5/C8A882?text=فيونكة';
    return;
  }

  mainImg.src = images[0];
  
  // Setup Zoom Modal
  mainImg.onclick = () => {
    document.getElementById('zoomImage').src = mainImg.src;
    App.openModal('zoomModal');
  };

  if (images.length > 1) {
    thumbsContainer.innerHTML = images.map((src, i) => `
      <img src="${src}" class="thumbnail ${i===0 ? 'active' : ''}" 
           onclick="changeMainImage(this, '${src}')">
    `).join('');
  }
}

window.changeMainImage = function(el, src) {
  document.getElementById('mainImage').src = src;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function renderSelectors() {
  const container = document.getElementById('dynamicSelectors');
  let html = '';

  // Colors
  if (product.hasColor && product.colors && product.colors.length > 0) {
    html += `
      <div class="mb-lg">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <label class="form-label">اللون: <span id="colorNameLabel" style="font-weight:700">--</span></label>
        </div>
        <div class="color-swatches">
          ${product.colors.map(c => `
            <div class="color-swatch ${c.qty <= 0 ? 'disabled' : ''}" 
                 style="background-color:${c.hex}; ${c.qty <= 0 ? 'opacity:0.3;cursor:not-allowed' : ''}"
                 title="${c.name} - ${c.qty > 0 ? c.qty + ' متوفر' : 'نفد'}"
                 ${c.qty > 0 ? `onclick="selectColor('${c.name}')"` : ''}
                 id="col_${c.name}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Sizes
  if (product.hasSize && product.sizes && product.sizes.length > 0) {
    html += `
      <div class="mb-lg">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <label class="form-label">المقاس:</label>
          <button class="btn-ghost" style="font-size:0.8rem;text-decoration:underline">دليل المقاسات</button>
        </div>
        <div class="size-buttons">
          ${product.sizes.map(s => `
            <button class="size-btn ${s.qty <= 0 ? 'disabled' : ''}" 
                    ${s.qty > 0 ? `onclick="selectSize('${s.name}')"` : 'disabled'}
                    title="${s.qty > 0 ? s.qty + ' متوفر' : 'نفد'}"
                    id="size_${s.name}">
              ${s.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

window.selectColor = function(name) {
  selectedColor = name;
  document.getElementById('colorNameLabel').textContent = name;
  
  // UI update
  document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active'));
  document.getElementById(`col_${name}`).classList.add('active');
  
  checkStockSelection();
}

window.selectSize = function(name) {
  selectedSize = name;
  
  // UI update
  document.querySelectorAll('.size-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`size_${name}`).classList.add('active');
  
  checkStockSelection();
}

function checkStockSelection() {
  let maxQty = product.qty;
  
  if (selectedColor && product.colors) {
    const c = product.colors.find(x => x.name === selectedColor);
    if (c) maxQty = Math.min(maxQty, c.qty);
  }
  
  if (selectedSize && product.sizes) {
    const s = product.sizes.find(x => x.name === selectedSize);
    if (s) maxQty = Math.min(maxQty, s.qty);
  }

  // Reset qty if current exceeds max
  if (quantity > maxQty) {
    quantity = Math.max(1, maxQty);
    document.getElementById('qtyValue').textContent = quantity;
  }
  
  renderStockStatus(maxQty);
}

function renderStockStatus(specificQty = null) {
  const box = document.getElementById('stockStatus');
  const qtyToCheck = specificQty !== null ? specificQty : product.qty;
  
  const addBtn = document.getElementById('addToCartBtn');
  const buyBtn = document.getElementById('buyNowBtn');

  if (qtyToCheck <= 0) {
    box.className = 'stock-status out-of-stock';
    box.innerHTML = `❌ نفد المخزون`;
    addBtn.disabled = true;
    buyBtn.disabled = true;
  } else if (qtyToCheck <= 5) {
    box.className = 'stock-status low-stock';
    box.innerHTML = `⚠️ متبقي ${qtyToCheck} قطع فقط!`;
    addBtn.disabled = false;
    buyBtn.disabled = false;
  } else {
    box.className = 'stock-status in-stock';
    box.innerHTML = `✅ متوفر في المخزون`;
    addBtn.disabled = false;
    buyBtn.disabled = false;
  }
}

window.updateQty = function(change) {
  let maxQty = product.qty;
  if (selectedColor && product.colors) maxQty = Math.min(maxQty, product.colors.find(c => c.name === selectedColor)?.qty || 0);
  if (selectedSize && product.sizes) maxQty = Math.min(maxQty, product.sizes.find(s => s.name === selectedSize)?.qty || 0);

  let newQty = quantity + change;
  if (newQty >= 1 && newQty <= maxQty) {
    quantity = newQty;
    document.getElementById('qtyValue').textContent = quantity;
  } else if (newQty > maxQty) {
    App.toast('warning', 'عذراً', `الكمية المتاحة ${maxQty} فقط`);
  }
}

function handleAddToCart(redirect) {
  // Validation
  if (product.hasColor && product.colors?.length > 0 && !selectedColor) {
    App.toast('warning', 'مطلوب', 'يرجى اختيار اللون');
    return;
  }
  if (product.hasSize && product.sizes?.length > 0 && !selectedSize) {
    App.toast('warning', 'مطلوب', 'يرجى اختيار المقاس');
    return;
  }

  const success = App.addToCart(product.id, quantity, selectedSize, selectedColor);
  
  if (success && redirect) {
    window.location.href = 'checkout.html';
  } else if (success) {
    // Show drawer
    const drawer = document.getElementById('cartDrawer'); // if we implement global drawer
  }
}

// ============================================
// TABS
// ============================================
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ============================================
// REVIEWS
// ============================================
function renderReviews() {
  const reviews = DB.getReviews(product.id);
  
  document.getElementById('tabReviewsCount').textContent = reviews.length;
  document.getElementById('summaryCount').textContent = reviews.length;
  document.getElementById('summaryRating').textContent = (product.rating || 0).toFixed(1);
  document.getElementById('summaryStars').innerHTML = App.buildStars(product.rating || 0);

  const list = document.getElementById('reviewsList');
  
  if (reviews.length === 0) {
    list.innerHTML = `<div class="text-center p-xl text-muted">لا توجد تقييمات حتى الآن. كوني أول من يقيم!</div>`;
    return;
  }

  list.innerHTML = reviews.map(r => `
    <div class="review-item">
      <div class="review-header">
        <div class="review-author">${r.name}</div>
        <div class="review-date">${App.formatDate(r.date)}</div>
      </div>
      <div class="stars mb-sm">${App.buildStars(r.rating)}</div>
      <div class="text-secondary" style="font-size:0.9rem">${r.comment}</div>
    </div>
  `).join('');
}

window.submitReview = function() {
  const name = document.getElementById('reviewName').value.trim();
  const comment = document.getElementById('reviewComment').value.trim();
  const rating = document.querySelector('input[name="rating"]:checked').value;

  if (!name || !comment) {
    App.toast('error', 'خطأ', 'يرجى إدخال الاسم والتعليق');
    return;
  }

  DB.addReview({
    productId: product.id,
    name,
    comment,
    rating: parseInt(rating)
  });

  App.toast('success', 'شكراً لك', 'تم إضافة تقييمك بنجاح');
  App.closeModal('reviewModal');
  
  // Reload product to get new rating
  product = DB.getProductById(product.id);
  renderProduct();
  renderReviews();
}

// ============================================
// RELATED & RECENT
// ============================================
function renderRelatedProducts() {
  const allRelated = DB.getProducts({ categoryId: product.categoryId, active: true })
                       .filter(p => p.id !== product.id);
                       
  if (allRelated.length > 0) {
    document.getElementById('relatedSection').style.display = 'block';
    document.getElementById('relatedGrid').innerHTML = allRelated.slice(0, 5).map(p => App.buildProductCard(p)).join('');
  }
}

function renderRecentlyViewed() {
  const recent = DB.getRecentlyViewed().filter(p => p.id !== product.id);
  if (recent.length > 0) {
    document.getElementById('recentSection').style.display = 'block';
    document.getElementById('recentGrid').innerHTML = recent.slice(0, 5).map(p => App.buildProductCard(p)).join('');
  }
}

// ============================================
// SHARE
// ============================================
window.shareOn = function(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(product.name);
  
  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${title} - ${url}`);
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  } else if (platform === 'copy') {
    App.copyLink(product.id);
  }
}
