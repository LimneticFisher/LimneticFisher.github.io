// custom_theme/js/main.js

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

// 2. Theme toggle (default = dark; toggle adds light-mode class)
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    const heroImage = document.getElementById('hero-image');

    if (!themeToggleButton || !sunIcon || !moonIcon) return;

    const baseUrl = (typeof base_url !== 'undefined') ? base_url : '.';

    const themeImages = {
        light: `${baseUrl}/images/light.webp`,
        dark: `${baseUrl}/images/dark.webp`
    };

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            if (heroImage) heroImage.src = themeImages.light;
        } else {
            document.documentElement.classList.remove('light-mode');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            if (heroImage) heroImage.src = themeImages.dark;
        }
    }

    // Default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const isLight = document.documentElement.classList.contains('light-mode');
        const newTheme = isLight ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// 3. Time widget
function initTimeWidget() {
    const mainEl = document.getElementById('time-main');
    const dateEl = document.getElementById('time-date');
    if (!mainEl || !dateEl) return;

    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function update() {
        const now = new Date();
        mainEl.innerHTML = pad(now.getHours()) + ':' + pad(now.getMinutes()) +
            '<span class="time-sec">' + pad(now.getSeconds()) + '</span>';
        dateEl.innerHTML = now.getFullYear() + '.' + pad(now.getMonth()+1) + '.' + pad(now.getDate()) +
            '<span class="time-weekday">' + weekdays[now.getDay()] + '</span>';
    }
    update();
    setInterval(update, 1000);
}

