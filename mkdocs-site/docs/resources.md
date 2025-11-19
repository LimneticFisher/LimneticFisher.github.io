<!-- docs/resources.md -->

<!-- ⬇️⬇️⬇️ 【在这里添加方案 A 背景代码】 ⬇️⬇️⬇️ -->
<!-- 全屏背景层：固定在底部，不随滚动条移动 -->
<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;">
    <!-- opacity: 0.15 让图片非常暗，只显示纹理，不干扰文字 -->
    <!-- filter: grayscale(100%) 变成黑白，更有质感 -->
    <img src="../images/dark.webp" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.15; filter: grayscale(100%);">
</div>
<!-- ⬆️⬆️⬆️ 背景代码结束 ⬆️⬆️⬆️ -->


<!-- padding: 上 右 下 左 -->
<!-- 如果觉得现在的 80px 太靠上，可以改成 100px 或 120px -->
<div style="padding: 80px 40px 20px 40px;">
    <!-- 增加了 class="scroll-animate" 实现动画 -->
    <!-- 增加了 opacity: 0 (初始隐藏，由动画控制显示) -->
    <h1 class="scroll-animate" style="font-size: 3rem; font-family: 'Noto Serif SC', serif; margin-bottom: 10px; color: #ffffff; opacity: 0;">
        资源指北
    </h1>
</div>

<!-- 2. 资源网格容器 -->
<div class="resources-container" style="padding: 0 40px 60px 40px;">

    <!-- 第一部分：期刊数据库 -->
    <h2 class="section-title scroll-animate">一、期刊数据库</h2>
    <div class="resource-grid">
        
        <a href="http://www.ncpssd.cn/" class="resource-card scroll-animate" target="_blank">
            <div class="card-arrow">↗</div>
            <div class="card-icon-box">
                <!-- DuckDuckGo 图标源 -->
                <img src="https://icons.duckduckgo.com/ip3/www.ncpssd.cn.ico" alt="icon">
            </div>
            <div class="card-content">
                <h3>国家哲学社会科学文献中心</h3>
                <p>学术文献资源库</p>
            </div>
        </a>

        <a href="https://www.airitilibrary.com/" class="resource-card scroll-animate" target="_blank">
            <div class="card-arrow">↗</div>
            <div class="card-icon-box">
                <img src="https://www.google.com/s2/favicons?domain=www.airitilibrary.com&sz=64" alt="icon">
            </div>
            <div class="card-content">
                <h3>华艺台湾学术文献数据库</h3>
                <p>台湾学术电子期刊及学位论文</p>
            </div>
        </a>

        <a href="https://link.springer.com/" class="resource-card scroll-animate" target="_blank">
            <div class="card-arrow">↗</div>
            <div class="card-icon-box">
                <img src="https://www.google.com/s2/favicons?domain=link.springer.com&sz=64" alt="icon">
            </div>
            <div class="card-content">
                <h3>Springer Link</h3>
                <p>综合性科技与医学电子期刊</p>
            </div>
        </a>

    </div>

    <!-- 第二部分：中国古代史 -->
    <h2 class="section-title scroll-animate">二、中国古代史史料搜索</h2>
    <div class="resource-grid">
        
        <a href="https://www.nlc.cn/web/index.shtml" class="resource-card scroll-animate" target="_blank">
            <div class="card-arrow">↗</div>
            <div class="card-icon-box">
                <img src="https://www.google.com/s2/favicons?domain=www.nlc.cn&sz=64" alt="icon">
            </div>
            <div class="card-content">
                <h3>中国国家数字图书馆</h3>
                <p>国家典籍博物馆，综合性数字资源</p>
            </div>
        </a>

        <a href="https://fhac.com.cn/index.html" class="resource-card scroll-animate" target="_blank">
            <div class="card-arrow">↗</div>
            <div class="card-icon-box">
                <img src="https://www.google.com/s2/favicons?domain=fhac.com.cn&sz=64" alt="icon">
            </div>
            <div class="card-content">
                <h3>中国第一历史档案馆</h3>
                <p>明清档案查阅</p>
            </div>
        </a>

        <a href="https://ctext.org/zhs" class="resource-card scroll-animate" target="_blank">
            <div class="card-arrow">↗</div>
            <div class="card-icon-box">
                <img src="https://www.google.com/s2/favicons?domain=ctext.org&sz=64" alt="icon">
            </div>
            <div class="card-content">
                <h3>中国哲学书电子化计划</h3>
                <p>最大的中国古代典籍数字化工程</p>
            </div>
        </a>

    </div>

</div>
