document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. INTERACTIVE MOUSE GLOW BACKGROUND
  // ==========================================================================
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth lerp (linear interpolation) loop for mouse tracking
    const updateGlowPosition = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      // Speed factor (0.1 = smooth slow follow)
      currentX += dx * 0.1;
      currentY += dy * 0.1;
      
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateGlowPosition);
    };
    updateGlowPosition();
  }

  // ==========================================================================
  // 2. FIXED NAVBAR SCROLL MORPH
  // ==========================================================================
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page is refreshed while scrolled

  // ==========================================================================
  // 3. INTERACTIVE NAVIGATION SLIDING PILL (HUD MENU)
  // ==========================================================================
  const menuList = document.getElementById('hud-menu-list');
  const menuLinks = document.querySelectorAll('.hud-link');
  const indicator = document.getElementById('nav-indicator');

  if (menuList && indicator) {
    const positionIndicator = (activeElement) => {
      if (!activeElement) {
        indicator.style.opacity = '0';
        return;
      }
      
      const width = activeElement.offsetWidth;
      const left = activeElement.offsetLeft;
      
      indicator.style.width = `${width}px`;
      indicator.style.transform = `translateX(${left}px)`;
      indicator.style.opacity = '1';
    };

    // Initialize pill on the active link
    const activeLink = menuList.querySelector('.hud-link.active');
    if (activeLink) {
      // Small timeout to allow styles/fonts to mount first (prevents wrong offset calculations)
      setTimeout(() => {
        positionIndicator(activeLink);
      }, 100);
    }

    // Attach hover transitions
    menuLinks.forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        positionIndicator(e.target);
      });
    });

    // Reset indicator position back to active link when mouse leaves the navbar
    menuList.addEventListener('mouseleave', () => {
      const currentActive = menuList.querySelector('.hud-link.active');
      if (currentActive) {
        positionIndicator(currentActive);
      } else {
        indicator.style.opacity = '0';
      }
    });

    // Update positions on window resize to keep offsets matching layout
    window.addEventListener('resize', () => {
      const currentActive = menuList.querySelector('.hud-link.active') || menuList.querySelector('.hud-link:hover');
      if (currentActive) {
        positionIndicator(currentActive);
      }
    });
  }

  // ==========================================================================
  // 4. MOBILE DRAWER MENU NAVIGATION
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-navigation-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburgerBtn && mobileDrawer) {
    const toggleMenu = () => {
      const isActive = hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : ''; // Prevent scroll behind drawer
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close mobile drawer when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // 5. METRIC ANIMATION LOAD ON SCROLL (SERVICES PAGE)
  // ==========================================================================
  const metricFills = document.querySelectorAll('.metric-fill');

  if (metricFills.length > 0) {
    const animateMetrics = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const percentage = fill.getAttribute('data-percent');
          fill.style.width = percentage;
          observer.unobserve(fill); // Stop observing once animated
        }
      });
    };

    // Intersection observer triggers when bars are 10% in view
    const observerOptions = {
      root: null,
      threshold: 0.1
    };

    const metricObserver = new IntersectionObserver(animateMetrics, observerOptions);

    metricFills.forEach(fill => {
      metricObserver.observe(fill);
    });
  }

  // ==========================================================================
  // 6. CONTACT FORM VALIDATION & GLOW EFFECTS
  // ==========================================================================
  const inquiryForm = document.getElementById('project-inquiry-form');

  if (inquiryForm) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    // Helper: Validates email pattern
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Validate a specific field and toggle visual indicators
    const validateField = (input, feedbackEl, validationCheck) => {
      const isValid = validationCheck();
      
      if (isValid) {
        input.style.borderColor = 'rgba(0, 242, 254, 0.4)';
        feedbackEl.style.display = 'none';
      } else {
        input.style.borderColor = 'var(--accent-pink)';
        feedbackEl.style.display = 'block';
      }
      
      return isValid;
    };

    // Attach real-time input listeners to remove error indicators when typing
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim() !== '') {
        nameInput.style.borderColor = 'rgba(0, 242, 254, 0.4)';
        document.getElementById('feedback-name').style.display = 'none';
      }
    });

    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) {
        emailInput.style.borderColor = 'rgba(0, 242, 254, 0.4)';
        document.getElementById('feedback-email').style.display = 'none';
      }
    });

    subjectInput.addEventListener('input', () => {
      if (subjectInput.value.trim() !== '') {
        subjectInput.style.borderColor = 'rgba(0, 242, 254, 0.4)';
        document.getElementById('feedback-subject').style.display = 'none';
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim() !== '') {
        messageInput.style.borderColor = 'rgba(0, 242, 254, 0.4)';
        document.getElementById('feedback-message').style.display = 'none';
      }
    });

    // Form submission interceptor
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run validation rules
      const isNameValid = validateField(
        nameInput, 
        document.getElementById('feedback-name'), 
        () => nameInput.value.trim() !== ''
      );

      const isEmailValid = validateField(
        emailInput, 
        document.getElementById('feedback-email'), 
        () => isValidEmail(emailInput.value.trim())
      );

      const isSubjectValid = validateField(
        subjectInput, 
        document.getElementById('feedback-subject'), 
        () => subjectInput.value.trim() !== ''
      );

      const isMessageValid = validateField(
        messageInput, 
        document.getElementById('feedback-message'), 
        () => messageInput.value.trim() !== ''
      );

      // Verify all components passed validation
      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show simulated loading/sending state
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = `
          Transmitting brief... 
          <svg class="loading-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: rotate-ring 1s linear infinite;">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        `;

        // Simulate API network delay
        setTimeout(() => {
          submitBtn.innerHTML = `
            Transmission Dispatch Successful!
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          submitBtn.style.background = 'var(--grad-purple-pink)';
          submitBtn.style.color = '#ffffff';
          submitBtn.style.boxShadow = '0 0 20px rgba(255, 42, 95, 0.4)';
          
          alert(`Thank you, ${nameInput.value}! Your inquiry has been sent successfully.`);
          
          // Reset form fields
          inquiryForm.reset();
          
          // Re-enable form button after timeout
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = 'var(--grad-cyan-blue)';
            submitBtn.style.color = 'var(--bg-deep)';
            submitBtn.style.boxShadow = '0 4px 15px rgba(0, 242, 254, 0.3)';
          }, 3000);
          
        }, 1800);
      }
    });
  }
});
