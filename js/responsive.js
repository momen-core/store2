// responsive.js – Mobile enhancements

(function() {
  // Detect touch device / small screen
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmall = window.innerWidth <= 768;

  if (isTouch || isSmall) {
    document.body.classList.add('mobile-device');
  }

  // Ensure modals take full width on mobile
  function adaptModals() {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    if (window.innerWidth <= 600) {
      modal.style.width = '95%';
      modal.style.maxWidth = '95%';
    } else {
      modal.style.width = '';
      modal.style.maxWidth = '';
    }
  }

  // Handle sidebar toggle for mobile
  function initSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Re‑apply on resize/orientation change
  window.addEventListener('resize', adaptModals);
  window.addEventListener('orientationchange', adaptModals);

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    adaptModals();
    initSidebarToggle();
  });
})();
