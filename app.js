// Consolidated app.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const portfolioFilters = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const navLinks = document.querySelectorAll('.nav-link');

    // Gallery Elements
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImage = document.getElementById('gallery-image');
    const galleryCurrent = document.getElementById('gallery-current');
    const galleryTotal = document.getElementById('gallery-total');
    const galleryClose = document.querySelector('.gallery-close');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');

    let currentGallery = [];
    let currentIndex = 0;

    // --- Core Functions ---

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Header & Navigation ---

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + (header ? header.offsetHeight : 80) + 100;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (nav && mobileMenuToggle && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // --- Scroll Effects ---

    window.addEventListener('scroll', debounce(() => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        
        if (backToTopBtn) {
            if (currentScrollY > 500) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        }
        
        updateActiveNavLink();
        handleScrollAnimations();
    }, 16));

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Portfolio Filtering ---

    if (portfolioFilters.length > 0 && portfolioItems.length > 0) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                e.preventDefault();
                const filterValue = filter.getAttribute('data-filter');
                
                portfolioFilters.forEach(btn => btn.classList.remove('active'));
                filter.classList.add('active');
                
                portfolioItems.forEach((item) => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // --- Gallery System ---

    function updateGalleryImage() {
        if (currentGallery.length > 0) {
            galleryImage.src = currentGallery[currentIndex];
            galleryCurrent.textContent = currentIndex + 1;
            galleryTotal.textContent = currentGallery.length;
        }
    }

    function openGallery(images) {
        currentGallery = images.split(',');
        currentIndex = 0;
        updateGalleryImage();
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateGalleryImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateGalleryImage();
    }

    portfolioItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent gallery if clicking a link inside info
            if (e.target.closest('.service-link')) return;
            
            const images = item.getAttribute('data-gallery');
            if (images) openGallery(images);
        });
    });

    galleryClose?.addEventListener('click', closeGallery);
    galleryNext?.addEventListener('click', nextImage);
    galleryPrev?.addEventListener('click', prevImage);
    
    galleryModal?.addEventListener('click', (e) => {
        if (e.target === galleryModal) closeGallery();
    });

    document.addEventListener('keydown', (e) => {
        if (!galleryModal?.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // --- Animations & Other ---

    function handleScrollAnimations() {
        const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        const windowHeight = window.innerHeight;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }

    function initAnimations() {
        const elementsToAnimate = ['.service-card', '.portfolio-item', '.feature-card', '.stat', '.about-text', '.contact-form', '.contact-info'];
        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('animate-on-scroll');
                el.style.transitionDelay = `${(i % 3) * 0.1}s`;
            });
        });
        handleScrollAnimations();
    }

    function initFormEnhancements() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.parentElement?.classList.add('focused'));
            input.addEventListener('blur', () => {
                if (!input.value.trim()) input.parentElement?.classList.remove('focused');
            });
        });
    }

    // --- Initialization ---

    initAnimations();
    initFormEnhancements();
    updateActiveNavLink();
    
    // Add loaded class
    document.body.classList.add('loaded');
});
