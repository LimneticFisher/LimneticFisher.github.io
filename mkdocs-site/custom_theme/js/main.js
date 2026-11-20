// custom_theme/js/main.js

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Search engine toggle, persistence, shortcuts, and empty-submit guard
function initSearchWidget() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    const switchButton = document.getElementById('search-engine-switch');
    const searchInput = document.getElementById('search-input');
    const bingIcon = document.getElementById('icon-bing');
    const googleIcon = document.getElementById('icon-google');

    if (!switchButton || !searchInput || !bingIcon || !googleIcon) return;

    const engines = {
        bing: {
            action: 'https://www.bing.com/search',
            placeholder: '在必应上搜索',
            label: '当前：必应搜索，点击切换谷歌'
        },
        google: {
            action: 'https://www.google.com/search',
            placeholder: '在谷歌上搜索',
            label: '当前：谷歌搜索，点击切换必应'
        }
    };

    function applyEngine(engine) {
        const key = engines[engine] ? engine : 'bing';
        const cfg = engines[key];
        searchForm.action = cfg.action;
        searchInput.placeholder = cfg.placeholder;
        searchForm.dataset.engine = key;
        bingIcon.classList.toggle('hidden', key !== 'bing');
        googleIcon.classList.toggle('hidden', key !== 'google');
        switchButton.setAttribute('aria-label', cfg.label);
        switchButton.setAttribute('title', cfg.label);
    }

    let savedEngine = 'bing';
    try {
        const stored = localStorage.getItem('search_engine');
        if (stored && engines[stored]) savedEngine = stored;
    } catch (e) {}
    applyEngine(savedEngine);

    switchButton.addEventListener('click', () => {
        const nextEngine = searchForm.dataset.engine === 'bing' ? 'google' : 'bing';
        applyEngine(nextEngine);
        try { localStorage.setItem('search_engine', nextEngine); } catch (e) {}
        searchInput.focus();
    });

    searchForm.addEventListener('submit', (e) => {
        if (!searchInput.value.trim()) {
            e.preventDefault();
            searchForm.classList.remove('is-empty-nudge');
            void searchForm.offsetWidth;
            searchForm.classList.add('is-empty-nudge');
            setTimeout(() => searchForm.classList.remove('is-empty-nudge'), 450);
            searchInput.focus();
            return;
        }
        dismissOnboard();
    });

    const onboard = document.getElementById('search-onboard');
    const onboardDismiss = document.getElementById('onboard-dismiss');
    function dismissOnboard() {
        if (!onboard || onboard.hidden) return;
        onboard.hidden = true;
        try { localStorage.setItem('onboard_search_seen', '1'); } catch (e) {}
    }
    if (onboard) {
        let seen = false;
        try { seen = localStorage.getItem('onboard_search_seen') === '1'; } catch (e) {}
        if (!seen) onboard.hidden = false;
        if (onboardDismiss) onboardDismiss.addEventListener('click', dismissOnboard);
    }

    searchInput.focus({ preventScroll: true });

    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        const inField = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);

        if (e.key === '/' && !inField && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            searchInput.focus();
            dismissOnboard();
        } else if (e.key === 'Escape' && active === searchInput && searchInput.value) {
            searchInput.value = '';
        }
    });
}

// 2. Theme toggle with View Transitions radial reveal
function initThemeToggle() {
    const button = document.getElementById('theme-toggle');
    const showcaseBtn = document.getElementById('showcase-theme-btn');
    if (!button) return;

    function syncLabel(isLight) {
        button.setAttribute('aria-pressed', String(isLight));
        const label = isLight ? '当前：日间模式，点击切换夜间' : '当前：夜间模式，点击切换日间';
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        if (showcaseBtn) {
            showcaseBtn.textContent = isLight ? '切换夜间画卷' : '切换日间画卷';
        }
    }

    syncLabel(document.documentElement.classList.contains('light-mode'));

    function toggleTheme(event) {
        const commit = () => {
            const isLight = document.documentElement.classList.toggle('light-mode');
            syncLabel(isLight);
            try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
        };

        if (prefersReducedMotion || !document.startViewTransition) {
            commit();
            return;
        }

        const trigger = event && event.currentTarget ? event.currentTarget : button;
        const rect = trigger.getBoundingClientRect();
        const x = event && event.clientX ? event.clientX : rect.left + rect.width / 2;
        const y = event && event.clientY ? event.clientY : rect.top + rect.height / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(commit);
        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 550,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        }).catch(() => {});
    }

    button.addEventListener('click', toggleTheme);
    if (showcaseBtn) showcaseBtn.addEventListener('click', toggleTheme);
}

