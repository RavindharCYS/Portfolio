document.addEventListener('DOMContentLoaded', () => {
    // --- 2. Global Variables & Selectors ---
    const body = document.body;
    const mainNav = document.getElementById('main-nav');
    const navLinksContainer = document.getElementById('main-nav-links');
    const navLinks = navLinksContainer.querySelectorAll('a[href^="#"]');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeToggleIcon = themeToggleButton.querySelector('i');
    const scrollProgressBar = document.querySelector('.scroll-progress');
    const backToTopButton = document.querySelector('.back-to-top');
    const copyrightYearSpan = document.getElementById('copyright-year');
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submit-btn');
    const notificationContainer = document.querySelector('.notification-container');
    const particlesContainerId = 'particles-js'; // Make sure this ID exists in HTML

    // --- 1. Initialization ---
    initTheme();
    initAOS();
    initParticles(); // Initialize particles
    initScrollEffects();
    initSkillBarsObserver();
    initLightbox();
    initMobileMenu();
    initContactForm();
    updateCopyrightYear();
    setupNavLinksSmoothScroll();

    // --- 3. Theme Toggle Functionality ---
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        themeToggleButton.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        }
        // Re-initialize particles if theme changes AFTER particles library is loaded
        if (window.particlesJS) { // Check if particlesJS is loaded
            initParticles(); // Re-init to apply new colors/opacities
        }
    }

    // --- 4. Mobile Navigation Toggle ---
    function initMobileMenu() {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinksContainer.classList.toggle('active');
            body.classList.toggle('menu-open'); // Prevent body scroll when menu is open

            // Toggle icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    mobileMenuToggle.click(); // Simulate a click to close the menu
                }
            });
        });
    }

    // --- 5. Sticky Navigation & Scroll Effects ---
    function initScrollEffects() {
        let lastScrollTop = 0;
        const navHeight = mainNav.offsetHeight;
        const sections = Array.from(document.querySelectorAll('section[id]'));

        // Throttle the scroll handler for performance
        const throttledScrollHandler = throttle(handleScroll, 100);
        window.addEventListener('scroll', throttledScrollHandler);
        // Initial check in case the page loads scrolled down
        handleScroll();

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Sticky Nav
            if (scrollTop > navHeight) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }

            // Scroll Progress Bar
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            scrollProgressBar.style.width = scrollPercent + '%';

            // Back to Top Button Visibility
            if (scrollTop > winHeight * 0.6) { // Show after scrolling 60% of viewport height
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }

            // Scroll Spy
            activateNavLink(scrollTop);

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        }

        function activateNavLink(scrollTop) {
            let currentSectionId = null;
            const scrollThreshold = navHeight + 50; // Adjust offset as needed

            sections.forEach(section => {
                const sectionTop = section.offsetTop - scrollThreshold;
                const sectionHeight = section.offsetHeight;

                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            // Handle edge case for bottom of page
            if (!currentSectionId && (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
                 currentSectionId = sections[sections.length - 1].getAttribute('id');
            }


            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }

        // Back to Top Click Listener
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Function to handle smooth scrolling for nav links (already handled by CSS scroll-behavior, but this ensures JS fallback)
    function setupNavLinksSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Calculate scroll position considering nav height
                        const navHeight = mainNav.offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight - 20; // Extra offset

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Function to calculate duration in months
function calculateDuration() {
    const durationElements = document.querySelectorAll('.duration-months');
    
    durationElements.forEach(element => {
        const startDate = new Date(element.getAttribute('data-start-date'));
        const currentDate = new Date();
        
        // Calculate the difference in months
        let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
        months += currentDate.getMonth() - startDate.getMonth();
        
        // Add 1 to include the current month
        months += 1;
        
        // Handle the singular/plural form
        const monthText = months === 1 ? 'month' : 'months';
        
        // Update the element with the calculated duration
        element.textContent = `(${months} ${monthText})`;
    });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', calculateDuration);

// Optional: Update the duration every month automatically
setInterval(calculateDuration, 1000 * 60 * 60 * 24); // Update daily

    // --- 5. Sticky Navigation & Scroll Effects ---
    function initScrollEffects() {
        let lastScrollTop = 0;
        const navHeight = mainNav.offsetHeight;
        // *** MODIFY THIS LINE ***
        const sections = Array.from(document.querySelectorAll('section[id]')); // Query ALL sections with an ID

        // Throttle the scroll handler for performance
        const throttledScrollHandler = throttle(handleScroll, 100);
        window.addEventListener('scroll', throttledScrollHandler);
        // Initial check in case the page loads scrolled down
        handleScroll();

        function handleScroll() {
            // ... rest of handleScroll function ...
            // (No changes needed inside handleScroll itself if the querySelectorAll is correct)
        }

        function activateNavLink(scrollTop) {
            // ... existing activateNavLink function ...
            // (This should work correctly now with the updated 'sections' array)
        }

        // Back to Top Click Listener
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


        // --- 6. Particles.js Initialization ---
        function initParticles() {
            const particlesContainer = document.getElementById(particlesContainerId);
            if (!particlesContainer) {
                console.warn(`Particles container with id "${particlesContainerId}" not found.`);
                return;
            }
    
            // Destroy existing instance if it exists (important for theme toggling)
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.fn.vendors.destroypJS();
                window.pJSDom = []; // Clear the pJSDom array
            }
    
    
            // Determine colors and opacities based on theme for better visibility
            const isDarkMode = body.classList.contains('dark-mode');
    
            // --- ADJUSTED VISIBILITY SETTINGS V2 ---
            const particleColor = isDarkMode ? "#a3d7f7" : "#4338ca"; // Slightly lighter blue (dark) / Darker Indigo (light)
            const lineColor = isDarkMode ? "#52627a" : "#b0bec5";    // Slightly lighter/more visible line in dark, medium gray in light
            const particleOpacity = isDarkMode ? 0.75 : 0.85; // Increased base opacity
            const lineOpacity = isDarkMode ? 0.3 : 0.35;   // Slightly reduced line opacity to make particles stand out more
            const particleSize = 4;                       // Keep size reasonable
            const particleCount = 100;                    // Increased count slightly
            const minOpacityAnim = 0.25;                  // Minimum opacity during animation
            // --- END ADJUSTED SETTINGS ---
    
            particlesJS(particlesContainerId, {
                "particles": {
                    "number": {
                        "value": particleCount, // Use adjusted count
                        "density": {
                            "enable": true,
                            "value_area": 800 // Area for density calculation
                        }
                    },
                    "color": {
                        "value": particleColor // Use adjusted particle color
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": particleOpacity, // Use adjusted opacity
                        "random": true, // Keep random opacity
                        "anim": {
                            "enable": true, // Keep opacity animation
                            "speed": 0.6,   // Slightly slower opacity animation
                            "opacity_min": minOpacityAnim, // Use adjusted minimum opacity
                            "sync": false
                        }
                    },
                    "size": {
                        "value": particleSize, // Use adjusted size
                        "random": true,
                        "anim": {
                            "enable": true,  // Enable size animation subtly
                            "speed": 3,
                            "size_min": particleSize * 0.5, // Min size is half the base
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 160, // Slightly increase distance for linking
                        "color": lineColor, // Use adjusted line color
                        "opacity": lineOpacity, // Use adjusted line opacity
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2.0, // Slightly slower movement speed
                        "direction": "none",
                        "random": true, // Keep random movement
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 150, // Increased grab distance slightly
                            "line_linked": {
                                "opacity": 0.7 // Make grabbed line more opaque, but not fully solid
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        

        // Ensure container background matches CSS (though CSS should handle this)
        // const particlesContainerElement = document.getElementById(particlesContainerId);
        //  if (particlesContainerElement) {
        //     particlesContainerElement.style.backgroundColor = bgColor; // Usually not needed if CSS is set up
        //  }
    }


    // --- 7. AOS (Animate On Scroll) Initialization ---
    function initAOS() {
        AOS.init({
            duration: 800, // Animation duration
            easing: 'ease-in-out', // Default easing
            once: true, // Animate elements only once
            mirror: false, // Whether elements should animate out while scrolling past them
            anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
            offset: 50, // Offset (in px) from the original trigger point
        });
    }

    // --- 8. Skill Bar Animation (Intersection Observer) ---
    function initSkillBarsObserver() {
        const skillSection = document.getElementById('skills');
        if (!skillSection) return;

        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of the section is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillProgressBars = entry.target.querySelectorAll('.skill-progress');
                    skillProgressBars.forEach((bar, index) => {
                        // Use the inline style width if it exists, otherwise default to 0
                        const targetWidth = bar.style.width || '0%';
                        // Reset width to 0 initially to ensure animation plays
                        bar.style.width = '0%';
                         // Apply target width with a slight delay for staggering effect
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 150 + index * 50); // Stagger animation start
                    });
                    // Stop observing once triggered
                    observer.unobserve(entry.target);
                }
            });
        };

        const skillsObserver = new IntersectionObserver(observerCallback, observerOptions);
        skillsObserver.observe(skillSection);
    }


    // --- 9. Lightbox Functionality ---
    function initLightbox() {
        let lightboxElement = null; // Reference to the created lightbox DOM element

        // Use event delegation on the body
        body.addEventListener('click', (e) => {
            const targetImage = e.target.closest('img[data-lightbox-src]');
            if (targetImage) {
                e.preventDefault(); // Prevent default image link behavior if any
                const imageSrc = targetImage.getAttribute('data-lightbox-src');
                const imageAlt = targetImage.getAttribute('alt') || 'Lightbox image';
                showLightbox(imageSrc, imageAlt);
            }

            // Close lightbox if backdrop or close button is clicked
            if (lightboxElement && (e.target === lightboxElement || e.target.classList.contains('lightbox-close'))) {
                closeLightbox();
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxElement && lightboxElement.classList.contains('show')) {
                closeLightbox();
            }
        });

        function showLightbox(src, alt) {
            // Create lightbox structure if it doesn't exist
            if (!lightboxElement) {
                lightboxElement = document.createElement('div');
                lightboxElement.className = 'lightbox';
                lightboxElement.setAttribute('role', 'dialog');
                lightboxElement.setAttribute('aria-modal', 'true');
                lightboxElement.innerHTML = `
                    <div class="lightbox-content">
                        <img src="" alt="">
                    </div>
                    <button class="lightbox-close" aria-label="Close lightbox" title="Close lightbox">×</button>
                `;
                body.appendChild(lightboxElement);
            }

            // Populate image and show
            const img = lightboxElement.querySelector('img');
            img.src = src;
            img.alt = alt;

            // Use a slight delay to allow CSS transitions
            requestAnimationFrame(() => {
                lightboxElement.classList.add('show');
                body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }

        function closeLightbox() {
            if (lightboxElement) {
                lightboxElement.classList.remove('show');
                body.style.overflow = ''; // Restore background scrolling
                // Optional: Remove lightbox from DOM after transition, or just hide
                 setTimeout(() => {
                     // Could remove here if needed: if (lightboxElement) body.removeChild(lightboxElement); lightboxElement = null;
                     // Or just reset image src
                     if(lightboxElement) lightboxElement.querySelector('img').src = '';
                 }, 300); // Match CSS transition duration
            }
        }
    }


    // --- 10. Contact Form Handling (Validation & EmailJS) ---
    function initContactForm() {
        // Initialize EmailJS (Replace with your actual keys)
        const SERVICE_ID = "service_s2rjpbq"; // Replace with your EmailJS Service ID
        const TEMPLATE_ID = "template_o2s64pl"; // Replace with your EmailJS Template ID
        const PUBLIC_KEY = "Ny9Ko_FtQ9HSmaIv0"; // Replace with your EmailJS Public Key

        // Check if EmailJS library is loaded before initializing
        if (typeof emailjs !== 'undefined') {
            emailjs.init(PUBLIC_KEY);
        } else {
            console.error("EmailJS library not loaded. Contact form will not work.");
            // Optionally disable the form or show a message to the user
             if(submitButton) submitButton.disabled = true;
             if(contactForm) contactForm.addEventListener('submit', (e) => {
                 e.preventDefault();
                 showNotification('error', 'Contact form is currently unavailable. Please try again later or contact me directly.');
             });
            return; // Exit if EmailJS isn't available
        }


        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            if (!validateForm()) {
                showNotification('error', 'Please fill in all required fields correctly.');
                return; // Stop submission if validation fails
            }

            // Disable button and show spinner
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Send email using EmailJS
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
                .then(() => {
                    // Success
                    showNotification('success', 'Message sent successfully! I will get back to you soon.');
                    contactForm.reset(); // Clear the form
                    clearValidationErrors(); // Clear any previous error messages
                }, (error) => {
                    // Error
                    console.error('EmailJS Error:', error);
                    showNotification('error', `Failed to send message. Error: ${error.text || 'Unknown error'}. Please try again later or contact me directly.`);
                })
                .finally(() => {
                    // Re-enable button and restore text
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                });
        });
    }

    function validateForm() {
        let isValid = true;
        clearValidationErrors(); // Clear previous errors

        const nameInput = document.getElementById('user_name');
        const emailInput = document.getElementById('user_email');
        const messageInput = document.getElementById('message');

        // Name validation (required)
        if (!nameInput || !nameInput.value.trim()) {
            isValid = false;
             if(nameInput) showValidationError(nameInput, 'Name is required.');
        }

        // Email validation (required and format)
        if (!emailInput || !emailInput.value.trim()) {
            isValid = false;
             if(emailInput) showValidationError(emailInput, 'Email is required.');
        } else if (emailInput && !/\S+@\S+\.\S+/.test(emailInput.value)) {
            isValid = false;
            showValidationError(emailInput, 'Please enter a valid email address.');
        }

        // Message validation (required)
        if (!messageInput || !messageInput.value.trim()) {
            isValid = false;
             if(messageInput) showValidationError(messageInput, 'Message cannot be empty.');
        }

        return isValid;
    }

    function showValidationError(inputElement, message) {
        inputElement.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        // Insert after the input element (within the form-group)
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    }

    function clearValidationErrors() {
         if (!contactForm) return; // Add guard clause
        const errorInputs = contactForm.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));

        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }


    // --- 11. Notification System ---
    function showNotification(type, message, duration = 5000) {
        if (!notificationContainer) return; // Add guard clause

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');

        let iconClass = '';
        switch (type) {
            case 'success': iconClass = 'fas fa-check-circle'; break;
            case 'error': iconClass = 'fas fa-times-circle'; break;
            case 'info': iconClass = 'fas fa-info-circle'; break;
            case 'warning': iconClass = 'fas fa-exclamation-triangle'; break;
            default: iconClass = 'fas fa-bell';
        }

        notification.innerHTML = `
            <i class="notification-icon ${iconClass}"></i>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Append notification
        notificationContainer.appendChild(notification);

        // Trigger show animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-dismiss timer
        const timer = setTimeout(() => {
            closeNotification(notification);
        }, duration);

        // Close button listener
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timer); // Prevent auto-dismiss if manually closed
            closeNotification(notification);
        });
    }

    function closeNotification(notification) {
        if (!notification || !notificationContainer) return; // Guard clause

        notification.classList.remove('show');
        // Remove from DOM after transition
        notification.addEventListener('transitionend', () => {
             // Check if it's still a child before removing
            if (notification.parentNode === notificationContainer) {
                notificationContainer.removeChild(notification);
            }
        }, { once: true }); // Ensure listener is removed after firing once
    }


    // --- 12. Dynamic Copyright Year ---
    function updateCopyrightYear() {
        if (copyrightYearSpan) {
            copyrightYearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- 13. Helper Functions ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

}); // End DOMContentLoaded