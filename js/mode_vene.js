function initVene() {
    const area = document.getElementById('render-area');
    area.innerHTML = `<div class="v-wrap" id="vene-rata">
        <div class="v-body" id="boat">
            <div class="v-lock left"></div>
            <div class="v-oar left" id="oarL1"></div>
            <div class="v-lock right"></div>
            <div class="v-oar right" id="oarR1"></div>
            <div class="v-lock left" style="top:110px;"></div>
            <div class="v-oar left" id="oarL2" style="top:70px;"></div>
            <div class="v-lock right" style="top:110px;"></div>
            <div class="v-oar right" id="oarR2" style="top:70px;"></div>
        </div>
        <p id="dist-text" style="color:var(--ui-green); position:absolute; bottom:-30px; font-size:1rem; width:200px; text-align:center;">MATKAA KIRKKOON: 100m</p>
    </div>`;
}

function updateVene(c, r) {
    const airotL = [document.getElementById('oarL1'), document.getElementById('oarL2')];
    const airotR = [document.getElementById('oarR1'), document.getElementById('oarR2')];
    const speed = r / 8;
    const sweep = Math.sin(Date.now() / 100) * speed; 
    airotL.forEach(oar => { if(oar) oar.style.transform = `rotate(${sweep}deg)`; });
    airotR.forEach(oar => { if(oar) oar.style.transform = `rotate(${-sweep}deg)`; });
    const boat = document.getElementById('boat');
    if(boat) {
        const travel = c * 2; 
        const wobble = Math.sin(Date.now() / 50) * (r / 20);
        boat.style.transform = `translateY(${-travel}px) translateX(${wobble}px)`;
    }
    const dt = document.getElementById('dist-text');
    if(dt) dt.innerText = `MATKAA KIRKKOON: ${100 - Math.floor(c)}m`;
}

function winVene() {
    active = false;
    document.getElementById('win-screen').style.display = 'flex';
    document.querySelector('.win-text').innerText = "RANNASSA! KELLOT SOI!";
    setTimeout(() => location.reload(), 5000);
}