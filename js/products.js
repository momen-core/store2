/**
 * FAYONKA - Products Page JavaScript
 */

let state = {
  products: [],
  filters: {
    categories: [],
    minPrice: null,
    maxPrice: null,
    sale: false,
    isNew: false,
    search: '',
    sort: 'newest'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
};

document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initSidebar();
  renderFilters();
  loadProducts();
});

// ============================================
// URL & INITIALIZATION
// ============================================
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('category')) state.filters.categories.push(params.get('category'));
  if (params.has('sale')) state.filters.sale = params.get('sale') === 'true';
  if (params.has('new')) state.filters.isNew = params.get('new') === 'true';
  if (params.has('q')) state.filters.search = params.get('q');
  if (params.has('sort')) state.filters.sort = params.get('sort');
  if (params.has('min')) state.filters.minPrice = parseInt(params.get('min'));
  if (params.has('max')) state.filters.maxPrice = parseInt(params.get('max'));
  if (params.has('page')) state.pagination.page = parseInt(params.get('page'));

  // Update UI to match URL
  document.getElementById('sortSelect').value = state.filters.sort;
  document.getElementById('saleFilter').checked = state.filters.sale;
  document.getElementById('newFilter').checked = state.filters.isNew;
  if (state.filters.minPrice) document.getElementById('minPrice').value = state.filters.minPrice;
  if (state.filters.maxPrice) document.getElementById('maxPrice').value = state.filters.maxPrice;
}

function updateUrlParams() {
  const params = new URLSearchParams();
  
  if (state.filters.categories.length === 1) params.set('category', state.filters.categories[0]);
  else if (state.filters.categories.length > 1) params.set('categories', state.filters.categories.join(','));
  
  if (state.filters.sale) params.set('sale', 'true');
  if (state.filters.isNew) params.set('new', 'true');
  if (state.filters.search) params.set('q', state.filters.search);
  if (state.filters.sort !== 'newest') params.set('sort', state.filters.sort);
  if (state.filters.minPrice) params.set('min', state.filters.minPrice);
  if (state.filters.maxPrice) params.set('max', state.filters.maxPrice);
  if (state.pagination.page > 1) params.set('page', state.pagination.page);

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

// ============================================
// SIDEBAR & UI
// ============================================
function initSidebar() {
  const sidebar = document.getElementById('filterSidebar');
  const overlay = document.getElementById('filterOverlay');
  const openBtn = document.getElementById('mobileFilterBtn');
  const closeBtn = document.getElementById('closeFilterBtn');

  function openSidebar() {
    sidebar.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);
}

function renderFilters() {
  // Render Categories
  const catContainer = document.getElementById('categoryFilters');
  const categories = DB.getCategories(true);
  
  catContainer.innerHTML = categories.map(cat => `
    <label class="filter-checkbox">
      <input type="checkbox" value="${cat.id}" 
             ${state.filters.categories.includes(cat.id) ? 'checked' : ''}
             onchange="toggleCategory('${cat.id}', this.checked)">
      <span>${cat.name} <small class="text-muted">(${cat.productsCount})</small></span>
    </label>
  `).join('');
}

function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  const clearBtn = document.getElementById('clearFiltersBtn');
  let html = '';
  let count = 0;

  // Categories
  if (state.filters.categories.length > 0) {
    const cats = DB.getCategories();
    state.filters.categories.forEach(id => {
      const cat = cats.find(c => c.id === id);
      if (cat) {
        html += `<div class="active-filter-tag">${cat.name} <button onclick="toggleCategory('${id}', false)">×</button></div>`;
        count++;
      }
    });
  }

  // Price
  if (state.filters.minPrice || state.filters.maxPrice) {
    const priceText = `${state.filters.minPrice || 0} - ${state.filters.maxPrice || 'أكثر'} جنيه`;
    html += `<div class="active-filter-tag">${priceText} <button onclick="clearPrice()">×</button></div>`;
    count++;
  }

  // Checkboxes
  if (state.filters.sale) {
    html += `<div class="active-filter-tag">تخفيضات <button onclick="toggleFilter('sale', false)">×</button></div>`;
    count++;
  }
  if (state.filters.isNew) {
    html += `<div class="active-filter-tag">وصل حديثاً <button onclick="toggleFilter('isNew', false)">×</button></div>`;
    count++;
  }

  // Search
  if (state.filters.search) {
    html += `<div class="active-filter-tag">بحث: ${state.filters.search} <button onclick="clearSearch()">×</button></div>`;
    count++;
  }

  container.innerHTML = html;
  clearBtn.style.display = count > 0 ? 'block' : 'none';
}

