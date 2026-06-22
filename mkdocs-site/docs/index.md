<div class="hero-section">
    <div class="hero-image-column">
        <div class="image-zoom-container">
            <img id="hero-image" src="images/dark.webp" alt="个人主页图片">
        </div>
    </div>

    <div class="hero-text-column" id="hero-text">
        <div class="noise-layer"></div>
        <div class="glow-orb glow-orb-1"></div>
        <div class="glow-orb glow-orb-2"></div>
        <canvas id="celestial-canvas"></canvas>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>

        <div class="hero-inner-content">
            <div class="time-widget">
                <div class="time-main" id="time-main">00:00<span class="time-sec" id="time-sec">00</span></div>
                <div class="time-date" id="time-date">2025.01.01<span class="time-weekday" id="time-weekday">星期三</span></div>
            </div>

            <h1>落日熔金<br>暮云合璧<br>人在何处</h1>
            <p class="hero-subtitle">历史，你好！</p>

            <div class="search-container">
                <form id="search-form" class="bing-search-form"
                      action="https://www.bing.com/search"
                      method="get" target="_blank" data-engine="bing">

                    <button type="button" id="search-engine-switch" title="切换搜索引擎">
                        <svg class="search-engine-icon" id="icon-bing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m10.833 3.065l4.333 2.253v13.5l-4.333 2.182l-5.62-3.248V6.29L10.833 3.065ZM6.21 6.556l4.623-2.67v13.5l-4.623-2.348V6.556Z"/></svg>
                        <svg class="search-engine-icon hidden" id="icon-google" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.35v2.9h5.65q-.5 2.1-2.2 3.25t-4.1.25q-3.4 0-5.8-2.35t-2.4-5.65q0-3.3 2.4-5.65t5.8-2.35q1.7 0 3.25.75t2.55 2l2.2-2.2q-2.1-2-5.2-2q-4.4 0-7.5 3.15T3 12.05q0 4.4 3.15 7.55t7.55 3.15q4.1 0 6.8-2.8t2.7-6.8q0-.6-.05-1.1Z"/></svg>
                    </button>

                    <input id="search-input" type="text" name="q" placeholder="在必应上搜索..." autocomplete="off">
                    <button type="submit" aria-label="搜索">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
