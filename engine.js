/* --- MOTOR LÓGICO GOVOTTO V201 FINAL FIXED (QUANTUM EDITION) --- */

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
        frame.src = "tesoro.html"; 
        layer.classList.remove('hidden'); 
        layer.style.display = 'flex';
        layer.style.zIndex = '9999999'; // FUERZA BRUTA: Por encima del HUD
    } 
}

function forceCloseLoot() {
    const layer = document.getElementById('loot-layer'); 
    if(layer) {
        layer.classList.remove('flex-show'); 
        layer.classList.add('hidden'); 
        layer.style.display = 'none';
        document.getElementById('loot-frame').src = ''; 
    }
}

function startTurbineGame() { 
    try { playSfx('click'); } catch(e){} 
    localStorage.setItem('govotto_vault', state.$); 
    closeSlots(); 
    const layer = document.getElementById('game-portal-layer'); 
    const frame = document.getElementById('game-portal-frame'); 
    if(layer && frame) { 
        // RUTA PURA: Apunta al portal de la cámara de vacío
        frame.src = 'turbina.html'; 
        layer.classList.remove('hidden'); 
        layer.classList.add('flex-show');
    } 
}

function startSlotGame() { 
    // 1. Verificación de permisos (El Guardián)
    if(state.casinoPlayed && !state.registered) { 
        showCustomAlert('ENERGÍA INSUFICIENTE', 'El Sincronizador requiere más datos.\nVuelve al completar la Ruta 2.'); 
        return; 
    } 
    
    // 2. Guardamos el saldo actual
    localStorage.setItem('govotto_vault', state.$); 
    closeSlots(); 
    
    // 3. Abrimos la Cámara del Vacío apuntando al Oráculo
    const layer = document.getElementById('game-portal-layer'); 
    const frame = document.getElementById('game-portal-frame'); 
    if(layer && frame) { 
        frame.src = 'sincronizador.html'; // <-- AQUÍ NACE EL ORÁCULO
        layer.classList.remove('hidden'); 
        layer.classList.add('flex-show');
    } 
}

function closeGamePortal() {
    const layer = document.getElementById('game-portal-layer');
    if(layer) {
        layer.classList.add('hidden');
        layer.classList.remove('flex-show');
        document.getElementById('game-portal-frame').src = 'about:blank';
        openCasinoMenu(); 
    }
}

function forceCloseTurbine() { 
    const layer = document.getElementById('turbine-layer'); 
    if(layer) {
        layer.classList.remove('flex-show'); 
        layer.classList.add('hidden'); 
        layer.style.display = 'none';
        document.getElementById('turbine-frame').src = ''; 
        openCasinoMenu(); 
    }
}

function forceCloseEvent() {
    const layer = document.getElementById('event-layer');
    if(layer) {
        layer.classList.add('hidden');
        layer.classList.remove('flex-show');
        layer.style.display = 'none';
        document.getElementById('event-frame').src = '';
    }
}

// --- 2. COMUNICACIÓN DE MENSAJES ---

