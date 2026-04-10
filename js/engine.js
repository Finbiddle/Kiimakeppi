let charge = 0, rpm = 0, momentum = 0, grandma = 0, active = false, taso = 5, gameMode = 'keppi', lastX = 0, lastY = 0;

const modes = {
    keppi: { 
        label: 'KIIMA', 
        init: initKeppi, 
        update: updateKeppi, 
        win: winKeppi, 
        info: [
            'HINKKAA: Liikuta hiirtä tai sormea kiimakepin päällä.',
            'VIHREÄ VYÖHYKE: Optimaalinen tahti. Pysyt huomaamattomana!',
            'ORANSSI VYÖHYKE: Tahti hiipuu. Olet epävakaalla alueella.',
            'PUNAINEN VYÖHYKE: Liikaa melua! Huomio kiinnittyy sinuun välittömästi.',
            'VARO: Jos ovi raottuu, lopeta kaikki liike heti.'
        ] 
    },
    simpukka: {
        label: 'KOSTEUS',
        init: initSimpukka,
        update: updateSimpukka,
        win: winSimpukka,
        info: [
            'HINKKAA: Liikuta hiirtä tai sormea herkästi.',
            'OPTIMI: Pidä neula vihreällä.',
            'VARO: Liian kova meno nostaa lämpöjä ja melua!',
            'STOP: Jos ovi aukeaa, jähmety heti.'
        ]
    }
};

function switchMode(m) {
    gameMode = m;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    if (window.event && window.event.target && window.event.target.classList.contains('mode-btn')) {
        window.event.target.classList.add('active');
    }
    document.getElementById('hud-label').innerText = modes[m].label;
}

function toggleInfo(s) {
    const m = modes[gameMode];
    document.getElementById('info-list').innerHTML = m.info.map(i => `<li>${i}</li>`).join('');
    document.getElementById('info-modal').style.display = s ? 'flex' : 'none';
}

const grid = document.getElementById('l-grid');
for (let i = 1; i <= 10; i++) {
    let b = document.createElement('button'); b.className = 'level-btn'; b.innerText = i;
    b.onclick = () => startGame(i);
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

    let gSpeed = 0.15 + (taso * 0.16);
    if (rpm > 140) grandma += gSpeed * 2.5;
    else if (rpm > 20) { if (rpm >= 80 && rpm <= 120) gSpeed *= 0.3; grandma += gSpeed; }
    else grandma -= 0.15;
    grandma = Math.max(0, grandma);

    document.getElementById('door').style.transform = `rotateY(-${Math.min(110, (grandma / 100) * 110)}deg)`;
    const w = document.getElementById('warning-text');
    if (grandma > 20 && grandma < 100) { w.style.opacity = "1"; w.classList.add('blink'); }
    else { w.style.opacity = "0"; w.classList.remove('blink'); }

    if (grandma >= 100) { active = false; document.getElementById('fail-screen').style.display = 'flex'; }

    if (rpm >= 80 && rpm <= 120) charge += 1.5;
    else if (rpm > 120) charge += 0.4;
    else if (rpm > 10) charge += 0.2;
    charge = Math.min(100, Math.max(0, charge - (rpm < 10 ? 0.3 : 0.1)));

    document.getElementById('c-val').innerText = Math.floor(charge);
    const n = document.getElementById('needle');
    n.style.transform = `rotate(${-90 + rpm}deg)`;
    n.style.background = (rpm >= 80 && rpm <= 120) ? "#0f0" : (rpm > 140 ? "#f00" : "#ffae00");

    modes[gameMode].update(charge, rpm);
    if (charge >= 100) modes[gameMode].win();
}, 50);

switchMode('keppi');