// 4. Celestial illustration canvas
function initCelestialCanvas() {
    const canvas = document.getElementById('celestial-canvas');
    const container = document.getElementById('hero-text');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let W, H, dpr;

    function resize() {
        const rect = container.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        W = rect.width; H = rect.height;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const Y = [245, 235, 180];
    const yStr = Y[0]+','+Y[1]+','+Y[2];

    function sRng(seed) {
        let s = seed;
        return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    }

    // Geometry
    function mainCurve(t) {
        var p0x=-W*0.10,p0y=H*0.02,p1x=W*0.28,p1y=H*-0.12,p2x=W*0.72,p2y=H*1.12,p3x=W*1.12,p3y=H*0.92;
        var u=1-t;
        return{x:u*u*u*p0x+3*u*u*t*p1x+3*u*t*t*p2x+t*t*t*p3x,y:u*u*u*p0y+3*u*u*t*p1y+3*u*t*t*p2y+t*t*t*p3y};
    }
    function tangentAngle(t){var a=mainCurve(Math.max(0,t-0.001)),b=mainCurve(Math.min(1,t+0.001));return Math.atan2(b.y-a.y,b.x-a.x);}
    function perpPoint(t,dist){var p=mainCurve(t),a=tangentAngle(t);return{x:p.x+Math.cos(a-Math.PI/2)*dist,y:p.y+Math.sin(a-Math.PI/2)*dist};}
    function samplePath(fn,n){var pts=[];for(var i=0;i<=n;i++)pts.push(fn(i/n));return pts;}
    function strokePath(pts,color,w){if(pts.length<2)return;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(var i=1;i<pts.length-1;i++){var xc=(pts[i].x+pts[i+1].x)/2,yc=(pts[i].y+pts[i+1].y)/2;ctx.quadraticCurveTo(pts[i].x,pts[i].y,xc,yc);}ctx.lineTo(pts[pts.length-1].x,pts[pts.length-1].y);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}

    // Drawing primitives
    function drawSparkle(cx,cy,size,alpha,rot){
        ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.globalAlpha=alpha;
        var L=size,S=size*0.1;
        ctx.fillStyle='rgba('+yStr+',1)';
        ctx.beginPath();ctx.moveTo(0,-L);ctx.quadraticCurveTo(S,0,0,L);ctx.quadraticCurveTo(-S,0,0,-L);ctx.fill();
        ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(0,S,L,0);ctx.quadraticCurveTo(0,-S,-L,0);ctx.fill();
        var cg=ctx.createRadialGradient(0,0,0,0,0,size*0.35);
        cg.addColorStop(0,'rgba(255,255,240,0.8)');cg.addColorStop(1,'rgba('+yStr+',0)');
        ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,0,size*0.35,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=1;ctx.restore();
    }

    function drawOrb(cx,cy,r,alpha){
        ctx.save();ctx.globalAlpha=alpha;
        var halo=ctx.createRadialGradient(cx,cy,r*0.5,cx,cy,r*2);
        halo.addColorStop(0,'rgba('+yStr+',0.06)');halo.addColorStop(1,'rgba('+yStr+',0)');
        ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fill();
        var bg=ctx.createRadialGradient(cx-r*0.25,cy-r*0.25,0,cx,cy,r);
        bg.addColorStop(0,'rgba('+yStr+',0.35)');bg.addColorStop(0.5,'rgba('+yStr+',0.18)');
        bg.addColorStop(0.85,'rgba('+yStr+',0.06)');bg.addColorStop(1,'rgba('+yStr+',0.02)');
        ctx.fillStyle=bg;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle='rgba('+yStr+','+(0.15+alpha*0.2)+')';ctx.lineWidth=0.7;ctx.stroke();
        if(r>10){ctx.beginPath();ctx.arc(cx,cy,r*0.6,0,Math.PI*2);ctx.strokeStyle='rgba('+yStr+',0.06)';ctx.lineWidth=0.4;ctx.stroke();}
        ctx.globalAlpha=1;ctx.restore();
    }

    function drawHex(cx,cy,r,alpha,rot){
        ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.globalAlpha=alpha;ctx.beginPath();
        for(var i=0;i<6;i++){var a=Math.PI/3*i-Math.PI/6;ctx[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r);}
        ctx.closePath();ctx.fillStyle='rgba('+yStr+',0.35)';ctx.fill();
        ctx.strokeStyle='rgba('+yStr+',0.2)';ctx.lineWidth=0.5;ctx.stroke();ctx.globalAlpha=1;ctx.restore();
    }

    // Pre-generate elements
    var R = sRng(777);
    var focalXr=0.22, focalYr=0.28;

    var arcs=[];for(var i=0;i<7;i++){arcs.push({radius:80+i*55+R()*30,startAngle:R()*Math.PI*0.5-0.3,span:Math.PI*(0.4+R()*0.9),width:0.4+R()*0.8,alpha:0.04+R()*0.08});}
    var rays=[];for(var i=0;i<24;i++){rays.push({angle:(i/24)*Math.PI*2+(R()-0.5)*0.1,length:60+R()*200,width:0.3+R()*0.5,alpha:0.03+R()*0.06});}
    var companions=[{dist:-90,w:0.6,a:0.05},{dist:-45,w:0.8,a:0.07},{dist:50,w:0.9,a:0.08},{dist:100,w:0.7,a:0.06},{dist:155,w:0.5,a:0.04}];
    var orbs=[];for(var i=0;i<12;i++){orbs.push({t:0.05+R()*0.9,perpDist:(R()-0.5)*160,r:8+R()*35,alpha:0.12+R()*0.25});}
    var sparkles=[];for(var i=0;i<22;i++){sparkles.push({t:R(),perpDist:(R()-0.5)*280,size:5+R()*22,alpha:0.06+R()*0.18,rot:R()*Math.PI*0.5,pulse:R()*Math.PI*2});}
    var hexes=[];for(var i=0;i<30;i++){hexes.push({t:R(),perpDist:(R()-0.5)*240,r:2+R()*5,alpha:0.05+R()*0.10,rot:R()*Math.PI});}
    var dust=[];for(var i=0;i<200;i++){dust.push({x:R(),y:R(),r:0.5+R()*2.2,alpha:0.06+R()*0.18,drift:R()*Math.PI*2,pulseSpeed:0.3+R()*0.8,pulseOffset:R()*Math.PI*2});}
    var scratches=[];for(var i=0;i<12;i++){scratches.push({x:R()*0.8+0.1,y:R()*0.8+0.1,angle:R()*Math.PI,length:30+R()*120,alpha:0.02+R()*0.04});}

    var startTime = performance.now();

    function render() {
        var time = (performance.now()-startTime)/1000;
        ctx.clearRect(0,0,W,H);
        var fx=W*focalXr, fy=H*focalYr;
        var rotSpeed = time*0.015;

        // Concentric arcs (rotating)
        ctx.save();ctx.translate(fx,fy);ctx.rotate(rotSpeed);
        for(var i=0;i<arcs.length;i++){var arc=arcs[i];ctx.beginPath();ctx.arc(0,0,arc.radius,arc.startAngle,arc.startAngle+arc.span);ctx.strokeStyle='rgba('+yStr+','+arc.alpha+')';ctx.lineWidth=arc.width;ctx.stroke();}
        ctx.restore();

        // Radiating lines (rotating)
        ctx.save();ctx.translate(fx,fy);ctx.rotate(rotSpeed);
        for(var i=0;i<rays.length;i++){var ray=rays[i];ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ray.angle)*ray.length,Math.sin(ray.angle)*ray.length);ctx.strokeStyle='rgba('+yStr+','+ray.alpha+')';ctx.lineWidth=ray.width;ctx.stroke();}
        ctx.restore();

        // Focal orb
        drawOrb(fx,fy,28,0.25);
        ctx.save();ctx.translate(fx,fy);ctx.rotate(-rotSpeed*0.6);
        ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.strokeStyle='rgba('+yStr+',0.12)';ctx.lineWidth=0.8;ctx.stroke();ctx.restore();
        ctx.save();ctx.translate(fx,fy);ctx.rotate(rotSpeed*0.4);
        ctx.beginPath();ctx.arc(0,0,40,0,Math.PI*2);ctx.strokeStyle='rgba('+yStr+',0.06)';ctx.lineWidth=0.5;ctx.stroke();ctx.restore();

        // Companion lines
        var steps=80;
        for(var i=0;i<companions.length;i++){var c=companions[i];var pts=samplePath(function(t){return perpPoint(t,c.dist);},steps);strokePath(pts,'rgba('+yStr+','+c.a+')',c.w);strokePath(pts,'rgba('+yStr+','+(c.a*0.3)+')',c.w+4);}

        // Main curve
        var mainPts=samplePath(mainCurve,steps);
        strokePath(mainPts,'rgba('+yStr+',0.025)',16);
        strokePath(mainPts,'rgba('+yStr+',0.04)',6);
        var mg=ctx.createLinearGradient(mainPts[0].x,mainPts[0].y,mainPts[mainPts.length-1].x,mainPts[mainPts.length-1].y);
        mg.addColorStop(0,'rgba('+yStr+',0)');mg.addColorStop(0.06,'rgba('+yStr+',0.12)');mg.addColorStop(0.25,'rgba('+yStr+',0.20)');
        mg.addColorStop(0.5,'rgba('+yStr+',0.25)');mg.addColorStop(0.75,'rgba('+yStr+',0.20)');mg.addColorStop(0.94,'rgba('+yStr+',0.12)');mg.addColorStop(1,'rgba('+yStr+',0)');
        ctx.beginPath();ctx.moveTo(mainPts[0].x,mainPts[0].y);
        for(var i=1;i<mainPts.length-1;i++){var xc=(mainPts[i].x+mainPts[i+1].x)/2,yc=(mainPts[i].y+mainPts[i+1].y)/2;ctx.quadraticCurveTo(mainPts[i].x,mainPts[i].y,xc,yc);}
        ctx.lineTo(mainPts[mainPts.length-1].x,mainPts[mainPts.length-1].y);ctx.strokeStyle=mg;ctx.lineWidth=1.2;ctx.lineCap='round';ctx.stroke();

        // Scratches
        for(var i=0;i<scratches.length;i++){var s=scratches[i];ctx.beginPath();var sx=s.x*W,sy=s.y*H;ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(s.angle)*s.length,sy+Math.sin(s.angle)*s.length);ctx.strokeStyle='rgba('+yStr+','+s.alpha+')';ctx.lineWidth=0.3;ctx.stroke();}

        // Orbs
        for(var i=0;i<orbs.length;i++){var o=orbs[i];var p=mainCurve(o.t);var a=tangentAngle(o.t);drawOrb(p.x+Math.cos(a-Math.PI/2)*o.perpDist,p.y+Math.sin(a-Math.PI/2)*o.perpDist,o.r,o.alpha);}

        // Sparkles (breathing)
        for(var i=0;i<sparkles.length;i++){var sp=sparkles[i];var p=mainCurve(sp.t);var a=tangentAngle(sp.t);var sx=p.x+Math.cos(a-Math.PI/2)*sp.perpDist,sy=p.y+Math.sin(a-Math.PI/2)*sp.perpDist;
            var breathe=Math.sin(time*1.2+sp.pulse);var pulse=0.3+0.7*Math.max(0,breathe);var blink=0.15+0.85*Math.pow(Math.max(0,breathe),2);
            drawSparkle(sx,sy,sp.size*pulse,sp.alpha*blink,sp.rot+time*0.04);}

        // Hexagons
        for(var i=0;i<hexes.length;i++){var h=hexes[i];var p=mainCurve(h.t);var a=tangentAngle(h.t);drawHex(p.x+Math.cos(a-Math.PI/2)*h.perpDist,p.y+Math.sin(a-Math.PI/2)*h.perpDist,h.r,h.alpha,h.rot);}

        // Dust (twinkling)
        for(var i=0;i<dust.length;i++){var d=dust[i];var dx=d.x*W+Math.sin(time*0.15+d.drift)*10,dy=d.y*H+Math.cos(time*0.12+d.drift)*8;
            var twinkle=0.4+0.6*(0.5+0.5*Math.sin(time*d.pulseSpeed+d.pulseOffset));
            ctx.globalAlpha=d.alpha*twinkle;ctx.fillStyle='rgba('+yStr+',0.9)';ctx.beginPath();ctx.arc(dx,dy,d.r*twinkle,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}

        requestAnimationFrame(render);
    }
    render();
}

// 5. Scroll-triggered entrance animations
function initScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-animate');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `blur-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    elements.forEach((el, index) => {
        observer.observe(el);
        el.style.animationDelay = `${(index % 6) * 0.06}s`;
    });
}

// 6. Init
function initAll() {
    initSearchWidget();
    initThemeToggle();
    initTimeWidget();
    initCelestialCanvas();
    initScrollAnimation();
}

if (document.readyState === 'complete') {
    initAll();
} else {
    window.addEventListener('load', initAll);
}
