/* ═══════════════════════════════════════════════════════════
   SWEET HOMES — Luxury Interior Design
   luxury-code.js
═══════════════════════════════════════════════════════════ */

'use strict';

// ── NAVBAR: scroll state ──────────────────────────────────
const navbar = document.getElementById('navbar');

function updateNavbar() {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ── NAVBAR: active link highlight ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── MOBILE MENU ───────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

function closeMobile() {
    mobileMenu.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
}
window.closeMobile = closeMobile;

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobile();
    }
});

// ── SCROLL TO TOP BUTTON ──────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, { passive: true });

// ── SCROLL REVEAL ─────────────────────────────────────────
function initReveal() {
    const revealTargets = document.querySelectorAll(
        '.about-text, .about-images, .service-card, .masonry-item, ' +
        '.testimonial-card, .contact-info, .contact-form-wrap, ' +
        '.section-header, .stat, .filter-tabs'
    );

    revealTargets.forEach((el, i) => {
        el.classList.add('reveal');
        // Stagger service cards and masonry items
        const parent = el.parentElement;
        if (parent) {
            const siblings = [...parent.children].filter(c => c.classList.contains(el.classList[0]));
            const idx = siblings.indexOf(el);
            if (idx > 0 && idx < 4) {
                el.classList.add(`reveal-delay-${idx}`);
            }
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
initReveal();

// ── PROJECT FILTER (Masonry) ──────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const masonryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        masonryItems.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                // Re-trigger fade in
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                });
            } else {
                item.classList.add('hidden');
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            }
        });
    });
});

// (Form submit handler removed. Form submits natively so user can hook up backend action directly)

// ── SMOOTH SCROLL for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    });
});

// ── GALLERY STRIP: pause on reduced motion ───────────────


// ── TESTIMONIALS SLIDER ────────────────────────────────────
const testiSlider = document.getElementById('testiSlider');
if (testiSlider) {
    const slides = testiSlider.querySelectorAll('.testi-slide');
    const dots = testiSlider.querySelectorAll('.testi-dot');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startAutoSlide();
        });
    });

    // Start auto slide
    startAutoSlide();

    // Pause auto slide on hover
    testiSlider.addEventListener('mouseenter', stopAutoSlide);
    testiSlider.addEventListener('mouseleave', startAutoSlide);
}
