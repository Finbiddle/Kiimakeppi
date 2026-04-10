function initKeppi() {
    const area = document.getElementById('render-area');
    area.innerHTML = `
        <div class="k-wrap">
            <div class="k-glans" id="glans"></div>
            <div id="shaft" style="display:flex; flex-direction:column-reverse;"></div>
            <div class="k-ball-row">
                <div class="k-ball" id="b1"></div>
                <div class="k-ball" id="b2"></div>
            </div>
        </div>`;
}

function updateKeppi(c, r) {
    const s = document.getElementById('shaft');
    if(!s) return;
    const n = Math.floor(c / 8);
    while(s.children.length < n) {
        let b = document.createElement('div');
        b.className = 'k-block';
        s.appendChild(b);
    }
    while(s.children.length > n) s.removeChild(s.lastChild);
    
    const v = Math.sin(Date.now()/90) * (r/12);
    const b1 = document.getElementById('b1');
    const b2 = document.getElementById('b2');
    if(b1) b1.style.transform = `translateY(${v}px)`;
    if(b2) b2.style.transform = `translateY(${-v}px)`;
}

function winKeppi() {
    active = false;
    document.getElementById('win-screen').style.display = 'flex';
    const glans = document.getElementById('glans');
    const rect = glans.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    for (let wave = 0; wave < 10; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('div');
                p.className = 'sperma';
                p.style.left = startX + 'px';
                p.style.top = startY + 'px';
                const size = Math.random() * 8 + 4;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.position = 'fixed';
                p.style.zIndex = '10000';
                document.body.appendChild(p);

                let vx = (Math.random() - 0.5) * 25; 
                let vy = -Math.random() * 35 - 15;
                let opacity = 1;
                let posX = startX, posY = startY;

                const anim = setInterval(() => {
                    vy += 1.8; posX += vx; posY += vy; opacity -= 0.02;
                    p.style.transform = `translate(${posX - startX}px, ${posY - startY}px)`;
                    p.style.opacity = opacity;
                    if (opacity <= 0 || posY > window.innerHeight) { 
                        clearInterval(anim); 
                        p.remove(); 
                    }
                }, 25);
            }
        }, wave * 250);
    }
    setTimeout(() => { location.reload(); }, 6000);
}