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
    let d = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
    lastX = x; lastY = y;
    momentum += d * 0.8;
    if(momentum > 180) momentum = 180;
}

window.onmousemove = (e) => handleInput(e.clientX, e.clientY);
window.ontouchmove = (e) => {
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
};

setInterval(() => {
    if(!active) return;

    rpm = (rpm * 0.7) + (momentum * 0.3);
    momentum *= 0.85;

    let gSpeed = 0.15 + (taso * 0.16);
    if (rpm > 20) {
        if (rpm > 60 && rpm < 130) gSpeed *= 0.25; 
        grandma += gSpeed;
    } else {
        grandma -= (0.10 + (taso * 0.05)); 
    }
    grandma = Math.max(0, grandma);

    document.getElementById('door').style.transform = `rotateY(-${Math.min(110, (grandma/100)*110)}deg)`;
    if(grandma > 40) document.getElementById('grandma').style.filter = `brightness(${grandma/100})`;

    if(grandma >= 100) {
        active = false;
        document.getElementById('fail-screen').style.display = 'flex';
        createDrips();
    }

    if(rpm > 70 && rpm < 140) charge += 1.2;
    else if(rpm >= 140) charge += 0.4;
    else if(rpm > 10) charge += 0.1;

    let cooldown = (rpm < 10) ? 0.35 : 0.15;
    charge = Math.min(100, Math.max(0, charge - cooldown));
    
    document.getElementById('c-val').innerText = Math.floor(charge);
    document.getElementById('needle').style.transform = `rotate(${-90 + rpm}deg)`;

    let shaft = document.getElementById('shaft');
    let n = Math.floor(charge / 8);
    while(shaft.children.length < n) { let b = document.createElement('div'); b.className = 'block'; shaft.appendChild(b); }
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
                const p = document.createElement('div');
                p.className = 'sperma';
                p.style.left = startX + 'px';
                p.style.top = startY + 'px';
                const size = Math.random() * 8 + 4;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                document.body.appendChild(p);

                let vx = (Math.random() - 0.5) * 25; 
                let vy = -Math.random() * 35 - 15;
                let opacity = 1;
                let posX = startX;
                let posY = startY;

                const anim = setInterval(() => {
                    vy += 1.8;
                    posX += vx;
                    posY += vy;
                    opacity -= 0.02;
                    p.style.transform = `translate(${posX - startX}px, ${posY - startY}px)`;
                    p.style.opacity = opacity;
                    if (opacity <= 0) {
                        clearInterval(anim);
                        p.remove();
                    }
                }, 25);
            }
        }, wave * 250);
    }
    setTimeout(() => { location.reload(); }, 6000);
}

function createDrips() {
    const target = document.getElementById('drip-target');
    for(let i=0; i<20; i++) {
        setTimeout(() => {
            let d = document.createElement('div');
            d.className = 'drip';
            d.style.left = (Math.random() * 80 + 10) + "%";
            d.style.width = (Math.random() * 10 + 5) + "px";
            target.appendChild(d);
        }, i * 150);
    }
}