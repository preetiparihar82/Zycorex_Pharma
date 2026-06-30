document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STICKY HEADER & ACTIVE LINKS
    // ==========================================
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load in case page starts scrolled

    // Highlight current page in navbar
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==========================================
    // 2. MOBILE MENU NAVIGATION
    // ==========================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target) && navMenu.classList.contains('open')) {
                mobileNavToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================
    // 3. DYNAMIC HERO CAROUSEL / SLIDER
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-control-prev');
    const nextBtn = document.querySelector('.slider-control-next');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const intervalTime = 6000; // 6 seconds

        // Create Navigation Dots dynamically if dot container exists
        if (dotsContainer) {
            slides.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (idx === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(idx);
                    resetTimer();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const dots = document.querySelectorAll('.slider-dot');

        const updateSlideClasses = () => {
            slides.forEach((slide, idx) => {
                if (idx === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            if (dots.length > 0) {
                dots.forEach((dot, idx) => {
                    if (idx === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlideClasses();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlideClasses();
        };

        const goToSlide = (idx) => {
            currentSlide = idx;
            updateSlideClasses();
        };

        const startTimer = () => {
            slideInterval = setInterval(nextSlide, intervalTime);
        };

        const resetTimer = () => {
            clearInterval(slideInterval);
            startTimer();
        };

        // Arrow Controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        // Initialize Slider
        startTimer();
    }

    // ==========================================
    // 4. INTERSECTION OBSERVER SCROLL ANIMATIONS
    // ==========================================
    const animElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window && animElements.length > 0) {
        const animObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Once animated, we don't need to observe it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animElements.forEach(el => animObserver.observe(el));
    } else {
        // Fallback for browsers that do not support IntersectionObserver
        animElements.forEach(el => el.classList.add('animated'));
    }

    // ==========================================
    // 5. CONTACT & ENQUIRY FORM VALIDATION
    // ==========================================
    const contactForm = document.getElementById('enquiryForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Reset error displays
            document.querySelectorAll('.form-control').forEach(ctrl => {
                ctrl.style.borderColor = '';
                ctrl.style.boxShadow = '';
            });

            // Name validation (required, min 3 chars)
            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                markInvalid(nameInput);
                isValid = false;
            }

            // Phone validation (required, numbers, min 10 digits)
            const phoneRegex = /^[0-9\s+-]{10,15}$/;
            if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
                markInvalid(phoneInput);
                isValid = false;
            }

            // Email validation (required, valid format)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                markInvalid(emailInput);
                isValid = false;
            }

            // Message validation (required, min 10 chars)
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                markInvalid(messageInput);
                isValid = false;
            }

            if (isValid) {
                // Hide Form elements
                contactForm.style.display = 'none';
                
                // Show Success Container
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Reset form values
                contactForm.reset();
            }
        });

        function markInvalid(inputElement) {
            inputElement.style.borderColor = '#ef4444';
            inputElement.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
            inputElement.focus();
        }
    }
});
