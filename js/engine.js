let charge = 0, rpm = 0, momentum = 0, grandma = 0, active = false, taso = 5, gameMode = null, lastX = 0, lastY = 0;

let currentLang = localStorage.getItem('kiimakeppi_lang') || 'fi';

const translations = {
    fi: {
        title: "Valitse peli!", keppi: "KIIMAKEPPI", simpukka: "SIMPUKKA", lv: "Valitse vaikeustaso",
        infoBtn: "OHJEET", coffee: "☕ Tarjoa kahvit", warning: "JOKU ON TULOSSA...",
        fail: "KIINNI JÄIT!", win: "MAHTAVAA!", retry: "ALKUUN", new: "UUSI PELI",
        loading: "LATAUS", close: "SELVÄ!", infoTitle: "NÄIN PELATAAN", winCoffee: "☕ Tarjoa voittokahvit!", lang: "EN"
    },
    en: {
        title: "Select game!", keppi: "HEAT STICK", simpukka: "SHELL", lv: "Select difficulty",
        infoBtn: "INSTRUCTIONS", coffee: "☕ Buy me a coffee", warning: "SOMEONE IS COMING...",
        fail: "YOU GOT CAUGHT!", win: "AMAZING!", retry: "RESTART", new: "NEW GAME",
        loading: "CHARGE", close: "GOT IT!", infoTitle: "HOW TO PLAY", winCoffee: "☕ Buy winner's coffee!", lang: "FI"
    }
};

const modes = {
    keppi: { 
        label: { fi: 'KIIMA', en: 'HEAT' }, init: initKeppi, update: updateKeppi, win: winKeppi, 
        info: {
            fi: ['HINKKAA: Liikuta sormea.', 'VARO: Jos ovi aukeaa, lopeta heti.', 'VOITTO: Täytä mittari huomaamatta.'],
            en: ['RUB: Move your finger.', 'WATCH OUT: If the door opens, stop immediately.', 'WIN: Fill the meter unnoticed.']
        }
    },
    simpukka: {
        label: { fi: 'KOSTEUS', en: 'MOISTURE' }, init: initSimpukka, update: updateSimpukka, win: winSimpukka, 
        info: {
            fi: ['HINKKAA: Pidä tahti tasaisena.', 'VARO: Joku saattaa kuulla loiskinnan.', 'VOITTO: Kastele koko ruutu.'],
            en: ['RUB: Keep a steady pace.', 'WATCH OUT: Someone might hear splashing.', 'WIN: Soak the whole screen.']
        }
    }
};

window.onload = () => {
    updateTexts();
    const grid = document.getElementById('l-grid');
    if (grid) {
        for (let i = 1; i <= 10; i++) {
            let b = document.createElement('button');
            b.className = 'level-btn';
            b.innerText = i;
            b.onclick = () => { if(gameMode) startGame(i); };
            grid.appendChild(b);
        }
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'fi' ? 'en' : 'fi';
    localStorage.setItem('kiimakeppi_lang', currentLang);
    updateTexts();
    if (document.getElementById('info-modal').style.display === 'flex') toggleInfo(true);
}

function updateTexts() {
    const t = translations[currentLang];
    const el = {
        'txt-title': t.title,
        'txt-keppi': t.keppi,
        'txt-simpukka': t.simpukka,
        'txt-lv': t.lv,
        'txt-info-btn': t.infoBtn,
        'txt-coffee': t.coffee,
        'txt-win-coffee': t.winCoffee,
        'txt-close': t.close,
        'txt-info-title': t.infoTitle,
        'lang-btn': t.lang,
        'txt-win': t.win,
        'txt-new': t.new,
        'txt-fail': t.fail,
        'txt-retry': t.retry,
        'warning-text': t.warning,
        'hud-label': gameMode ? modes[gameMode].label[currentLang] : t.loading
    };

    for (let id in el) {
        let element = document.getElementById(id);
        if (element) element.innerText = el[id];
    }
}

function selectMode(m) {
    gameMode = m;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    const id = m === 'keppi' ? 'txt-keppi' : 'txt-simpukka';
    const btn = document.getElementById(id);
    if (btn) btn.classList.add('active');
    document.getElementById('level-selection').style.visibility = 'visible';
    updateTexts();
}

function startGame(t) {
    taso = t; charge = 0; grandma = 0; rpm = 0; momentum = 0;
    const renderArea = document.getElementById('render-area');
    if (renderArea) renderArea.innerHTML = '';
    const vieraat = ['👵', '👽', '👧', '👩', '🐕', '🧔', '👮', '🧛', '🤡', '🐱', '🐗'];
    const gEl = document.getElementById('grandma');
    if (gEl) gEl.innerText = vieraat[Math.floor(Math.random() * vieraat.length)];
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

document.addEventListener('mousemove', e => handleInput(e.clientX, e.clientY));
document.addEventListener('touchmove', e => { 
    handleInput(e.touches[0].clientX, e.touches[0].clientY); 
}, { passive: false });

setInterval(() => {
    if (!active) return;
    rpm = (rpm * 0.7) + (momentum * 0.3);
    momentum *= 0.85;
    let gSpeed = 0.15 + (taso * 0.2);
    if (rpm > 140) grandma += gSpeed * 2.5;
    else if (rpm > 20) grandma += gSpeed * ((rpm >= 80 && rpm <= 120) ? 0.2 : 1.0);
    else grandma -= 0.2;
    grandma = Math.max(0, grandma);
    const doorAngle = Math.min(110, (grandma / 100) * 110);
    const dElem = document.getElementById('door');
    if(dElem) dElem.style.transform = `rotateY(-${doorAngle}deg)`;
    const w = document.getElementById('warning-text');
    if (w) {
        if (grandma > 20 && grandma < 100) { w.style.opacity = "1"; w.classList.add('blink'); }
        else { w.style.opacity = "0"; w.classList.remove('blink'); }
    }
    if (grandma >= 100) {
        active = false;
        document.getElementById('fail-screen').style.display = 'flex';
    }
    if (rpm >= 80 && rpm <= 120) charge += 1.5;
    else if (rpm > 10) charge += 0.3;
    charge = Math.min(100, Math.max(0, charge - 0.1));
    document.getElementById('c-val').innerText = Math.floor(charge);
    const n = document.getElementById('needle');
    if (n) {
        n.style.transform = `rotate(${-90 + rpm}deg)`;
        n.style.background = (rpm >= 80 && rpm <= 120) ? "#0f0" : (rpm > 140 ? "#f00" : "#ffae00");
    }
    if (gameMode && modes[gameMode]) modes[gameMode].update(charge, rpm);
    if (charge >= 100) { active = false; modes[gameMode].win(); }
}, 50);

function toggleInfo(s) {
    if(!gameMode) return;
    const m = modes[gameMode];
    document.getElementById('info-list').innerHTML = m.info[currentLang].map(i => `<li>${i}</li>`).join('');
    document.getElementById('info-modal').style.display = s ? 'flex' : 'none';
}