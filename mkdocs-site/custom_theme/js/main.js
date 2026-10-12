// custom_theme/js/main.js

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Search engine toggle
function initSearchWidget() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    const switchButton = document.getElementById('search-engine-switch');
    const searchInput = document.getElementById('search-input');
    const bingIcon = document.getElementById('icon-bing');
    const googleIcon = document.getElementById('icon-google');

    if (!switchButton || !searchInput || !bingIcon || !googleIcon) return;

    const engines = {
        bing: { action: 'https://www.bing.com/search', placeholder: '在必应上搜索' },
        google: { action: 'https://www.google.com/search', placeholder: '在谷歌上搜索' }
    };

    switchButton.addEventListener('click', () => {
        const nextEngine = searchForm.dataset.engine === 'bing' ? 'google' : 'bing';
        searchForm.action = engines[nextEngine].action;
        searchInput.placeholder = engines[nextEngine].placeholder;
        searchForm.dataset.engine = nextEngine;
        bingIcon.classList.toggle('hidden');
        googleIcon.classList.toggle('hidden');
        searchInput.focus();
    });
}

// 2. Theme toggle (default = dark; the class is applied early in <head> to avoid a flash)
function initThemeToggle() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    button.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
    });
}

// 3. Time widget
function initTimeWidget() {
    const mainEl = document.getElementById('time-main');
    const dateEl = document.getElementById('time-date');
    if (!mainEl || !dateEl) return;

    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const pad = (n) => String(n).padStart(2, '0');

    function update() {
        const now = new Date();
        mainEl.innerHTML = pad(now.getHours()) + ':' + pad(now.getMinutes()) +
            '<span class="time-sec">' + pad(now.getSeconds()) + '</span>';
        dateEl.innerHTML = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日' +
            '<span class="time-weekday">' + weekdays[now.getDay()] + '</span>';
    }
    update();
    setInterval(update, 1000);
}

// 4. Nav hairline once the page scrolls
function initHeaderState() {
    const header = document.querySelector('.header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

// 5. Homepage scroll choreography: hero recedes, painting grows to full-bleed
function initHomeScroll() {
    const showcase = document.querySelector('.showcase');
    const frame = document.querySelector('.showcase-frame');
    const heroCopy = document.querySelector('.hero-copy');
    if (!showcase || !frame) return;

    if (prefersReducedMotion) {
        showcase.style.setProperty('--p', 1);
        return;
    }

    const clamp = (v) => Math.min(1, Math.max(0, v));
    const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function update() {
        const vh = window.innerHeight;
        const rect = frame.getBoundingClientRect();
        // 0 when the frame's top enters the bottom of the viewport, 1 when it reaches the nav
        const p = easeInOut(clamp((vh - rect.top) / (vh * 0.85)));
        showcase.style.setProperty('--p', p.toFixed(4));

        if (heroCopy) {
            const y = window.scrollY;
            const fade = clamp(y / (vh * 0.6));
            heroCopy.style.opacity = String(1 - fade);
            heroCopy.style.transform = 'translate3d(0,' + (y * 0.25).toFixed(1) + 'px,0) scale(' + (1 - fade * 0.04).toFixed(4) + ')';
        }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

// 6. Hero paintings: load the current theme's image first, the other once the page is idle
function initHeroImages() {
    const images = document.querySelectorAll('.hero-img[data-src]');
    if (images.length === 0) return;

    const load = (img) => {
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    };
    const isLight = document.documentElement.classList.contains('light-mode');
    const active = document.querySelector(isLight ? '.hero-img-light' : '.hero-img-dark');
    if (active) load(active);

    const loadRest = () => images.forEach(load);
    if ('requestIdleCallback' in window) {
        window.addEventListener('load', () => requestIdleCallback(loadRest, { timeout: 3000 }));
    } else {
        window.addEventListener('load', () => setTimeout(loadRest, 1200));
    }
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.addEventListener('click', loadRest, { once: true });
}

// 7. Scroll-triggered reveal, staggered per row
function initScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-animate');
    if (elements.length === 0) return;

    const reveal = (el) => el.classList.add('is-visible');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        elements.forEach(reveal);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        visible.forEach((entry, i) => {
            entry.target.style.transitionDelay = (i * 0.08) + 's';
            reveal(entry.target);
            observer.unobserve(entry.target);
            entry.target.addEventListener('transitionend', () => {
                entry.target.style.transitionDelay = '';
            }, { once: true });
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    // Reveal what is already on screen without waiting for the observer's first callback
    let stagger = 0;
    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
            el.style.transitionDelay = (stagger++ * 0.08) + 's';
            reveal(el);
            el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
        } else {
            observer.observe(el);
        }
    });
}

function initAll() {
    initSearchWidget();
    initThemeToggle();
    initTimeWidget();
    initHeaderState();
    initHeroImages();
    initHomeScroll();
    initScrollAnimation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
