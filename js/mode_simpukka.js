function initSimpukka() {
    const area = document.getElementById('render-area');
    area.innerHTML = `
        <div class="s-wrap" id="s-container">
            <div class="s-outer" id="s-main">
                <div class="s-glow" id="glow"></div>
                <div class="s-inner" id="inner"></div>
                <div class="s-clit" id="clit"></div>
            </div>
            <div id="fx-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>
        </div>`;
}

function updateSimpukka(c, r) {
    const inner = document.getElementById('inner');
    const clit = document.getElementById('clit');
    const glow = document.getElementById('glow');
    const main = document.getElementById('s-main');
    if(!inner || !clit || !glow || !main) return;
    
    const intensity = Math.min(1, r / 150);
    const progress = c / 100;

    inner.style.background = `rgb(255, ${112 - intensity * 60}, ${112 - intensity * 60})`;
    glow.style.opacity = intensity;
    
    main.style.transform = `scale(${1 + progress * 0.15})`;
    if (progress > 0.5) {
        main.classList.add('heat-wave');
    }

    const shake = (r > 120) ? (Math.random() * 6 - 3) : 0;
    clit.style.transform = `translateX(calc(-50% + ${shake}px)) scale(${1 + intensity * 0.4})`;

    if (active && r > 25 && Math.random() > 0.92) {
        createMoisture();
    }
    if (active && c > 55 && Math.random() > 0.85) {
        createSteamFX();
    }
}

function createMoisture() {
    const layer = document.getElementById('fx-layer');
    if(!layer) return;
    const d = document.createElement('div');
    d.className = 's-moisture';
    const size = Math.random() * 6 + 2;
    d.style.width = size + 'px';
    d.style.height = size + 'px';
    d.style.left = (Math.random() * 60 + 20) + "%";
    d.style.top = (Math.random() * 40 + 20) + "%";
    layer.appendChild(d);
    setTimeout(() => d.remove(), 2000);
}

function createSteamFX() {
    const layer = document.getElementById('fx-layer');
    if(!layer) return;
    const s = document.createElement('div');
    s.className = 's-steam';
    s.style.left = (Math.random() * 40 + 30) + "%";
    s.style.top = "30%";
    layer.appendChild(s);
    setTimeout(() => s.remove(), 1000);
}

function winSimpukka() {
    active = false;
    document.getElementById('win-screen').style.display = 'flex';
    for(let i=0; i<150; i++) {
        setTimeout(createMoisture, i * 20);
    }
}