// ============================================
// FILTER ACTIONS
// ============================================
function toggleCategory(id, checked) {
  if (checked) {
    if (!state.filters.categories.includes(id)) state.filters.categories.push(id);
  } else {
    state.filters.categories = state.filters.categories.filter(c => c !== id);
  }
  // Sync checkbox
  const cb = document.querySelector(`input[value="${id}"]`);
  if (cb) cb.checked = checked;
  
  state.pagination.page = 1;
  applyFilters();
}

function applyPriceFilter() {
  const min = document.getElementById('minPrice').value;
  const max = document.getElementById('maxPrice').value;
  
  state.filters.minPrice = min ? parseInt(min) : null;
  state.filters.maxPrice = max ? parseInt(max) : null;
  
  state.pagination.page = 1;
  applyFilters();
}

function clearPrice() {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  state.filters.minPrice = null;
  state.filters.maxPrice = null;
  applyFilters();
}

function toggleFilter(key, value) {
  state.filters[key] = value;
  // Sync checkbox
  const cb = document.getElementById(key === 'sale' ? 'saleFilter' : 'newFilter');
  if (cb) cb.checked = value;
  
  state.pagination.page = 1;
  applyFilters();
}

function clearSearch() {
  state.filters.search = '';
  applyFilters();
}

function changeSort(val) {
  state.filters.sort = val;
  state.pagination.page = 1;
  applyFilters();
}

function clearFilters() {
  state.filters = { categories: [], minPrice: null, maxPrice: null, sale: false, isNew: false, search: '', sort: 'newest' };
  state.pagination.page = 1;
  
  // Reset UI
  document.querySelectorAll('#categoryFilters input').forEach(cb => cb.checked = false);
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('saleFilter').checked = false;
  document.getElementById('newFilter').checked = false;
  document.getElementById('sortSelect').value = 'newest';
  
  applyFilters();
}

function applyFilters() {
  updateUrlParams();
  loadProducts();
}

// ============================================
// DATA LOADING
// ============================================
function loadProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = App.buildProductSkeleton(8);
  
  // Build query
  const query = { active: true, sort: state.filters.sort };
  if (state.filters.sale) query.onSale = true;
  if (state.filters.isNew) query.isNew = true;
  if (state.filters.search) query.search = state.filters.search;
  if (state.filters.minPrice) query.minPrice = state.filters.minPrice;
  if (state.filters.maxPrice) query.maxPrice = state.filters.maxPrice;

  setTimeout(() => {
    // Get all matching products
    let allProducts = DB.getProducts(query);
    
    // Manual category filter if multiple
    if (state.filters.categories.length > 0) {
      allProducts = allProducts.filter(p => state.filters.categories.includes(p.categoryId));
    }
    
    state.pagination.total = allProducts.length;
    
    // Paginate
    const start = (state.pagination.page - 1) * state.pagination.limit;
    const paginated = allProducts.slice(start, start + state.pagination.limit);
    
    renderProducts(paginated);
    renderPagination();
    renderActiveFilters();
    
    // Update count text
    const countEl = document.getElementById('productsCount');
    if (state.pagination.total === 0) {
      countEl.textContent = 'لا توجد نتائج';
    } else {
      countEl.innerHTML = `عرض <span>${start + 1}</span> - <span>${Math.min(start + paginated.length, state.pagination.total)}</span> من <span>${state.pagination.total}</span> منتج`;
    }
    
  }, 400); // Simulate network delay
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  
  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;padding:80px 20px">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">لم نجد ما تبحثين عنه</h3>
        <p class="empty-state-msg">جربي تغيير خيارات الفلترة أو مسحها للبحث مرة أخرى.</p>
        <button class="btn btn-primary" onclick="clearFilters()">مسح الفلاتر</button>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = products.map(p => App.buildProductCard(p)).join('');
}

function renderPagination() {
  const container = document.getElementById('pagination');
  const totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Prev
  html += `<button class="page-btn" ${state.pagination.page === 1 ? 'disabled style="opacity:0.5"' : `onclick="goToPage(${state.pagination.page - 1})"`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`;
  
  // Pages
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= state.pagination.page - 1 && i <= state.pagination.page + 1)) {
      html += `<button class="page-btn ${i === state.pagination.page ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === state.pagination.page - 2 || i === state.pagination.page + 2) {
      html += `<span style="color:var(--text-muted);padding:0 8px">...</span>`;
    }
  }
  
  // Next
  html += `<button class="page-btn" ${state.pagination.page === totalPages ? 'disabled style="opacity:0.5"' : `onclick="goToPage(${state.pagination.page + 1})"`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;
  
  container.innerHTML = html;
}

function goToPage(page) {
  state.pagination.page = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
