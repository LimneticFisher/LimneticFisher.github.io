// custom_theme/js/main.js

// 1. 初始化搜索引擎切换功能
function initSearchWidget() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    const switchButton = document.getElementById('search-engine-switch');
    const searchInput = document.getElementById('search-input');
    const bingIcon = document.getElementById('icon-bing');
    const googleIcon = document.getElementById('icon-google');

    if (!switchButton || !searchInput || !bingIcon || !googleIcon) return;

    const engines = {
        bing: { action: 'https://www.bing.com/search', placeholder: '在必应上搜索...' },
        google: { action: 'https://www.google.com/search', placeholder: '在谷歌上搜索...' }
    };

    switchButton.addEventListener('click', () => {
        const currentEngine = searchForm.dataset.engine;
        const nextEngine = currentEngine === 'bing' ? 'google' : 'bing';
        searchForm.action = engines[nextEngine].action;
        searchInput.placeholder = engines[nextEngine].placeholder;
        searchForm.dataset.engine = nextEngine;
        bingIcon.classList.toggle('hidden');
        googleIcon.classList.toggle('hidden');
    });
}

// 2. 初始化主题切换功能
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    const heroImage = document.getElementById('hero-image'); // 获取首页大图
    
    if (!themeToggleButton || !sunIcon || !moonIcon) return;

    // 【关键修改】获取 HTML 中定义的 base_url，如果没定义则默认为当前目录
    // 这样在 resources 子页面也能找到图片
    const baseUrl = (typeof base_url !== 'undefined') ? base_url : '.';
    
    const themeImages = {
        light: `${baseUrl}/images/light.webp`,
        dark: `${baseUrl}/images/dark.webp`
    };

    // 函数：根据当前主题模式更新UI
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            if (heroImage) heroImage.src = themeImages.dark;
        } else {
            document.documentElement.classList.remove('dark-mode');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            if (heroImage) heroImage.src = themeImages.light;
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// 3. 【新增】瀑布流动画 (用于资源页卡片浮现)
function initScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-animate');
    if (elements.length === 0) return; // 如果页面没这元素就不跑

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 只有定义了 @keyframes blur-in-up (在CSS里) 才会动
                entry.target.style.animation = `blur-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach((el, index) => {
        observer.observe(el);
        el.style.animationDelay = `${(index % 5) * 0.05}s`; 
    });
}

// 4. 执行初始化
if (document.readyState === 'complete') {
    initSearchWidget();
    initThemeToggle();
    initScrollAnimation();
} else {
    window.addEventListener('load', () => {
        initSearchWidget();
        initThemeToggle();
        initScrollAnimation();
    });
}