window.addEventListener('message', function(event) {
    if (event.data.action === 'close_turbine') { 
        state.$ = event.data.balance; 
        actualizarVisualBoveda(0); 
        closeGamePortal(); 
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

// --- 3. SISTEMA DE USUARIO Y ARRANQUE (ACTUALIZADO PARA SINGULARIDAD) ---

function verificarUsuario() {
    const isRegistered = localStorage.getItem('govotto_registered') === 'true';
    const statusDiv = document.getElementById('genesis-status');
    const bootBtn = document.getElementById('genesis-btn');

    if (isRegistered) {
        const adn = JSON.parse(localStorage.getItem('govotto_dante_adn')) || {vision:50, reserva:50};
        let rango = (adn.vision > adn.reserva) ? "CONQUISTADOR" : "GUARDIÁN";
        state.dockUnlocked = true; 
        if(statusDiv) {
            statusDiv.innerText = `ID DETECTADO: ${rango}`;
            statusDiv.style.color = "#00ffcc";
        }
        if(bootBtn) {
            bootBtn.innerText = "ACCEDER A LA RED";
            bootBtn.onclick = () => { if(typeof igniteSingularity === 'function') igniteSingularity(); };
        }
    } else {
        if(statusDiv) {
            statusDiv.innerText = "NÚCLEO NO DETECTADO";
            statusDiv.style.color = "var(--risk)";
        }
        if(bootBtn) {
            bootBtn.innerText = "INICIAR NACIMIENTO";
            bootBtn.style.color = "var(--risk)";
            bootBtn.style.borderColor = "var(--risk)";
            bootBtn.onclick = () => window.location.href = 'nacimiento.html';
        }
    }
}

window.onload = function() { 
    // 1. RECUPERAR RACHA
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

    // 2. RECUPERAR DINERO
    const savedMoney = localStorage.getItem('govotto_vault');
    if(savedMoney) {
        state.$ = parseInt(savedMoney);
        const hudMoney = document.getElementById('hud-money');
        if(hudMoney) hudMoney.innerText = "$" + state.$.toLocaleString();
    }

    // 3. LLAMAR A LA VERIFICACIÓN (Conecta con la Singularidad)
    verificarUsuario(); 
};

function startApp() {
    // Se ejecuta INMEDIATAMENTE después del flash de la Singularidad
    localStorage.setItem('govotto_vault', state.$); 
    try { if(!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
    startMap(); 
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
    // 1. APAGAR TODAS LAS PANTALLAS POSIBLES (Limpieza total)
    const todasLasVistas = ['map-view', 'ab-view', 'bomb-view', 'fire-view', 'truth-view'];
    todasLasVistas.forEach(vista => {
        const el = document.getElementById(vista);
        if(el) {
            el.classList.add('hidden');
            el.style.display = 'none'; // Aseguramos que desaparezca físicamente
        }
    });

    // 2. ENCENDER SOLO LA PANTALLA QUE NECESITAMOS
    const target = document.getElementById(id);
    if(target) { 
        target.classList.remove('hidden'); 
        target.style.display = 'flex'; 
    }

    // 3. GESTIONAR LOS BOTONES INFERIORES (DOCKS)
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

// --- AQUÍ ESTÁ EL CAMBIO MAESTRO PARA EL CASINO ---
function openCasinoMenu() {
    const frame = document.getElementById('app-frame');
    const modal = document.getElementById('slots-modal');
    const selector = document.getElementById('casino-selector');

    if (frame && modal && selector) {
        // 1. Iniciamos la ruptura de realidad (Glitch)
        frame.classList.add('rupture-active');
        try { if(navigator.vibrate) navigator.vibrate([50, 30, 50]); } catch(e){}

        // 2. Lógica de Resonancia: ¿Qué tan cargado viene el usuario?
        if (state.$ >= 25000) {
            selector.setAttribute('data-wealth', 'gold'); // Modo Millonario
        } else if (state.$ < 500) {
            selector.setAttribute('data-wealth', 'critical'); // Modo Riesgo
        } else {
            selector.setAttribute('data-wealth', 'standard'); // Modo Normal
        }

        // 3. Apertura del Portal de Éter
        setTimeout(() => {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.zIndex = '9999999';
            // Limpiamos el efecto de ruptura
            setTimeout(() => frame.classList.remove('rupture-active'), 500);
        }, 200);
    }
}

function closeSlots() {
    const modal = document.getElementById('slots-modal');
    const frame = document.getElementById('app-frame');
    
    if (modal && frame) {
        // 1. Iniciamos la desmaterialización (Escalado, opacidad y desenfoque)
        modal.style.transition = "all 0.4s cubic-bezier(0.47, 0, 0.745, 0.715)";
        modal.style.opacity = "0";
        modal.style.transform = "scale(1.2) translateY(20px)";
        modal.style.filter = "blur(10px)";

        // 2. Breve pulso de retorno al mapa (Flash de contraste)
        frame.style.filter = "brightness(1.5) contrast(1.2)";
        
        setTimeout(() => {
            modal.classList.add('hidden');
            // Reset de estilos para la próxima apertura impecable
            modal.style.opacity = "1";
            modal.style.transform = "scale(1) translateY(0)";
            modal.style.filter = "none";
            modal.style.display = 'none';
            frame.style.filter = "none";
        }, 400);
    }
}
// --------------------------------------------------

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