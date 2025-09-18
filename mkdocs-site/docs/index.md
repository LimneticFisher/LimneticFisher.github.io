
<div class="hero-section">
    <!-- 左侧图片列 -->
    <div class="hero-image-column">
        <div class="image-zoom-container">
            <!-- 请将下面的 src 替换为你自己的图片链接 -->
            <img src="images/09金陵各營屢捷解圍圖.png" alt="个人主页图片">
        </div>
    </div>

    <!-- 右侧文本和搜索框列 -->
<div class="hero-text-column">
    <!-- 在这里修改你的格言或标题 -->
    <h1>为喜玉川子<br>书船归洛浦</h1>
    <p class="hero-subtitle">历史，你好！</p>
    
    <!-- 新的搜索框容器 -->
    <div class="search-container">
        <!-- 
            - id="search-form"       -> JS用来找到整个表单
            - data-engine="bing"     -> 用来存储当前搜索引擎的状态
        -->
        <form id="search-form" class="bing-search-form" 
              action="https://www.bing.com/search" 
              method="get" target="_blank" data-engine="bing">

            <!-- 切换引擎的按钮 -->
            <button type="button" id="search-engine-switch" title="切换搜索引擎">
                <!-- ⬇️ 新的必应图标 (来自 Iconify) ⬇️ -->
                <!-- 确保 id="icon-bing" 和 class="search-engine-icon" 还在 -->
                <svg class="search-engine-icon" id="icon-bing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="m10.833 3.065l4.333 2.253v13.5l-4.333 2.182l-5.62-3.248V6.29L10.833 3.065ZM6.21 6.556l4.623-2.67v13.5l-4.623-2.348V6.556Z"/></svg>

                <!-- ⬇️ 新的谷歌图标 (来自 Iconify) ⬇️ -->
                <!-- 确保 id="icon-google" 和 class="search-engine-icon hidden" 还在 -->
                <svg class="search-engine-icon hidden" id="icon-google" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M21.35 11.1h-9.35v2.9h5.65q-.5 2.1-2.2 3.25t-4.1.25q-3.4 0-5.8-2.35t-2.4-5.65q0-3.3 2.4-5.65t5.8-2.35q1.7 0 3.25.75t2.55 2l2.2-2.2q-2.1-2-5.2-2q-4.4 0-7.5 3.15T3 12.05q0 4.4 3.15 7.55t7.55 3.15q4.1 0 6.8-2.8t2.7-6.8q0-.6-.05-1.1Z"/></svg>
            </button>

            <!-- 
                - id="search-input"      -> JS用来找到输入框
            -->
            <input id="search-input" type="text" name="q" placeholder="在必应上搜索...">
            <button type="submit" aria-label="搜索">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </button>
        </form>
    </div>
</div>
</div>

