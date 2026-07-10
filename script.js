document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Header Scroll State
  // ==========================================================================
  const header = document.getElementById('header');
  
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Init on load in case page is refreshed halfway

  // ==========================================================================
  // 2. Mobile Menu Navigation Overlay
  // ==========================================================================
  const hamburger = document.getElementById('hamburger-menu');
  const mobileNav = document.getElementById('mobile-nav-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('overflow-hidden'); // Disable scrolling when menu open
  };
  
  hamburger.addEventListener('click', toggleMobileMenu);
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile nav when clicking outside of list items
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      toggleMobileMenu();
    }
  });

  // ==========================================================================
  // 3. Hero Typing Subtitle Animation
  // ==========================================================================
  const typewriterText = document.getElementById('typewriter-text');
  const phrases = [
    "Flutter Developer",
    "Cross-Platform Mobile App Developer",
    "AI-Powered Application Developer"
  ];
  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  const typeEffect = () => {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      // Deleting characters
      typewriterText.textContent = currentPhrase.substring(0, characterIndex - 1);
      characterIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      // Adding characters
      typewriterText.textContent = currentPhrase.substring(0, characterIndex + 1);
      characterIndex++;
      typingSpeed = 100; // Normal typing speed
    }
    
    // Switch logic
    if (!isDeleting && characterIndex === currentPhrase.length) {
      // Pause at full word, then start deleting
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && characterIndex === 0) {
      // Finished deleting word, move to next
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing next word
    }
    
    setTimeout(typeEffect, typingSpeed);
  };
  
  if (typewriterText) {
    setTimeout(typeEffect, 1000); // Start typing with slight initial delay
  }

  // ==========================================================================
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Keep observing if you want reveal on every scroll, or unobserve for one-time animation
        // We choose one-time entry reveal for better performance and clean feel
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12, // Element is 12% visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before screen bottom boundary
  });
  
  reveals.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 5. Stat Counter Animation
  // ==========================================================================
  const statsSection = document.getElementById('stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      const duration = 2000; // Total count duration in ms
      const frameRate = 1000 / 60; // ~60fps
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;
      
      const countUp = () => {
        frame++;
        const progress = frame / totalFrames;
        // EaseOutQuad function for count-up deceleration
        const easeValue = progress * (2 - progress);
        const currentValue = Math.round(easeValue * target);
        
        stat.textContent = currentValue;
        
        if (frame < totalFrames) {
          requestAnimationFrame(countUp);
        } else {
          stat.textContent = target; // Ensure exact final value
        }
      };
      
      countUp();
    });
  };
  
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
        observer.unobserve(entry.target); // Trigger count only once
      }
    });
  }, {
    threshold: 0.25
  });
  
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 6. Navigation Active Links Spy
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const activeNavSpy = () => {
    let currentActiveId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Highlight the section when scroll is past 180px above section boundary
      if (window.scrollY >= (sectionTop - 180)) {
        currentActiveId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveId}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', activeNavSpy);
  
  // Set active link for the current hash on page loads
  if (window.location.hash) {
    const activeHash = window.location.hash;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === activeHash) {
        link.classList.add('active');
      }
    });
  }

  // ==========================================================================
  // 7. Back To Top Button Handler
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  
  const handleBackToTopVisibility = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };
  
  window.addEventListener('scroll', handleBackToTopVisibility);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================================================
  // 8. Contact Form Submission & Toast Messages
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  
  // Custom glassmorphic toast factory
  const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    const iconClass = type === 'success' ? 'toast-icon-success' : 'toast-icon-error';
    
    toast.innerHTML = `
      <span class="toast-icon ${iconClass}">${icon}</span>
      <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    
    // Auto remove after 4.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      // Wait for slide-out CSS transition before removing DOM element
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4500);
  };
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      let hasError = false;
      
      // Simple custom validation visual feedback
      [nameInput, emailInput, messageInput].forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          hasError = true;
        } else {
          input.classList.remove('error');
        }
      });
      
      // Regex check email validity
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() && !emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        hasError = true;
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      
      if (hasError) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      
      // Simulate form submission process (e.g. AJAX / fetch)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="stroke-icon animate-spin" viewBox="0 0 24 24" style="animation: float 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-dasharray="32" fill="none"/>
        </svg> Sending...
      `;
const templateParams = {
    from_name: nameInput.value.trim(),
    reply_to: emailInput.value.trim(),
    message: messageInput.value.trim(),
};

emailjs.send(
    "service_tpi2ppk",
    "template_xhpascn",
    templateParams
)
.then(() => {

    showToast(
        `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`,
        "success"
    );

    contactForm.reset();

})
.catch((error) => {

    console.error(error);

    showToast(
        "The contact service is temporarily unavailable. Please email me directly at gourabgiri164@gmail.com.",
        "error"
    );

})
.finally(() => {

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

});
    });
    
    // Clear error border on user typing
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.remove('error');
        }
      });
    });
  }

});
