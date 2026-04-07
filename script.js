/* ============================================
   HOME SERVICE CONSULTING - Main JavaScript
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- Active nav link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- Mobile hamburger menu ----
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ---- FAQ accordion ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- Form submission (Web3Forms) ----
document.querySelectorAll('form[data-web3form]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    const msgEl = form.querySelector('.form-message');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    if (msgEl) { msgEl.className = 'form-message'; msgEl.textContent = ''; }

    const data = new FormData(form);
    const redirect = form.dataset.redirect;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success) {
        if (redirect) {
          window.location.href = redirect;
        } else {
          form.reset();
          if (msgEl) {
            msgEl.className = 'form-message success';
            msgEl.textContent = 'Thank you! We will be in touch within 24 hours.';
          }
        }
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      if (msgEl) {
        msgEl.className = 'form-message error';
        msgEl.textContent = 'Something went wrong. Please try again or email us directly.';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
