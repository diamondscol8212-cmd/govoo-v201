/* --- MOTOR LÓGICO GOVOTTO V201 FINAL FIXED --- */

const AVATARS = { 
    wolf: { name: "LOBITO", icon: "fa-dog" }, 
    cat: { name: "KIRA", icon: "fa-cat" }, 
    owl: { name: "ORION", icon: "fa-crow" } 
};

let state = { 
    route: 1, lvl: 0, $ : 1000, btc: 0.00000000, pet: null, 
    username: "VIAJERO", nameSet: false, item: false, 
    dockUnlocked: true, vaultUnlocked: false, dailyClaimed: false, 
    personality: "EXPLORADOR", goldenTicket: false, coupons: [], 
    registered: false, playedEvents: [], casinoPlayed: false, streak: 0 
}; 

let audioContext = null; 
let bombInterval = null; 
let fireHeartbeat = null; 
let stressTimerAlert = null; 
let stressTimerCritical = null; 
let stressVibrationInterval = null; 
let gauntletActive = false;
let fireTrialIndex = 0; 
let fireTrialTimer = null;

const FIRE_TRIAL_QS = [ 
    "¿TE GUSTA LEER?", "¿VIAJAR SOLO?", "¿AHORRAS DINERO?", 
    "¿TIENES MASCOTAS?", "¿CAFÉ O TÉ?", "¿MADRUGAS?", 
    "¿COCINAS?", "¿HACES DEPORTE?", "¿NETFLIX O CINE?", 
    "¿INVIERNO O VERANO?" 
];

// --- 1. GESTIÓN DE VENTANAS ---

   function openLoot() { 
    try { playSfx('click'); } catch(e){} 
    const layer = document.getElementById('loot-layer'); 
    const frame = document.getElementById('loot-frame'); 
    if(layer && frame) { 
        // Conectamos directamente al archivo físico
        frame.src = "tesoro.html"; 
        layer.classList.remove('hidden'); 
        layer.classList.add('flex-show');
    } 
}

function forceCloseLoot() {
    const layer = document.getElementById('loot-layer'); 
    if(layer) {
        layer.classList.remove('flex-show'); 
        layer.classList.add('hidden'); 
        document.getElementById('loot-frame').src = ''; 
    }
}

function startTurbineGame() { 
    try { playSfx('click'); } catch(e){} 
    localStorage.setItem('govotto_vault', state.$); 
    closeSlots(); 
    const layer = document.getElementById('turbine-layer'); 
    const frame = document.getElementById('turbine-frame'); 
    if(layer && frame) { 
        frame.src = './turbina.html?v=' + Date.now(); 
        layer.classList.remove('hidden'); 
        layer.classList.add('flex-show'); 
    } 
}

function startSlotGame() { 
    if(state.casinoPlayed && !state.registered) { 
        showCustomAlert('CERRADO', 'Cierres por mantenimiento.\nVuelve al completar la Ruta 2.'); 
        return; 
    } 
    localStorage.setItem('govotto_vault', state.$); 
    closeSlots(); 
    const layer = document.getElementById('turbine-layer'); 
    const frame = document.getElementById('turbine-frame'); 
    if(layer && frame) { 
        frame.src = './tragamonedas.html?v=' + Date.now(); 
        layer.classList.remove('hidden'); 
        layer.classList.add('flex-show'); 
    } 
}

function forceCloseTurbine() { 
    const layer = document.getElementById('turbine-layer'); 
    if(layer) {
        layer.classList.remove('flex-show'); 
        layer.classList.add('hidden'); 
        document.getElementById('turbine-frame').src = ''; 
        openCasinoMenu(); 
    }
}

function forceCloseEvent() {
    const layer = document.getElementById('event-layer');
    if(layer) {
        layer.classList.add('hidden');
        layer.classList.remove('flex-show');
        document.getElementById('event-frame').src = '';
    }
}

// --- 2. COMUNICACIÓN DE MENSAJES ---

