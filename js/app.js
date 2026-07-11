/**
 * FAYONKA - فيونكة
 * App.js - Shared Application Logic
 * Handles: Theme, Language, Cart UI, Toast, Search, Header
 */

const App = {
  // ============================================
  // LANGUAGE
  // ============================================
  lang: localStorage.getItem('fayonka_lang') || 'ar',

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('fayonka_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('en', lang === 'en');
    this.updateLangToggle();
  },

  t(arText, enText) {
    return this.lang === 'ar' ? arText : (enText || arText);
  },

  updateLangToggle() {
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = this.lang === 'ar' ? 'EN' : 'عر';
  },

  // ============================================
  // THEME
  // ============================================
  theme: localStorage.getItem('fayonka_theme') || 'light',

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('fayonka_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeToggle();
  },

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  },

  updateThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.innerHTML = this.theme === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  },

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  toast(type, title, message, duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ============================================
  // CART
  // ============================================
  updateCartBadge() {
    const count = DB.getCartCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  updateWishlistBadge() {
    const count = DB.getWishlist().length;
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  addToCart(productId, qty = 1, size = null, color = null) {
    const product = DB.getProductById(productId);
    if (!product) return;

    // Check requirements
    if (product.hasSize && product.sizes?.length > 0 && !size) {
      this.toast('warning', 'اختر المقاس', 'يرجى اختيار المقاس أولاً');
      return false;
    }
    if (product.hasColor && product.colors?.length > 0 && !color) {
      this.toast('warning', 'اختر اللون', 'يرجى اختيار اللون أولاً');
      return false;
    }

    const cartItem = {
      productId, qty,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.salePrice || product.price,
      originalPrice: product.price,
      size, color,
      category: product.category
    };

    DB.addToCart(cartItem);
    this.updateCartBadge();
    this.toast('success', 'تمت الإضافة!', `${product.name} في سلتك الآن`);
    return true;
  },

  // ============================================
  // WISHLIST
  // ============================================
  toggleWishlist(productId) {
    const product = DB.getProductById(productId);
    if (!product) return;

    DB.toggleWishlist(productId);
    const inWishlist = DB.isInWishlist(productId);
    this.updateWishlistBadge();

    // Update all wishlist buttons for this product
    document.querySelectorAll(`[data-wishlist="${productId}"]`).forEach(btn => {
      btn.classList.toggle('active', inWishlist);
    });

    if (inWishlist) {
      this.toast('success', 'أُضيفت للمفضلة', product.name);
    } else {
      this.toast('info', 'أُزيلت من المفضلة', product.name);
    }
  },

  // ============================================
  // PRODUCT CARD BUILDER
  // ============================================
  buildProductCard(product, options = {}) {
    const price = product.salePrice || product.price;
    const isInWishlist = DB.isInWishlist(product.id);
    const isOutOfStock = product.qty <= 0;
    const detailsUrl = `product-details.html?id=${product.id}`;

    let badges = '';
    if (product.isNew) badges += `<span class="badge badge-new">${this.t('جديد', 'New')}</span>`;
    if (product.discount > 0) badges += `<span class="badge badge-sale">-${product.discount}%</span>`;
    if (product.isBestSeller) badges += `<span class="badge badge-hot">${this.t('الأكثر مبيعاً', 'Best Seller')}</span>`;
    if (isOutOfStock) badges += `<span class="badge badge-out">${this.t('نفد', 'Out')}</span>`;

    const starsHtml = this.buildStars(product.rating);

    return `
      <div class="product-card animate-fade" data-product-id="${product.id}">
        <div class="product-card-image">
          <a href="${detailsUrl}">
            <img src="${product.images?.[0] || 'https://via.placeholder.com/400x500'}"
                 alt="${product.name}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/400x500/F5EEE5/C8A882?text=فيونكة'">
          </a>
          <div class="product-card-badges">${badges}</div>
          <button class="product-card-wishlist ${isInWishlist ? 'active' : ''}"
                  data-wishlist="${product.id}"
                  onclick="event.stopPropagation(); App.toggleWishlist('${product.id}')"
                  title="${this.t('أضف للمفضلة', 'Add to Wishlist')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          ${!isOutOfStock ? `
          <div class="product-card-actions">
            <button class="btn btn-primary" style="flex:1;font-size:0.8rem;padding:8px;"
                    onclick="event.stopPropagation(); App.quickAddToCart('${product.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              ${this.t('أضف للسلة', 'Add to Cart')}
            </button>
            <a href="${detailsUrl}" class="btn btn-secondary" style="width:40px;height:40px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center;"
               onclick="event.stopPropagation()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </a>
          </div>
          ` : `
          <div class="product-card-actions">
            <div class="btn btn-secondary" style="flex:1;font-size:0.8rem;padding:8px;opacity:0.6;cursor:not-allowed;">
              ${this.t('نفد المخزون', 'Out of Stock')}
            </div>
          </div>
          `}
        </div>
        <a href="${detailsUrl}" class="product-card-body" style="display:block;text-decoration:none;">
          <div class="product-card-category">${product.category}</div>
          <div class="product-card-name">${product.name}</div>
          <div class="product-card-rating">
            <div class="stars">${starsHtml}</div>
            <span class="rating-count">(${product.reviewsCount || 0})</span>
          </div>
          <div class="product-card-price">
            <span class="price-current">${this.formatPrice(price)}</span>
            ${product.discount > 0 ? `
              <span class="price-original">${this.formatPrice(product.price)}</span>
              <span class="price-discount">وفري ${product.discount}%</span>
            ` : ''}
          </div>
        </a>
      </div>
    `;
  },

  quickAddToCart(productId) {
    const product = DB.getProductById(productId);
    if (!product) return;

    // If product needs size or color selection, go to product page
    if ((product.hasSize && product.sizes?.length > 0) ||
        (product.hasColor && product.colors?.length > 0)) {
      window.location.href = `product-details.html?id=${productId}`;
      return;
    }

    this.addToCart(productId, 1);
  },

  // ============================================
  // STARS
  // ============================================
  buildStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += `<span class="star">★</span>`;
      } else if (i - 0.5 <= rating) {
        html += `<span class="star" style="opacity:0.6">★</span>`;
      } else {
        html += `<span class="star empty">☆</span>`;
      }
    }
    return html;
  },

  // ============================================
  // FORMATTING
  // ============================================
  formatPrice(price) {
    return price.toLocaleString('ar-EG') + ' جنيه';
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  },

  // ============================================
  // SEARCH
  // ============================================
  initSearch() {
    const input = document.getElementById('headerSearch');
    const dropdown = document.getElementById('searchDropdown');
    if (!input || !dropdown) return;

    let timeout;
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      const q = input.value.trim();
      if (q.length < 2) { dropdown.classList.remove('show'); return; }

      timeout = setTimeout(() => {
        const results = DB.getProducts({ search: q, active: true, limit: 6 });
        if (!results.length) {
          dropdown.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">لا توجد نتائج</div>`;
        } else {
          dropdown.innerHTML = results.map(p => `
            <a href="product-details.html?id=${p.id}" class="search-item">
              <img src="${p.images?.[0]}" alt="${p.name}" onerror="this.style.display='none'">
              <div>
                <div style="font-weight:600;font-size:0.875rem">${p.name}</div>
                <div style="color:var(--primary);font-weight:700;font-size:0.8rem">${this.formatPrice(p.salePrice || p.price)}</div>
              </div>
            </a>
          `).join('') + `
            <a href="products.html?q=${encodeURIComponent(q)}" style="display:block;padding:12px 16px;text-align:center;color:var(--primary);font-weight:600;border-top:1px solid var(--border);font-size:0.85rem">
              عرض كل النتائج (${results.length})
            </a>
          `;
        }
        dropdown.classList.add('show');
      }, 300);
    });

    document.addEventListener('click', e => {
      if (!input.closest('.header-search').contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        window.location.href = `products.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  },

  // ============================================
  // HEADER INIT
  // ============================================
  initHeader() {
    // Apply theme & lang
    document.documentElement.setAttribute('data-theme', this.theme);
    document.body.classList.toggle('en', this.lang === 'en');

    // Announcement Bar
    const settings = DB.getSettings();
    const announcementBar = document.querySelector('.header-top');
    if (announcementBar) {
      if (settings.announcement && settings.announcement.active) {
        announcementBar.style.display = 'flex';
        announcementBar.innerHTML = `<span style="color:${settings.announcement.textColor || '#fff'}">${settings.announcement.text}</span>`;
        if(settings.announcement.bgColor) {
          announcementBar.style.backgroundColor = settings.announcement.bgColor;
        }
      } else {
        announcementBar.style.display = 'none';
      }
    }

    // Update badges
    this.updateCartBadge();
    this.updateWishlistBadge();

    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      this.updateThemeToggle();
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Lang toggle
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
      this.updateLangToggle();
      langBtn.addEventListener('click', () => {
        this.setLang(this.lang === 'ar' ? 'en' : 'ar');
        location.reload();
      });
    }

    // Mobile search toggle
    const searchToggle = document.getElementById('mobileSearchToggle');
    const headerSearch = document.querySelector('.header-search');
    if (searchToggle && headerSearch) {
      searchToggle.addEventListener('click', () => {
        headerSearch.classList.toggle('show');
      });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
      });
    }

    // Init search autocomplete
    this.initSearch();

    // Active nav link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || href.startsWith(currentPage.replace('.html', '')))) {
        link.classList.add('active');
      }
    });

    // Scroll header behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (!header) return;
      const current = window.scrollY;
      if (current > 100) {
        header.style.boxShadow = 'var(--shadow-lg)';
      } else {
        header.style.boxShadow = '';
      }
      lastScroll = current;
    });
  },

  // ============================================
  // MODAL
  // ============================================
  openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  },

  // ============================================
  // SHARE PRODUCT
  // ============================================
  shareProduct(productId) {
    const product = DB.getProductById(productId);
    if (!product) return;
    const url = `${location.origin}${location.pathname}product-details.html?id=${productId}`;
    if (navigator.share) {
      navigator.share({ title: product.name, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        this.toast('success', 'تم النسخ!', 'تم نسخ رابط المنتج');
      });
    }
  },

  copyLink(productId) {
    const url = `${location.href.split('?')[0]}?id=${productId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.toast('success', 'تم النسخ!', 'تم نسخ الرابط بنجاح');
    });
  },

  // ============================================
  // SKELETON LOADER
  // ============================================
  buildProductSkeleton(count = 4) {
    return Array(count).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton" style="aspect-ratio:3/4;border-radius:0"></div>
        <div style="padding:16px">
          <div class="skeleton" style="height:12px;width:60%;margin-bottom:8px;border-radius:4px"></div>
          <div class="skeleton" style="height:16px;width:90%;margin-bottom:12px;border-radius:4px"></div>
          <div class="skeleton" style="height:12px;width:40%;margin-bottom:8px;border-radius:4px"></div>
          <div class="skeleton" style="height:20px;width:50%;border-radius:4px"></div>
        </div>
      </div>
    `).join('');
  },

  // ============================================
  // NOTIFICATIONS (Admin)
  // ============================================
  checkNotifications() {
    const lowStock = DB.getLowStockProducts();
    const newOrders = DB.getOrders({ status: 'new' });

    const badge = document.getElementById('notifBadge');
    if (badge) {
      const total = lowStock.length + newOrders.length;
      badge.textContent = total;
      badge.style.display = total > 0 ? 'flex' : 'none';
    }
  },

  // ============================================
  // INIT
  // ============================================
  init() {
    this.initHeader();

    // Animate elements on scroll
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.animate-fade').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      });
    }
  }
};

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