// 3. Time widget (with traditional Chinese shichen)
function initTimeWidget() {
    const mainEl = document.getElementById('time-main');
    const dateEl = document.getElementById('time-date');
    if (!mainEl || !dateEl) return;

    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const shichen = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    const pad = (n) => String(n).padStart(2, '0');

    function update() {
        const now = new Date();
        const h = now.getHours();
        const sc = shichen[Math.floor(((h + 1) % 24) / 2)];
        mainEl.innerHTML = pad(h) + ':' + pad(now.getMinutes()) +
            '<span class="time-sec">' + pad(now.getSeconds()) + '</span>';
        dateEl.innerHTML = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日' +
            '<span class="time-weekday">' + weekdays[now.getDay()] + '</span>' +
            '<span class="time-shichen">' + sc + '</span>';
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
// 5. Homepage anima.ai-style background choreography: pointer lerp + center zoom + tag parallax + scroll Y
function initHomeScroll() {
    const hero = document.getElementById('hero');
    const bgLayer = document.getElementById('hero-bg-layer');
    if (!hero || !bgLayer || prefersReducedMotion) return;

    const tags = Array.from(hero.querySelectorAll('.hero-tag')).map((el) => ({
        el,
        lerp: parseFloat(el.dataset.lerp || '0.035'),
        cx: 0,
        cy: 0
    }));

    let targetX = 0;
    let targetY = 0;
    let targetScale = 1.07;
    let curX = 0;
    let curY = 0;
    let curScale = 1.07;
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    function updateScroll() {
        const y = window.scrollY;
        const offset = Math.min(y * 0.18, hero.offsetHeight * 0.14);
        hero.style.setProperty('--bg-scroll-y', offset.toFixed(1) + 'px');
    }

    function tick() {
        if (document.hidden) {
            rafId = null;
            return;
        }
        curX = lerp(curX, targetX, 0.075);
        curY = lerp(curY, targetY, 0.075);
        curScale = lerp(curScale, targetScale, 0.075);

        hero.style.setProperty('--bg-x', curX.toFixed(2) + 'px');
        hero.style.setProperty('--bg-y', curY.toFixed(2) + 'px');
        hero.style.setProperty('--bg-scale', curScale.toFixed(4));

        for (let i = 0; i < tags.length; i++) {
            const t = tags[i];
            t.cx = lerp(t.cx, -targetX * 0.85, t.lerp);
            t.cy = lerp(t.cy, -targetY * 0.85, t.lerp);
            t.el.style.setProperty('--tag-x', t.cx.toFixed(2) + 'px');
            t.el.style.setProperty('--tag-y', t.cy.toFixed(2) + 'px');
        }

        const settled =
            Math.abs(curX - targetX) < 0.05 &&
            Math.abs(curY - targetY) < 0.05 &&
            Math.abs(curScale - targetScale) < 0.0005 &&
            tags.every((t) => Math.abs(t.cx + targetX * 0.85) < 0.05 && Math.abs(t.cy + targetY * 0.85) < 0.05);

        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            rafId = null;
        }
    }

    function kick() {
        if (!rafId && !document.hidden) rafId = requestAnimationFrame(tick);
    }

    hero.addEventListener('pointermove', (e) => {
        const rect = hero.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
        targetX = clamp(-nx * 24, -26, 26);
        targetY = clamp(-ny * 16, -18, 18);
        const centerProximity = clamp(1 - Math.abs(nx), 0, 1);
        targetScale = 1.07 + centerProximity * 0.045;
        kick();
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        targetScale = 1.07;
        kick();
    });

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    document.addEventListener('visibilitychange', kick);
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
    const showcaseBtn = document.getElementById('showcase-theme-btn');
    if (toggle) toggle.addEventListener('click', loadRest, { once: true });
    if (showcaseBtn) showcaseBtn.addEventListener('click', loadRest, { once: true });
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

// 8. Overdrive: Canvas 2D warm ember / ink-dust ambient particles
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    const pointer = { x: 0, y: 0, active: false };
    const COUNT = window.innerWidth < 735 ? 18 : 30;
    const particles = [];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(randomY) {
        return {
            x: Math.random() * width,
            y: randomY ? Math.random() * height : height + Math.random() * 40,
            r: 0.9 + Math.random() * 1.8,
            vx: (Math.random() - 0.5) * 0.22,
            vy: -(0.18 + Math.random() * 0.36),
            alpha: 0.16 + Math.random() * 0.34,
            phase: Math.random() * Math.PI * 2,
            ember: Math.random() > 0.68
        };
    }

    resize();
    for (let i = 0; i < COUNT; i++) particles.push(spawn(true));

    function frame(t) {
        if (document.hidden) {
            rafId = null;
            return;
        }
        ctx.clearRect(0, 0, width, height);
        const isLight = document.documentElement.classList.contains('light-mode');
        const dir = isLight ? -0.45 : 1;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx + Math.sin(t * 0.0007 + p.phase) * 0.12;
            p.y += p.vy * dir;

            if (pointer.active) {
                const dx = p.x - pointer.x;
                const dy = p.y - pointer.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0 && dist < 120) {
                    const push = (1 - dist / 120) * 0.35;
                    p.x += (dx / dist) * push;
                    p.y += (dy / dist) * push;
                }
            }

            if (p.y < -20) { p.y = height + 16; p.x = Math.random() * width; }
            else if (p.y > height + 20) { p.y = -16; p.x = Math.random() * width; }
            if (p.x < -16) p.x = width + 16;
            else if (p.x > width + 16) p.x = -16;

            const flicker = 0.72 + 0.28 * Math.sin(t * 0.002 + p.phase);
            const a = (p.alpha * flicker).toFixed(3);
            if (isLight) {
                ctx.fillStyle = p.ember ? `rgba(158, 71, 34, ${a})` : `rgba(168, 116, 42, ${a})`;
            } else {
                ctx.fillStyle = p.ember ? `rgba(196, 100, 58, ${a})` : `rgba(227, 183, 102, ${a})`;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    const heroEl = document.querySelector('.hero');
    window.addEventListener('pointermove', (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
        if (heroEl && window.scrollY < window.innerHeight) {
            const gx = 42 + (e.clientX / Math.max(1, window.innerWidth)) * 16;
            const gy = 32 + (e.clientY / Math.max(1, window.innerHeight)) * 12;
            heroEl.style.setProperty('--glow-x', gx.toFixed(1) + '%');
            heroEl.style.setProperty('--glow-y', gy.toFixed(1) + '%');
        }
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !rafId) rafId = requestAnimationFrame(frame);
    });
}

// 9. Resources page: category filter + instant keyword search + empty state
function initResourceFilter() {
    const toolbar = document.getElementById('resource-toolbar');
    if (!toolbar) return;

    const pills = toolbar.querySelectorAll('.filter-pill');
    const searchInput = document.getElementById('resource-search');
    const countEl = document.getElementById('resource-count');
    const emptyEl = document.getElementById('resource-empty');
    const resetBtn = document.getElementById('resource-reset');
    const groups = document.querySelectorAll('.resource-group');

    let activeGroup = 'all';

    function applyFilter() {
        const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        let visibleCards = 0;

        groups.forEach((group) => {
            const groupName = group.dataset.group;
            const groupMatch = activeGroup === 'all' || groupName === activeGroup;
            const cards = group.querySelectorAll('.resource-card');
            let groupVisible = 0;

            cards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                const show = groupMatch && (!q || text.includes(q));
                card.hidden = !show;
                if (show) {
                    groupVisible++;
                    visibleCards++;
                }
            });

            group.hidden = groupVisible === 0;
        });

        if (countEl) countEl.textContent = '共 ' + visibleCards + ' 项';
        if (emptyEl) emptyEl.hidden = visibleCards > 0;
    }

    pills.forEach((pill) => {
        pill.addEventListener('click', () => {
            activeGroup = pill.dataset.filter || 'all';
            pills.forEach((p) => {
                const active = p === pill;
                p.classList.toggle('is-active', active);
                p.setAttribute('aria-selected', String(active));
            });
            applyFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchInput.value) {
                searchInput.value = '';
                applyFilter();
            }
        });
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            const inField = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
            if (e.key === '/' && !inField && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeGroup = 'all';
            if (searchInput) searchInput.value = '';
            pills.forEach((p) => {
                const active = p.dataset.filter === 'all';
                p.classList.toggle('is-active', active);
                p.setAttribute('aria-selected', String(active));
            });
            applyFilter();
        });
    }

    applyFilter();
}

