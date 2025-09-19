// 函数：初始化搜索引擎切换功能
function initSearchWidget() {
    const searchForm = document.getElementById('search-form');
    // ... (这部分代码保持和之前一样)
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

// ⬇️⬇️ 新增函数：初始化主题切换功能 ⬇️⬇️
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    
    if (!themeToggleButton || !sunIcon || !moonIcon) return;

    // 函数：根据当前主题模式更新UI
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark-mode');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    // 页面加载时，检查 localStorage 中是否已存有主题偏好
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // 当按钮被点击时
    themeToggleButton.addEventListener('click', () => {
        // 检查当前是否为暗黑模式
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';

        // 应用新主题并保存到 localStorage
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}


// 确保在整个页面的所有内容都加载完毕后，再来执行我们的初始化函数
if (document.readyState === 'complete') {
    initSearchWidget();
    initThemeToggle(); // 运行新的主题切换函数
} else {
    window.addEventListener('load', () => {
        initSearchWidget();
        initThemeToggle(); // 运行新的主题切换函数
    });
}