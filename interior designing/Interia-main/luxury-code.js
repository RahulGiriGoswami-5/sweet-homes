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

document.addEventListener("DOMContentLoaded", () => {

    const cards = [...document.querySelectorAll(".stack-card")];
    const totalCards = cards.length;

    cards.forEach((card, i) => {
        card.style.zIndex = i + 1;
    });

    const currentScale = cards.map(() => 1);
    const targetScale = cards.map(() => 1);

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function tick() {
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const stickyTop = 100;

            let progress = (stickyTop - rect.top) / stickyTop;
            progress = Math.max(0, Math.min(progress, 1));

            const depthFactor = (totalCards - i - 1) / totalCards;
            targetScale[i] = 1 - progress * 0.055 * depthFactor;

            currentScale[i] = lerp(currentScale[i], targetScale[i], 0.08);

            card.style.transform = `scale(${currentScale[i]})`;
        });

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

});
// ── PRELOADER ──────────────────────────────────────────────
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const strip = preloader.querySelector('.preloader-strip');
    const logo = document.getElementById('preloaderLogo');
    const realLogoWrap = document.querySelector('.nav-logo');

    document.body.classList.add('preloading');

    // Step 1 (0 - 1.8s): images scroll. Then fade strip out, fade logo in.
    setTimeout(() => {
        strip.classList.add('fade-out');
        logo.classList.add('show');
    }, 1800);

    // Step 2: logo holds centered for 2s (fade takes .6s), then flies to nav logo
    setTimeout(() => {
        const target = realLogoWrap.getBoundingClientRect();
        const current = logo.getBoundingClientRect();

        const scale = target.width / current.width;
        const tx = target.left + target.width / 2 - window.innerWidth / 2;
        const ty = target.top + target.height / 2 - window.innerHeight / 2;

        logo.style.setProperty('--tx', `calc(-50% + ${tx}px)`);
        logo.style.setProperty('--ty', `calc(-50% + ${ty}px)`);
        logo.style.setProperty('--ts', scale);
        logo.classList.add('move-to-nav');
    }, 3400);

    setTimeout(() => {
        preloader.classList.add('hide');
        document.body.classList.remove('preloading');
        setTimeout(() => preloader.remove(), 600);
    }, 4500);
})();