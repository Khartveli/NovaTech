/**
 * NovaTech Landing Page - Interactive JavaScript
 * Features:
 *  - Theme Toggle (Dark / Light Mode with LocalStorage persistence)
 *  - Mobile Navigation Drawer Toggle
 *  - Navbar Scroll Background Effect
 *  - Active Section Intersection Observer for Navigation Links
 *  - Animated Number Counters in About Section
 *  - Contact Form Submission & Validation with Toast Notification
 *  - Newsletter Subscription Feedback
 *  - 3D Card Tilt Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Theme Toggle (Dark / Light)
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('novatech_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('novatech_theme', newTheme);
    });
  }

  // ==========================================================================
  // 2. Sticky Navbar on Scroll
  // ==========================================================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================================================
  // 3. Mobile Navigation Menu Toggle
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // 4. Active Section Highlighting in Navbar
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // ==========================================================================
  // 5. Animated Number Counters in About Section
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach((stat) => {
      const targetStr = stat.getAttribute('data-target');
      const suffix = stat.getAttribute('data-suffix') || '';
      const target = parseFloat(targetStr);
      const isDecimal = targetStr.includes('.');
      const duration = 1800; // ms
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      }, stepDuration);
    });
  };

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 6. Interactive Toast Notification
  // ==========================================================================
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  let toastTimeout;

  const showToast = (title, message, duration = 4000) => {
    if (!toast) return;
    toastTitle.textContent = title;
    toastDesc.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // ==========================================================================
  // 7. Contact Form Handling
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic Validation
      if (!firstName || !lastName || !email || !message) {
        showToast('შეცდომა', 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი.', 3500);
        return;
      }

      // Email Format Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('არასწორი ელ-ფოსტა', 'გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი.', 3500);
        return;
      }

      // Simulate sending state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
        <span>იგზავნება...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('წარმატებით გაიგზავნა!', `მადლობა ${firstName}, ჩვენი გუნდი მალე დაგიკავშირდებათ.`);
      }, 1200);
    });
  }

  // ==========================================================================
  // 8. Newsletter Form Handling
  // ==========================================================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast('მადლობა გამოწერისთვის!', 'თქვენ წარმატებით გამოიწერეთ NovaTech-ის სიახლეები.');
        input.value = '';
      }
    });
  }

  // ==========================================================================
  // 9. Interactive 3D Card Tilt Effect on Features
  // ==========================================================================
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ==========================================================================
  // 10. Dashboard Mockup Dynamic Interactive Bars
  // ==========================================================================
  const bars = document.querySelectorAll('.mockup-chart-box .bar');
  if (bars.length > 0) {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * bars.length);
      bars.forEach((bar, index) => {
        if (index === randomIndex) {
          bar.classList.add('active');
        } else if (Math.random() > 0.6) {
          bar.classList.remove('active');
        }
      });
    }, 2500);
  }
});

// Keyframe animation for spinner
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