window.addEventListener('message', function(event) {
    if (event.data.action === 'close_turbine') { 
        state.$ = event.data.balance; 
        actualizarVisualBoveda(0); 
        forceCloseTurbine(); 
    }
    else if (event.data.action === 'close_loot') { 
        state.$ += event.data.reward; 
        actualizarVisualBoveda(event.data.reward); 
        forceCloseLoot(); 
    }
    else if (event.data.action === 'close_loot_window') { 
        forceCloseLoot(); 
    }
    else if (event.data.action === 'close_event') { 
        const monto = event.data.reward; 
        state.$ += monto; 
        if(state.$ < 0) state.$ = 0; 
        actualizarVisualBoveda(monto); 
        if(monto > 0) { 
            localStorage.setItem('govotto_last_event_date', new Date().toDateString()); 
            showCustomAlert('SINCRO OK', `+$${monto} transferidos.`); 
        } else { 
            showCustomAlert('FAIL', `Multa de $500 aplicada.`); 
        } 
        forceCloseEvent(); 
    }
});

// --- 3. SISTEMA DE USUARIO Y ARRANQUE ---

function verificarUsuario() {
    const isRegistered = localStorage.getItem('govotto_registered') === 'true';
    const bootBtn = document.getElementById('boot-btn');
    const bootScreen = document.getElementById('boot-screen');
    let statusDiv = document.getElementById('ident-status');
    if(!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'ident-status';
        statusDiv.style.margin = '15px 0';
        statusDiv.style.fontSize = '10px';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.fontFamily = 'monospace';
        statusDiv.style.letterSpacing = '2px';
        bootScreen.insertBefore(statusDiv, bootBtn);
    }

    if (isRegistered) {
        const adn = JSON.parse(localStorage.getItem('govotto_dante_adn')) || {vision:50, reserva:50};
        let rango = (adn.vision > adn.reserva) ? "CONQUISTADOR" : "GUARDIÁN";
        state.dockUnlocked = true; 
        statusDiv.innerText = `ID DETECTADO: ${rango}`;
        statusDiv.style.color = "var(--primary)";
        statusDiv.style.textShadow = "0 0 10px var(--primary)";
        bootBtn.innerText = "ACCEDER A LA RED";
        bootBtn.style.color = "var(--primary)";
        bootBtn.style.border = "1px solid var(--primary)";
        bootBtn.onclick = () => startApp(); 
    } else {
        statusDiv.innerText = "NÚCLEO NO DETECTADO";
        statusDiv.style.color = "var(--risk)";
        statusDiv.style.textShadow = "0 0 10px var(--risk)";
        bootBtn.innerText = "INICIAR NACIMIENTO";
        bootBtn.style.border = "1px solid var(--risk)";
        bootBtn.style.color = "var(--risk)";
        bootBtn.onclick = () => window.location.href = 'nacimiento.html';
    }
}

window.onload = function() { 
    const hoy = new Date().toDateString();
    const ultimaConexion = localStorage.getItem('govotto_last_login');
    let rachaActual = parseInt(localStorage.getItem('govotto_streak')) || 0;

    if (ultimaConexion !== hoy) {
        const ayer = new Date(); ayer.setDate(ayer.getDate() - 1);
        if (ultimaConexion === ayer.toDateString()) { rachaActual++; } else { rachaActual = 1; }
        localStorage.setItem('govotto_last_login', hoy);
        localStorage.setItem('govotto_streak', rachaActual);
    }
    state.streak = rachaActual;

    const savedMoney = localStorage.getItem('govotto_vault');
    if(savedMoney) {
        state.$ = parseInt(savedMoney);
        document.getElementById('hud-money').innerText = "$" + state.$.toLocaleString();
    }

    let b = document.getElementById('energy-fill'); 
    let w = 0; 
    let i = setInterval(() => { 
        w += 5; b.style.width = w + '%'; 
        if (w >= 100) { clearInterval(i); document.getElementById('boot-btn').classList.remove('hidden'); verificarUsuario(); } 
    }, 30); 
};