// 10. Card pointer-tracking spotlight (Overdrive)
function initCardSpotlight() {
    if (prefersReducedMotion) return;
    const cards = document.querySelectorAll('a.resource-card, a.tool-card, .blog-item');
    cards.forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px');
            card.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px');
        }, { passive: true });
    });
}

// 11. Blog post reading time + scroll progress fallback
function initBlogPostEnhancements() {
    const wrapper = document.querySelector('.blog-post-wrapper');
    if (!wrapper) return;

    const content = wrapper.querySelector('.blog-post-content');
    const meta = wrapper.querySelector('.blog-post-meta');
    if (content && meta) {
        const chars = content.textContent.replace(/\s+/g, '').length;
        const mins = Math.max(1, Math.round(chars / 350));
        meta.textContent = meta.textContent.trim() + ' · 约 ' + mins + ' 分钟阅读';
    }

    const topBtn = document.getElementById('back-to-top');
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    const bar = document.querySelector('.read-progress');
    if (bar && (!window.CSS || !CSS.supports('animation-timeline', 'scroll()'))) {
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            bar.style.setProperty('--scroll-p', p.toFixed(4));
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
    }
}

// 12. Magnetic pointer lean on quick-links & accordion toggle (inspired by libraries.dev)
function initMagneticAndAccordion() {
    if (!prefersReducedMotion) {
        const leanTargets = document.querySelectorAll('.quick-link');
        leanTargets.forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
                el.style.setProperty('--lean-x', dx.toFixed(1) + 'px');
                el.style.setProperty('--lean-y', dy.toFixed(1) + 'px');
            }, { passive: true });
            el.addEventListener('pointerleave', () => {
                el.style.setProperty('--lean-x', '0px');
                el.style.setProperty('--lean-y', '0px');
            });
        });
    }

    const accordions = document.querySelectorAll('.site-accordion');
    accordions.forEach((acc) => {
        const btn = acc.querySelector('.accordion-trigger');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const open = acc.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', String(open));
        });
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
    initAmbientCanvas();
    initResourceFilter();
    initCardSpotlight();
    initBlogPostEnhancements();
    initMagneticAndAccordion();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
