/**
 * FAYONKA - Wishlist JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

function renderWishlist() {
  const wishlistIds = DB.getWishlist();
  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('emptyWishlistState');
  const countText = document.getElementById('wishlistCountText');
  
  countText.textContent = `لديكِ ${wishlistIds.length} منتجات في المفضلة`;

  if (wishlistIds.length === 0) {
    emptyState.style.display = 'block';
    grid.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  grid.style.display = 'grid';

  // Get products data
  const products = wishlistIds.map(id => DB.getProductById(id)).filter(p => p !== null);

  grid.innerHTML = products.map(p => App.buildProductCard(p)).join('');
}

// Override App.toggleWishlist locally to re-render grid
const originalToggleWishlist = App.toggleWishlist;
App.toggleWishlist = function(productId) {
  const isAdded = originalToggleWishlist.call(App, productId);
  
  // If we are on wishlist page, and item was removed, remove it from DOM with animation
  if (!isAdded) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
      card.style.transform = 'scale(0.8)';
      card.style.opacity = '0';
      setTimeout(() => {
        renderWishlist();
      }, 300);
    } else {
      renderWishlist();
    }
  }
  
  return isAdded;
}
