/**
 * FAYONKA - Home Page JavaScript
 * Handles: Hero Slider, Categories, Product Grids, Testimonials
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  renderCategories();
  renderBestSellers();
  renderNewArrivals();
  renderOnSale();
  renderRecentlyViewed();
  renderTestimonials();
});

// ============================================
// HERO SLIDER
// ============================================
let currentSlide = 0;
let sliderInterval;

function initHeroSlider() {
  const banners = DB.getBanners();
  if (!banners.length) return;

  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');

  // Build slides
  track.innerHTML = banners.map((banner, idx) => `
    <div class="hero-slide">
      <div class="hero-slide-bg" style="background-image:url('${banner.image}')"></div>
      <div class="hero-slide-overlay" style="background:linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)"></div>
      <div class="hero-content">
        <div class="hero-tag">✨ ${App.lang === 'ar' ? 'جديد' : 'New'}</div>
        <h1 class="hero-title">${banner.title}</h1>
        <p class="hero-subtitle">${banner.description}</p>
        <div class="hero-actions">
          <a href="${banner.link || 'products.html'}" class="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            ${App.lang === 'ar' ? banner.ctaText : banner.ctaTextEn}
          </a>
          <a href="products.html?sale=true" class="btn" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);color:white;border:1px solid rgba(255,255,255,0.3)">
            ${App.lang === 'ar' ? 'العروض والتخفيضات 🔥' : 'Deals & Offers 🔥'}
          </a>
        </div>
      </div>
    </div>
  `).join('');

  // Build dots
  dots.innerHTML = banners.map((_, idx) => `
    <button class="slider-dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></button>
  `).join('');

  // Controls
  document.getElementById('sliderNext')?.addEventListener('click', () => {
    goToSlide((currentSlide - 1 + banners.length) % banners.length);
  });
  document.getElementById('sliderPrev')?.addEventListener('click', () => {
    goToSlide((currentSlide + 1) % banners.length);
  });

  // Auto play
  startSlider(banners.length);

  // Pause on hover
  const slider = document.getElementById('heroSlider');
  slider?.addEventListener('mouseenter', () => clearInterval(sliderInterval));
  slider?.addEventListener('mouseleave', () => startSlider(banners.length));

  // Touch/swipe support
  let touchStart = 0;
  slider?.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
  slider?.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide((currentSlide + 1) % banners.length);
      else goToSlide((currentSlide - 1 + banners.length) % banners.length);
    }
  });
}

function goToSlide(idx) {
  const track = document.getElementById('sliderTrack');
  const dots = document.querySelectorAll('.slider-dot');
  currentSlide = idx;
  track.style.transform = `translateX(${idx * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function startSlider(total) {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    goToSlide((currentSlide + 1) % total);
  }, 5000);
}

// ============================================
// CATEGORIES
// ============================================
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  const categories = DB.getCategories(true);

  grid.innerHTML = categories.map(cat => `
    <a href="products.html?category=${cat.id}" class="category-card animate-fade">
      <img class="category-card-bg"
           src="${cat.image}"
           alt="${cat.name}"
           loading="lazy"
           onerror="this.src='https://via.placeholder.com/200x280/F5EEE5/C8A882?text=${cat.icon}'">
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <span class="category-card-icon">${cat.icon}</span>
        <div class="category-card-name">${cat.name}</div>
        <div class="category-card-count">${cat.productsCount} منتج</div>
      </div>
    </a>
  `).join('');
}

// ============================================
// PRODUCT GRIDS
// ============================================
function renderBestSellers() {
  const grid = document.getElementById('bestSellersGrid');
  if (!grid) return;

  // Show skeletons first
  grid.innerHTML = App.buildProductSkeleton(4);

  setTimeout(() => {
    const products = DB.getProducts({ active: true, isBestSeller: true, sort: 'best_selling', limit: 8 });
    if (!products.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🛍️</div><p class="empty-state-title">لا توجد منتجات</p></div>`;
      return;
    }
    grid.innerHTML = products.map(p => App.buildProductCard(p)).join('');
  }, 400);
}

function renderNewArrivals() {
  const grid = document.getElementById('newArrivalsGrid');
  if (!grid) return;

  grid.innerHTML = App.buildProductSkeleton(4);

  setTimeout(() => {
    const products = DB.getProducts({ active: true, isNew: true, sort: 'newest', limit: 8 });
    if (!products.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">✨</div><p class="empty-state-title">لا توجد منتجات جديدة</p></div>`;
      return;
    }
    grid.innerHTML = products.map(p => App.buildProductCard(p)).join('');
  }, 600);
}

function renderOnSale() {
  const grid = document.getElementById('onSaleGrid');
  if (!grid) return;

  grid.innerHTML = App.buildProductSkeleton(4);

  setTimeout(() => {
    const products = DB.getProducts({ active: true, onSale: true, sort: 'price_asc', limit: 8 });
    if (!products.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🏷️</div><p class="empty-state-title">لا توجد منتجات مخفضة حالياً</p></div>`;
      return;
    }
    grid.innerHTML = products.map(p => App.buildProductCard(p)).join('');
  }, 800);
}

function renderRecentlyViewed() {
  const section = document.getElementById('recentlyViewedSection');
  const grid = document.getElementById('recentlyViewedGrid');
  if (!section || !grid) return;

  const products = DB.getRecentlyViewed();
  if (!products.length) return;

  section.style.display = 'block';
  grid.innerHTML = products.slice(0, 6).map(p => App.buildProductCard(p)).join('');
}

// ============================================
// TESTIMONIALS
// ============================================
function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  const testimonials = [
    {
      name: 'سارة م.',
      product: 'فستان سواريه ذهبي',
      rating: 5,
      text: 'منتجات فيونكة دايما تفوق توقعاتي! الخامة ممتازة والتصميم راقٍ. استلمت طلبي في وقت قياسي والتغليف كان أنيق جداً. مش هتندمي على التسوق منهم!',
      initial: 'س'
    },
    {
      name: 'منى أ.',
      product: 'عطر رحيق الورد',
      rating: 5,
      text: 'العطر حلو جداً وريحته تدوم طول اليوم. بفضل متجر فيونكة بقيت أتسوق أون لاين بثقة. الخدمة ممتازة والتوصيل سريع. أنصح به بشدة!',
      initial: 'م'
    },
    {
      name: 'ريم خ.',
      product: 'حقيبة يد جلدية فاخرة',
      rating: 5,
      text: 'الحقيبة فخامتها تفوق المتوقع! جلد طبيعي وعمل يدوي ممتاز. التفاصيل الدقيقة تدل على الاهتمام بالجودة. هتشتري منهم تاني بكل تأكيد.',
      initial: 'ر'
    }
  ];

  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card animate-fade">
      <div class="testimonial-stars">
        ${App.buildStars(t.rating)}
      </div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.initial}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-product">اشترت: ${t.product}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// NEWSLETTER
// ============================================
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail')?.value;
  if (!email || !email.includes('@')) {
    App.toast('error', 'بريد غير صحيح', 'يرجى إدخال بريد إلكتروني صحيح');
    return;
  }
  App.toast('success', 'تم الاشتراك! 🎉', 'سيصلك كود الخصم على بريدك قريباً');
  document.getElementById('newsletterEmail').value = '';
}
