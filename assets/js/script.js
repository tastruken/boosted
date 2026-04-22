// ── Init Lucide icons ──
lucide.createIcons();

// ── Mobile menu toggle ──
const menuBtn = document.getElementById('menuBtn');
const menuIcon = document.getElementById('menuIcon');
const mobileNav = document.getElementById('mobileNav');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    if (menuIcon) {
      menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
    }
    lucide.createIcons();
  });
}

// Close mobile nav on link click (only if NOT a dropdown parent)
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', (e) => {
    // Check if this link is a dropdown trigger
    const hasDropdown = link.nextElementSibling && link.nextElementSibling.classList.contains('mobile-dropdown');

    if (hasDropdown) {
      // Toggle dropdown instead of closing menu
      e.preventDefault();
      const dropdown = link.nextElementSibling;
      const isOpen = dropdown.classList.toggle('open');

      // Rotate arrow if exists
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    } else {
      // Standard link: close menu
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    }
  });
});

// ── Hero Slider ──
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.slider-dot');
const heroImgSlides = document.querySelectorAll('.hero-img-slide');
const heroFloatBadge = document.getElementById('heroFloatBadge');
const floatLabel = heroFloatBadge?.querySelector('.hero-float-label');
const floatValue = heroFloatBadge?.querySelector('.hero-float-value');

// Data para el badge flotante según slide
const badgeData = [
  { label: 'Ecosistema Activo', value: 'Sincronizado' },
  { label: 'Tiempo Ahorrado', value: '20 Hrs/Semana' },
  { label: 'Tasa de Conversión', value: '+45% Leads' },
  { label: 'Alcance Orgánico', value: 'Potenciado' }
];

let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  if (heroSlides.length === 0) return;

  // Exit current slide text
  heroSlides[currentSlide].classList.remove('active');
  heroSlides[currentSlide].classList.add('exiting');
  heroDots[currentSlide].classList.remove('active');

  // Exit current img
  if (heroImgSlides[currentSlide]) {
    heroImgSlides[currentSlide].classList.remove('active');
  }

  // Animate badge out
  if (heroFloatBadge) {
    heroFloatBadge.style.opacity = '0';
    heroFloatBadge.style.transform = 'translateY(10px) scale(0.95)';
  }

  const prevSlide = currentSlide;
  setTimeout(() => {
    heroSlides[prevSlide].classList.remove('exiting');
  }, 600); // Matches CSS transition duration

  // Set new slide
  currentSlide = index;

  heroSlides[currentSlide].classList.add('active');
  heroDots[currentSlide].classList.add('active');

  // Enter new img
  if (heroImgSlides[currentSlide]) {
    heroImgSlides[currentSlide].classList.add('active');
  }

  // Update badge and animate in
  if (heroFloatBadge) {
    setTimeout(() => {
      if (floatLabel) floatLabel.textContent = badgeData[currentSlide].label;
      if (floatValue) floatValue.textContent = badgeData[currentSlide].value;
      heroFloatBadge.style.opacity = '1';
      heroFloatBadge.style.transform = 'translateY(0) scale(1)';
    }, 300);
  }

  // Re-init lucide icons for new slide
  lucide.createIcons();
}

function nextSlide() {
  if (heroSlides.length === 0) return;
  const next = (currentSlide + 1) % heroSlides.length;
  showSlide(next);
}

function startSlider() {
  if (heroSlides.length === 0) return;
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
  clearInterval(slideInterval);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (index === currentSlide) return;
    stopSlider();
    showSlide(index);
    startSlider();
  });
});

// Flechas hero prev / next
const heroPrevBtn = document.getElementById('heroPrev');
const heroNextBtn = document.getElementById('heroNext');

if (heroPrevBtn) {
  heroPrevBtn.addEventListener('click', () => {
    stopSlider();
    const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(prev);
    startSlider();
  });
}

if (heroNextBtn) {
  heroNextBtn.addEventListener('click', () => {
    stopSlider();
    const next = (currentSlide + 1) % heroSlides.length;
    showSlide(next);
    startSlider();
  });
}

