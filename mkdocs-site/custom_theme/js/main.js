// custom_theme/js/main.js

// 将所有代码封装在一个名为 'initSearchWidget' 的函数中
function initSearchWidget() {
    // 找到我们在 HTML 中设置的各个元素
    const searchForm = document.getElementById('search-form');
    const switchButton = document.getElementById('search-engine-switch');
    const searchInput = document.getElementById('search-input');
    const bingIcon = document.getElementById('icon-bing');
    const googleIcon = document.getElementById('icon-google');

    // 检查是否所有需要的元素都已加载到页面上
    // 这是非常重要的一步，可以防止在其他页面上运行此脚本时报错
    if (!searchForm || !switchButton || !searchInput || !bingIcon || !googleIcon) {
        // 如果有任何一个元素找不到，就静默退出，不做任何事
        return;
    }

    // 定义两个搜索引擎的配置信息
    const engines = {
        bing: {
            action: 'https://www.bing.com/search',
            placeholder: '在必应上搜索...'
        },
        google: {
            action: 'https://www.google.com/search',
            placeholder: '在谷歌上搜索...'
        }
    };

    // 当切换按钮被点击时，执行这个函数
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

// 确保在整个页面的所有内容（包括图片、样式等）都加载完毕后，
// 再来执行我们的初始化函数。这是最稳妥的方式。
if (document.readyState === 'complete') {
    initSearchWidget();
} else {
    window.addEventListener('load', initSearchWidget);
}