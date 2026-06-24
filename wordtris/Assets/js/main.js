document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    let currentIndex = 0;
    const totalItems = carouselItems ? carouselItems.length : 0;
    
    // Initialize carousel if it exists
    if (carousel) {
        updateCarousel();
        
        // Event listeners for carousel buttons
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            });
        }
        
        // Auto-advance carousel every 5 seconds
        let carouselInterval = setInterval(function() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, 5000);
        
        // Pause auto-advance when hovering over carousel
        carousel.addEventListener('mouseenter', function() {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', function() {
            carouselInterval = setInterval(function() {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            }, 5000);
        });
    }
    
    // Function to update carousel position
    function updateCarousel() {
        const newTransformValue = -currentIndex * 100 + '%';
        carousel.style.transform = 'translateX(' + newTransformValue + ')';
    }
    
    // Screenshots slider functionality
    const screenshotsSlider = document.querySelector('.screenshots-slider');
    const sliderPrevButton = document.querySelector('.slider-prev');
    const sliderNextButton = document.querySelector('.slider-next');
    
    if (screenshotsSlider) {
        const screenshotItems = document.querySelectorAll('.screenshot-item');
        const slideWidth = screenshotItems[0].offsetWidth + 20; // Width + gap
        
        // Initialize current slide index
        let sliderCurrentIndex = 0;
        const totalSlides = screenshotItems.length;
        
        // Function to scroll to a specific slide with infinite looping
        function scrollToSlide(index) {
            // Make the carousel infinite by wrapping around
            if (index < 0) {
                index = totalSlides - 1; // Loop to the last slide
            } else if (index >= totalSlides) {
                index = 0; // Loop back to the first slide
            }
            
            sliderCurrentIndex = index;
            screenshotsSlider.scrollTo({
                left: index * slideWidth,
                behavior: 'smooth'
            });
        }
        
        // Event listeners for navigation buttons
        if (sliderPrevButton && sliderNextButton) {
            sliderPrevButton.addEventListener('click', function() {
                scrollToSlide(sliderCurrentIndex - 1);
            });
            
            sliderNextButton.addEventListener('click', function() {
                scrollToSlide(sliderCurrentIndex + 1);
            });
        }
        
        // Handle touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        screenshotsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        screenshotsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Swipe left - go to next slide
                scrollToSlide(sliderCurrentIndex + 1);
            } else if (touchEndX > touchStartX) {
                // Swipe right - go to previous slide
                scrollToSlide(sliderCurrentIndex - 1);
            }
        }
        
        // Initialize the slider - center the view
        if (totalSlides > 3) {
            // Start at the second slide to show slides 1-3 in view
            scrollToSlide(1);
        }
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Store popup functionality
    const storePopupTriggers = document.querySelectorAll('.store-popup-trigger');
    const popupOverlay = document.getElementById('storePopup');
    const popupClose = document.querySelector('.popup-close');
    
    // Show popup when store buttons are clicked
    if (storePopupTriggers.length > 0 && popupOverlay) {
        storePopupTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                popupOverlay.classList.add('active');
            });
        });
    }
    
    // Close popup when close button is clicked
    if (popupClose && popupOverlay) {
        popupClose.addEventListener('click', function() {
            popupOverlay.classList.remove('active');
        });
    }
    
    // Close popup when clicking outside the popup container
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });
    }
    
    // Mobile navigation toggle (for future implementation)
    // This is a placeholder for when a mobile menu button is added
    /*
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    */
});