// Start sliding
startSlider();

// ── Scroll reveal with IntersectionObserver ──
const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .anim-fadeup');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => observer.observe(el));

// ── Contact form submission (AJAX to Formspree) ──
const contactForm = document.getElementById('contactForm');
const formLoadTime = Date.now(); // Track when the script loads for anti-spam

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.btn-subscribe');
    const messageInput = form.querySelector('textarea[name="message"]');
    
    // Anti-spam: Time Validation (Must take more than 4 seconds to fill out)
    const timeToSubmit = (Date.now() - formLoadTime) / 1000;
    if (timeToSubmit < 4) {
      console.warn("Spam detected: Form submitted too quickly.");
      return; // Silently fail for bots, they won't realize it didn't send
    }

    if (btn) {
      // Anti-spam: Link Blocking in the message
      if (messageInput) {
        const msg = messageInput.value.toLowerCase();
        if (msg.includes('http://') || msg.includes('https://') || msg.includes('www.')) {
          const originalContent = btn.innerHTML;
          btn.innerHTML = 'No se permiten enlaces externos';
          btn.style.background = '#ff4444';
          btn.style.color = '#fff';
          
          setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.color = '';
            lucide.createIcons();
          }, 4000);
          return; // Stop execution
        }
      }

      const originalContent = btn.innerHTML;
      btn.innerHTML = 'Enviando...';
      btn.style.pointerEvents = 'none';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success State
          btn.innerHTML = '¡Mensaje Enviado! <i data-lucide="check" style="width: 1.2rem; height: 1.2rem; margin-left: 0.5rem; display: inline-block; vertical-align: middle;"></i>';
          btn.style.background = 'var(--boosted)';
          btn.style.color = '#030303';
          lucide.createIcons();
          form.reset();
        } else {
          // Error State from Formspree
          btn.innerHTML = 'Error al enviar';
          btn.style.background = '#ff4444';
          btn.style.color = '#fff';
        }
      } catch (error) {
        // Network Error
        btn.innerHTML = 'Error de conexión';
        btn.style.background = '#ff4444';
        btn.style.color = '#fff';
      }

      // Reset button after 4 seconds
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.pointerEvents = 'auto';
        lucide.createIcons();
      }, 4000);
    }
  });
}

// ── Testimonial Slider ──
const testSlider = document.getElementById('testimonialSlider');
const testCards = document.querySelectorAll('.testimonial-card');
const testDots = document.querySelectorAll('#testNav .slider-dot');

let currentTest = 0;
let testInterval;

function showTestimonial(index) {
  if (testCards.length === 0) return;

  testCards[currentTest].classList.remove('active');
  testDots[currentTest].classList.remove('active');

  currentTest = index;

  testCards[currentTest].classList.add('active');
  testDots[currentTest].classList.add('active');

  // Mover el slider horizontalmente
  testSlider.style.transform = `translateX(-${currentTest * 100}%)`;
}

function nextTestimonial() {
  if (testCards.length === 0) return;
  const next = (currentTest + 1) % testCards.length;
  showTestimonial(next);
}

function startTestSlider() {
  if (testCards.length === 0) return;
  testInterval = setInterval(nextTestimonial, 6000); // 6 segundos
}

function stopTestSlider() {
  clearInterval(testInterval);
}

testDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (index === currentTest) return;
    stopTestSlider();
    showTestimonial(index);
    startTestSlider();
  });
});

// Flechas prev / next
const testPrev = document.getElementById('testPrev');
const testNext = document.getElementById('testNext');

if (testPrev) {
  testPrev.addEventListener('click', () => {
    stopTestSlider();
    const prev = (currentTest - 1 + testCards.length) % testCards.length;
    showTestimonial(prev);
    startTestSlider();
  });
}

if (testNext) {
  testNext.addEventListener('click', () => {
    stopTestSlider();
    const next = (currentTest + 1) % testCards.length;
    showTestimonial(next);
    startTestSlider();
  });
}

// Initialize first testimonial
if (testCards.length > 0) {
  testCards[0].classList.add('active');
  startTestSlider();
}