function startApp() {
    localStorage.setItem('govotto_vault', state.$); 
    document.getElementById('boot-screen').style.display = 'none';
    const layer = document.getElementById('intro-layer');
    layer.classList.remove('hidden'); layer.style.display = 'flex'; 
    try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
    const bar = document.getElementById('cinema-fill');
    setTimeout(() => { bar.style.width = "100%"; }, 1200);
    setTimeout(() => { layer.style.opacity = "0"; setTimeout(() => { startMap(); layer.style.display = 'none'; }, 500); }, 1800);
}

function startMap() { 
    showView('map-view'); 
    renderMap(); 
}

// --- 4. RENDERIZADO DEL MAPA ---

function renderMap() {
    const c = document.getElementById('nodes-container'); c.innerHTML=''; 
    const nodes = state.route===1 ? R1 : R2;

    nodes.forEach((n,i) => {
        let cls="node"; 
        let ic='<i class="fas fa-lock"></i>'; 
        if(i<state.lvl){ cls+=" node-done"; ic='<i class="fas fa-check"></i>'; } 
        else if(i===state.lvl){ cls+=" node-active-cyber"; ic='<i class="fas fa-crosshairs"></i>'; }
        
        let d=document.createElement('div'); d.className='node-wrapper'; 
        d.innerHTML=`<div class="${cls}" onclick="clickNode(${i})">${ic}</div><div class="node-name">NIVEL ${i+1}</div>`; 
        c.appendChild(d);
    });
}

function clickNode(i) {
    if(i!==state.lvl) return; 
    const n = state.route===1 ? R1[i] : R2[i]; 
    if(n.t==='ab') startAB(n.d); 
    else if(n.t==='bomb') startBomb(n.d); 
    else if(n.t==='fire') startFire(n.d); 
    else if(n.t==='truth') startTruth(n.d);
}

// --- 5. LÓGICA DE INTERFAZ ---

function showView(id) {
    document.getElementById('map-view').classList.add('hidden');
    const target = document.getElementById(id);
    if(target) { target.classList.remove('hidden'); target.style.display = 'flex'; }

    const docks = ['home-dock', 'loot-dock', 'casino-dock', 'fire-dock', 'vault-dock'];
    docks.forEach(d => {
        const el = document.getElementById(d);
        if(el) id === 'map-view' ? el.classList.add('dock-visible') : el.classList.remove('dock-visible');
    });
}

function actualizarVisualBoveda(cambio) {
    document.getElementById('hud-money').innerText = "$" + state.$.toLocaleString();
    localStorage.setItem('govotto_vault', state.$); 
}

function openCasinoMenu() { document.getElementById('slots-modal').classList.remove('hidden'); }
function closeSlots() { document.getElementById('slots-modal').classList.add('hidden'); }
function openRanking() { document.getElementById('ranking-modal').classList.remove('hidden'); }
function closeRanking() { document.getElementById('ranking-modal').classList.add('hidden'); }

function playSfx(t) { 
    if(!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const o=audioContext.createOscillator(); o.connect(audioContext.destination);
    o.start(); o.stop(audioContext.currentTime+0.1); 
}

// --- 6. MINI JUEGOS BÁSICOS (AB / BOMB / FIRE) ---
function startAB(d) { qQueue = d; qIndex = 0; showView('ab-view'); renderAB(); }
function renderAB() { 
    document.getElementById('img-a').src = qQueue[qIndex].iA; 
    document.getElementById('txt-a').innerText = qQueue[qIndex].tA; 
    document.getElementById('img-b').src = qQueue[qIndex].iB; 
    document.getElementById('txt-b').innerText = qQueue[qIndex].tB; 
}
function handleOption() { qIndex++; if(qIndex < qQueue.length) renderAB(); else { advance(); } }

function advance() {
    state.lvl++; state.$ += 300; 
    actualizarVisualBoveda(0);
    showView('map-view');
    renderMap();
}