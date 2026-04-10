let charge = 0, rpm = 0, momentum = 0, grandma = 0, active = false, taso = 5, gameMode = null, lastX = 0, lastY = 0;

const modes = {
    keppi: { 
        label: 'KIIMA', init: initKeppi, update: updateKeppi, win: winKeppi, 
        info: ['HINKKAA: Liikuta sormea.', 'VARO: Jos ovi aukeaa, lopeta heti.', 'VOITTO: Täytä mittari huomaamatta.'] 
    },
    simpukka: {
        label: 'KOSTEUS', init: initSimpukka, update: updateSimpukka, win: winSimpukka, 
        info: ['HINKKAA: Pidä tahti tasaisena.', 'VARO: Mummo kuulee kovan loiskinnan.', 'VOITTO: Kastele koko ruutu.']
    }
};

function selectMode(m) {
    gameMode = m;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.mode-btn[onclick="selectMode('${m}')"]`);
    if (btn) btn.classList.add('active');
    document.getElementById('level-selection').style.visibility = 'visible';
    document.getElementById('hud-label').innerText = modes[m].label;
}

const grid = document.getElementById('l-grid');
for (let i = 1; i <= 10; i++) {
    let b = document.createElement('button'); b.className = 'level-btn'; b.innerText = i;
    b.onclick = () => { if(gameMode) startGame(i); };
    grid.appendChild(b);
}

function startGame(t) {
    taso = t; charge = 0; grandma = 0; rpm = 0; momentum = 0;
    document.getElementById('render-area').innerHTML = '';
    modes[gameMode].init();
    document.getElementById('menu-layer').style.display = 'none';
    active = true;
}

function handleInput(x, y) {
    if (!active) return;
    if (lastX === 0) { lastX = x; lastY = y; return; }
    let d = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
    if (d < 100) { momentum += d * 0.8; if (momentum > 180) momentum = 180; }
    lastX = x; lastY = y;
}

document.getElementById('render-area').addEventListener('mousemove', e => handleInput(e.clientX, e.clientY));
document.getElementById('render-area').addEventListener('touchmove', e => { 
    handleInput(e.touches[0].clientX, e.touches[0].clientY); 
    e.preventDefault(); 
}, { passive: false });

setInterval(() => {
    if (!active) return;
    
    rpm = (rpm * 0.7) + (momentum * 0.3);
    momentum *= 0.85;

    let gSpeed = 0.15 + (taso * 0.2);
    if (rpm > 140) {
        grandma += gSpeed * 2.5;
    } else if (rpm > 20) {
        let multiplier = (rpm >= 80 && rpm <= 120) ? 0.2 : 1.0;
        grandma += gSpeed * multiplier;
    } else {
        grandma -= 0.2;
    }
    
    grandma = Math.max(0, grandma);

    const doorAngle = Math.min(110, (grandma / 100) * 110);
    const dElem = document.getElementById('door');
    if(dElem) dElem.style.transform = `rotateY(-${doorAngle}deg)`;
    
    const w = document.getElementById('warning-text');
    if (grandma > 20 && grandma < 100) {
        w.style.opacity = "1";
        w.classList.add('blink');
    } else {
        w.style.opacity = "0";
        w.classList.remove('blink');
    }

    if (grandma >= 100) {
        active = false;
        document.getElementById('fail-screen').style.display = 'flex';
    }

    if (rpm >= 80 && rpm <= 120) {
        charge += 1.5;
    } else if (rpm > 10) {
        charge += 0.3;
    }
    charge = Math.min(100, Math.max(0, charge - 0.1));

    document.getElementById('c-val').innerText = Math.floor(charge);
    const n = document.getElementById('needle');
    n.style.transform = `rotate(${-90 + rpm}deg)`;
    n.style.background = (rpm >= 80 && rpm <= 120) ? "#0f0" : (rpm > 140 ? "#f00" : "#ffae00");

    modes[gameMode].update(charge, rpm);
    
    if (charge >= 100) {
        modes[gameMode].win();
    }
}, 50);

function toggleInfo(s) {
    if(!gameMode) return;
    const m = modes[gameMode];
    document.getElementById('info-list').innerHTML = m.info.map(i => `<li>${i}</li>`).join('');
    document.getElementById('info-modal').style.display = s ? 'flex' : 'none';
}