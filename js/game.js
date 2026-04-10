let charge = 0, rpm = 0, momentum = 0, grandma = 0, active = false, taso = 5;
let lastX = 0, lastY = 0;
const uhat = [
    {e: '👵', t: 'MUMMO NÄKI KAIKEN!'},
    {e: '👹', t: 'PAHOLAISEN KATSE!'},
    {e: '🤡', t: 'PELLE NAURAA SULLE!'},
    {e: '💀', t: 'KUOLEMA KORJASI POTIN!'},
    {e: '👾', t: 'AVARUUSOLIO TUTKI KEPPISI!'}
];
const grid = document.getElementById('l-grid');
for(let i=1; i<=10; i++) {
    let b = document.createElement('button'); b.className = 'level-btn'; b.innerText = i;
    b.onclick = () => startGame(i);
    grid.appendChild(b);
}
const kikkeli = document.getElementById('kikkeli-wrap');
function toggleInfo(show) { document.getElementById('info-modal').style.display = show ? 'flex' : 'none'; }
function startGame(valittuTaso) {
    taso = valittuTaso;
    let u = uhat[Math.floor(Math.random() * uhat.length)];
    document.getElementById('grandma').innerText = u.e;
    document.getElementById('fail-msg').innerText = u.t;
    document.getElementById('menu-layer').style.display = 'none';
    active = true;
}
function handleInput(x, y) {
    if(!active) return;
    if(lastX === 0 && lastY === 0) { lastX = x; lastY = y; return; }
    let d = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
    if(d > 100) d = 0;
    lastX = x; lastY = y;
    momentum += d * 0.8;
    if(momentum > 180) momentum = 180;
}
kikkeli.addEventListener('mousemove', (e) => handleInput(e.clientX, e.clientY));
kikkeli.addEventListener('touchmove', (e) => {
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
}, { passive: false });
const resetCoord = () => { lastX = 0; lastY = 0; };
kikkeli.addEventListener('mouseleave', resetCoord);
kikkeli.addEventListener('touchend', resetCoord);
setInterval(() => {
    if(!active) return;
    rpm = (rpm * 0.7) + (momentum * 0.3);
    momentum *= 0.85;
    let gSpeed = 0.15 + (taso * 0.16);
    if (rpm > 140) {
        grandma += gSpeed * 2.5; 
    } else if (rpm > 20) {
        if (rpm >= 80 && rpm <= 120) gSpeed *= 0.3; 
        grandma += gSpeed;
    } else {
        grandma -= (0.10 + (taso * 0.05)); 
    }
    grandma = Math.max(0, grandma);
    document.getElementById('door').style.transform = `rotateY(-${Math.min(110, (grandma/100)*110)}deg)`;
    const warning = document.getElementById('warning-text');
    if (grandma > 20 && grandma < 100) {
        warning.style.opacity = "1";
        warning.classList.add('blink');
    } else {
        warning.style.opacity = "0";
        warning.classList.remove('blink');
    }
    if(grandma > 40) document.getElementById('grandma').style.filter = `brightness(${grandma/100})`;
    if(grandma >= 100) {
        active = false;
        document.getElementById('fail-screen').style.display = 'flex';
        createDrips();
    }
    if (rpm >= 80 && rpm <= 120) charge += 1.5;
    else if (rpm > 120 && rpm <= 140) charge += 0.5;
    else if (rpm > 140) charge += 0.1;
    else if (rpm > 10) charge += 0.2;
    charge = Math.min(100, Math.max(0, charge - (rpm < 10 ? 0.35 : 0.15)));
    document.getElementById('c-val').innerText = Math.floor(charge);
    const needle = document.getElementById('needle');
    needle.style.transform = `rotate(${-90 + rpm}deg)`;
    if (rpm >= 80 && rpm <= 120) {
        needle.style.background = "#0f0";
        needle.style.boxShadow = "0 0 15px #0f0";
    } else if (rpm > 140) {
        needle.style.background = "#f00";
        needle.style.boxShadow = "0 0 20px #f00";
        needle.style.marginLeft = (Math.random() * 4 - 2) + "px";
    } else {
        needle.style.background = "#ffae00";
        needle.style.boxShadow = "none";
        needle.style.marginLeft = "0";
    }
    let shaft = document.getElementById('shaft');
    let n = Math.floor(charge / 8);
    while(shaft.children.length < n) { shaft.appendChild(Object.assign(document.createElement('div'), {className:'block'})); }
    while(shaft.children.length > n) { shaft.removeChild(shaft.lastChild); }
    let s = Math.sin(Date.now()/90) * (rpm/12);
    document.getElementById('b1').style.transform = `translateY(${s}px)`;
    document.getElementById('b2').style.transform = `translateY(${-s}px)`;
    if(charge >= 100) triggerWin();
}, 50);
function triggerWin() {
    active = false;
    document.getElementById('win-screen').style.display = 'flex';
    const glans = document.getElementById('glans');
    const rect = glans.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;
    for (let wave = 0; wave < 10; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                const p = document.body.appendChild(Object.assign(document.createElement('div'), {className:'sperma'}));
                p.style.left = startX + 'px'; p.style.top = startY + 'px';
                const size = Math.random() * 8 + 4;
                p.style.width = size + 'px'; p.style.height = size + 'px';
                let vx = (Math.random() - 0.5) * 25, vy = -Math.random() * 35 - 15, op = 1, px = startX, py = startY;
                const anim = setInterval(() => {
                    vy += 1.8; px += vx; py += vy; op -= 0.02;
                    p.style.transform = `translate(${px - startX}px, ${py - startY}px)`;
                    p.style.opacity = op;
                    if (op <= 0) { clearInterval(anim); p.remove(); }
                }, 25);
            }
        }, wave * 250);
    }
    setTimeout(() => { location.reload(); }, 6000);
}
function createDrips() {
    for(let i=0; i<20; i++) {
        setTimeout(() => {
            const d = document.getElementById('drip-target').appendChild(Object.assign(document.createElement('div'), {className:'drip'}));
            d.style.left = (Math.random() * 80 + 10) + "%";
            d.style.width = (Math.random() * 10 + 5) + "px";
        }, i * 150);
    }
}