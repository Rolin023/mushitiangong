document.addEventListener('DOMContentLoaded', () => {
    initLevel2WaterMoon();
});

function initLevel2WaterMoon() {
    const scene        = document.getElementById('scene-level2');
    const gameBox      = document.getElementById('gameBox');
    const waterBox     = document.getElementById('waterBox');
    const bell         = document.getElementById('bell');
    const moon         = document.getElementById('moon');
    const lotus        = document.getElementById('lotus');
    const timerWrap    = document.getElementById('timerWrap');
    const timerBar     = document.getElementById('timerBar');
    const magicArcReal = document.getElementById('magicArcReal');
    const magicArcSvg  = document.getElementById('magicArcSvg');
    const phase2Banner = document.getElementById('phase2-banner');
    
    if(!scene || !gameBox) return;

    const ripples = [
        document.getElementById('ripple1'),
        document.getElementById('ripple2'),
        document.getElementById('ripple3')
    ];
    const hintMoon  = document.getElementById('hintMoon');
    const hintLotus = document.getElementById('hintLotus');
    const hintBell  = document.getElementById('hintBell');

    const TARGET_WATER_Y  = 300;
    const TARGET_LOTUS_X  = 542;
    const SNAP_THRESHOLD  = 14;
    const WIN_TOLERANCE   = 5;

    const STONE_W = 52;
    const STONE_H = 38;
    const STONE_SNAP_R = 28; 

    function arcPoint(deg) {
        const rad = deg * Math.PI / 180;
        return { x: 450 + 135 * Math.cos(rad), y: 300 + 135 * Math.sin(rad) };
    }
    const LEFT_SNAP  = arcPoint(-55);
    const KEY_SNAP   = arcPoint(-45);
    const RIGHT_SNAP = arcPoint(-35);

    const STONE_DATA = [
        { id: 'stone-left', label: '左拱石', snap: LEFT_SNAP, initX: 340, initY: 525, delay: 0, placed: false, locked: false },
        { id: 'stone-right', label: '右拱石', snap: RIGHT_SNAP, initX: 500, initY: 525, delay: 0.15, placed: false, locked: false },
        { id: 'stone-key', label: '龙门石', snap: KEY_SNAP, initX: 420, initY: 525, delay: 0.30, placed: false, locked: true },
    ];

    let phase        = 0;
    let isSolved     = false;
    let isWaterClear = false;
    let clearTimer   = null;
    let interacted   = { moon: false, lotus: false, bell: false };

    startFireflies();

    function startFireflies() {
        const ffs = document.querySelectorAll('.firefly');
        ffs.forEach((ff, i) => animateFirefly(ff, i));
    }

    function animateFirefly(el, idx) {
        const delay = idx * 1400 + Math.random() * 800;
        const dur   = 6000 + Math.random() * 5000;
        setTimeout(function loop() {
            const dx  = (Math.random() - 0.5) * 120;
            const dy  = -(20 + Math.random() * 80);
            const dx2 = dx + (Math.random() - 0.5) * 40;
            const dy2 = dy - (10 + Math.random() * 40);
            el.style.setProperty('--ff-dx',  dx  + 'px');
            el.style.setProperty('--ff-dy',  dy  + 'px');
            el.style.animationName = 'none';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.animationName = 'fireflyFloat';
                    el.style.animationDuration = (dur / 1000).toFixed(1) + 's';
                    el.style.animationIterationCount = '1';
                });
            });
            setTimeout(() => loop(), dur + 200 + Math.random() * 1000);
        }, delay);
    }

    function getVar(name) { return parseFloat(scene.style.getPropertyValue(name)) || parseFloat(getComputedStyle(scene).getPropertyValue(name)); }
    function setVar(name, val) { scene.style.setProperty(name, val); }

        function updateVisualHints(waterY, lotusX) {
        if (phase !== 0) return;
        const wd = Math.abs(waterY - TARGET_WATER_Y);
        const ld = Math.abs(lotusX - TARGET_LOTUS_X);
        const totalErr = wd + ld;
        const glow = Math.max(0, 1 - totalErr / 140);
        setVar('--proximity-glow', glow.toFixed(3));

        const magicArcSvg = document.getElementById('magicArcSvg');
        const magicReflections = document.querySelectorAll('.reflection-group svg:nth-child(2)');
        if (ld === 0) {
            magicArcSvg.style.stroke = '#ffd700'; 
            magicArcSvg.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))';
            magicArcSvg.style.transition = 'stroke 0.3s ease, filter 0.3s ease'; 
        } else {
            magicArcSvg.style.stroke = 'var(--magic-color)'; 
            magicArcSvg.style.filter = '';
        }
        if (wd === 0) {
            magicReflections.forEach(svg => {
                svg.style.stroke = '#ffd700';
                svg.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))';
                svg.style.transition = 'stroke 0.3s ease, filter 0.3s ease';
            });
        } else {
            magicReflections.forEach(svg => {
                svg.style.stroke = 'var(--magic-color)';
                svg.style.filter = '';
            });
        }

        if (isWaterClear && wd < WIN_TOLERANCE && ld < WIN_TOLERANCE) {
            enterStage2();
        }
    }

    function hideHint(key, el) {
        if (!interacted[key]) {
            interacted[key] = true;
            el.style.opacity = '0';
            setTimeout(() => el.style.display = 'none', 600);
        }
    }

    moon.addEventListener('pointerdown', (e) => {
        if (phase !== 0) return;
        moon.setPointerCapture(e.pointerId);
        hideHint('moon', hintMoon);

        const onMove = (ev) => {
            const rect = gameBox.getBoundingClientRect();
            let moonY  = ev.clientY - rect.top;
            moonY      = Math.max(80, Math.min(248, moonY));
            let waterY = 300 + (moonY - 115) * 1.5;
            waterY = Math.max(200, Math.min(480, waterY));

            if (Math.abs(waterY - TARGET_WATER_Y) < SNAP_THRESHOLD) {
                waterY = TARGET_WATER_Y; moonY  = 115;
            }
            setVar('--moon-y',  moonY); setVar('--water-y', waterY);
            updateVisualHints(waterY, getVar('--lotus-x'));
        };
        moon.addEventListener('pointermove', onMove);
        moon.addEventListener('pointerup', () => moon.removeEventListener('pointermove', onMove), { once: true });
    });

    lotus.addEventListener('pointerdown', (e) => {
        if (phase !== 0) return;
        lotus.setPointerCapture(e.pointerId);
        hideHint('lotus', hintLotus);

        const onMove = (ev) => {
            const rect   = gameBox.getBoundingClientRect();
            let lotusX   = ev.clientX - rect.left;
            lotusX       = Math.max(40, Math.min(860, lotusX));

            if (Math.abs(lotusX - TARGET_LOTUS_X) < SNAP_THRESHOLD) lotusX = TARGET_LOTUS_X;
            setVar('--lotus-x', lotusX);
            updateVisualHints(getVar('--water-y'), lotusX);
        };
        lotus.addEventListener('pointermove', onMove);
        lotus.addEventListener('pointerup', () => lotus.removeEventListener('pointermove', onMove), { once: true });
    });

    function ringBell() {
        if (phase !== 0 || isSolved || isWaterClear) return;
        hideHint('bell', hintBell);

        bell.classList.add('ringing', 'active-timer');
        waterBox.classList.add('is-clear');
        isWaterClear = true;

        ripples.forEach(r => { r.classList.remove('animate'); void r.offsetWidth; r.classList.add('animate'); });

        timerBar.classList.remove('draining'); void timerBar.offsetWidth;
        timerWrap.classList.add('visible'); timerBar.classList.add('draining');

        updateVisualHints(getVar('--water-y'), getVar('--lotus-x'));

        clearTimer = setTimeout(() => {
            if (phase === 0 && !isSolved) {
                isWaterClear = false; waterBox.classList.remove('is-clear');
                bell.classList.remove('ringing', 'active-timer'); timerWrap.classList.remove('visible');
            }
        }, 4000);
    }
    bell.addEventListener('click', ringBell);

    function enterStage2() {
        if (phase !== 0) return;
        phase = 1;
        clearTimeout(clearTimer);
        bell.classList.remove('ringing', 'active-timer'); timerWrap.classList.remove('visible');
        waterBox.classList.add('is-clear');

        moon.style.pointerEvents = 'none'; moon.style.opacity = '0.38';
        lotus.style.pointerEvents = 'none'; lotus.style.opacity = '0.38';
        bell.style.pointerEvents = 'none'; bell.style.opacity = '0.38';
        setVar('--proximity-glow', '0');

        magicArcReal.classList.add('blueprint');
        magicArcSvg.style.fill = 'none'; magicArcSvg.style.stroke = 'rgba(110, 209, 216, 0.55)';
        magicArcSvg.style.strokeWidth = '5'; magicArcSvg.style.strokeLinecap = 'round';
        magicArcSvg.style.strokeDasharray = '11 9'; magicArcSvg.style.filter = 'drop-shadow(0 0 8px rgba(110,209,216,0.38))';

        let dashOffset = 0;
        const dashAnim = setInterval(() => {
            if (phase > 1) { clearInterval(dashAnim); return; }
            dashOffset = (dashOffset + 0.4) % 20;
            magicArcSvg.style.strokeDashoffset = dashOffset + 'px';
        }, 30);

        STONE_DATA.forEach(sd => {
            const ring = document.createElement('div');
            ring.className = 'snap-zone-ring'; ring.id = 'ring-' + sd.id;
            ring.style.left = sd.snap.x + 'px'; ring.style.top = sd.snap.y + 'px';
            ring.style.width = (STONE_W + 10) + 'px'; ring.style.height = (STONE_H + 10) + 'px';
            gameBox.appendChild(ring);
        });

        phase2Banner.classList.add('active');
        setTimeout(() => spawnStones(), 700);
    }

    function getStoneSVG(id) {
        if (id === 'stone-left') return `<svg viewBox="0 0 52 38"><defs><linearGradient id="sg-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9a8060"/><stop offset="100%" stop-color="#6b5235"/></linearGradient></defs><path d="M2,36 L50,36 L44,2 L4,7 Z" fill="url(#sg-l)" /><path d="M13,36 L11,9 M28,36 L27,5 M43,36 L42,3" stroke="rgba(0,0,0,0.22)" stroke-width="1" fill="none"/><path d="M2,22 L50,22" stroke="rgba(0,0,0,0.12)" stroke-width="1" fill="none"/><path d="M4,7 L44,2" stroke="rgba(255,255,255,0.18)" stroke-width="1.2" fill="none"/><path d="M50,36 L44,2" stroke="rgba(0,0,0,0.2)" stroke-width="1" fill="none"/></svg>`;
        if (id === 'stone-right') return `<svg viewBox="0 0 52 38"><defs><linearGradient id="sg-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9a8060"/><stop offset="100%" stop-color="#6b5235"/></linearGradient></defs><path d="M2,36 L50,36 L48,7 L8,2 Z" fill="url(#sg-r)" /><path d="M10,36 L9,6 M24,36 L23,4 M39,36 L40,8" stroke="rgba(0,0,0,0.22)" stroke-width="1" fill="none"/><path d="M2,22 L50,22" stroke="rgba(0,0,0,0.12)" stroke-width="1" fill="none"/><path d="M8,2 L48,7" stroke="rgba(255,255,255,0.18)" stroke-width="1.2" fill="none"/><path d="M2,36 L8,2" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none"/></svg>`;
        return `<svg viewBox="0 0 52 38"><defs><linearGradient id="sg-k" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c8a855"/><stop offset="100%" stop-color="#8a6830"/></linearGradient></defs><path d="M2,36 L50,36 L42,2 L10,2 Z" fill="url(#sg-k)" /><path d="M15,36 L13,4 M26,36 L26,4 M37,36 L39,4" stroke="rgba(0,0,0,0.2)" stroke-width="1" fill="none"/><path d="M2,22 L50,22" stroke="rgba(0,0,0,0.12)" stroke-width="1" fill="none"/><path d="M10,2 L42,2" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/><path d="M2,36 L10,2" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none"/><path d="M50,36 L42,2" stroke="rgba(0,0,0,0.18)" stroke-width="1" fill="none"/></svg>`;
    }

    function spawnStones() {
        STONE_DATA.forEach((sd, i) => {
            const div = document.createElement('div');
            div.id = sd.id; div.className = 'stone-piece' + (sd.locked ? ' disabled' : '');
            div.innerHTML = getStoneSVG(sd.id);
            div.style.left = (sd.initX - STONE_W / 2) + 'px'; div.style.top = (sd.initY - STONE_H / 2) + 'px';
            div.style.width = STONE_W + 'px'; div.style.height = STONE_H + 'px';
            div.style.animation = `stoneFlyIn 0.65s cubic-bezier(0.34,1.45,0.64,1) ${sd.delay}s both`;
            gameBox.appendChild(div);

            const lbl = document.createElement('div');
            lbl.className = 'stone-label'; lbl.textContent = sd.label;
            lbl.style.left = (sd.initX - 20) + 'px'; lbl.style.top = (sd.initY + STONE_H / 2 + 6) + 'px';
            lbl.id = 'lbl-' + sd.id; gameBox.appendChild(lbl);

            if (!sd.locked) attachStoneDrag(div, sd);
        });
    }

    function attachStoneDrag(div, sd) {
        div.addEventListener('pointerdown', (e) => {
            if (sd.placed || sd.locked || phase !== 1) return;
            e.stopPropagation(); div.setPointerCapture(e.pointerId);
            div.style.transition = 'none'; div.style.zIndex = '500';

            const rect = gameBox.getBoundingClientRect();
            const startL = parseFloat(div.style.left); const startT = parseFloat(div.style.top);
            const offsetX = e.clientX - rect.left - startL; const offsetY = e.clientY - rect.top - startT;

            function onMove(ev) {
                const newL = ev.clientX - rect.left - offsetX; const newT = ev.clientY - rect.top - offsetY;
                div.style.left = Math.max(0, Math.min(900 - STONE_W, newL)) + 'px'; div.style.top = Math.max(0, Math.min(600 - STONE_H, newT)) + 'px';
                const cx = parseFloat(div.style.left) + STONE_W / 2; const cy = parseFloat(div.style.top) + STONE_H / 2;
                if (Math.hypot(cx - sd.snap.x, cy - sd.snap.y) < STONE_SNAP_R * 1.8) { div.style.filter = 'drop-shadow(0 0 8px rgba(232,184,75,0.7))'; } 
                else { div.style.filter = ''; }
            }
            function onUp() {
                div.removeEventListener('pointermove', onMove); div.style.zIndex = '310';
                div.style.transition = 'filter 0.3s ease, opacity 0.5s ease'; div.style.filter = '';
                const cx = parseFloat(div.style.left) + STONE_W / 2; const cy = parseFloat(div.style.top) + STONE_H / 2;
                if (Math.hypot(cx - sd.snap.x, cy - sd.snap.y) < STONE_SNAP_R) snapStone(div, sd);
            }
            div.addEventListener('pointermove', onMove); div.addEventListener('pointerup', onUp, { once: true });
        });
    }

    function snapStone(div, sd) {
        sd.placed = true;
        div.style.transition = 'left 0.18s ease, top 0.18s ease, filter 0.3s';
        div.style.left = (sd.snap.x - STONE_W / 2) + 'px'; div.style.top = (sd.snap.y - STONE_H / 2) + 'px';
        div.classList.add('placed', 'snap-glow');
        div.style.filter = 'drop-shadow(0 0 10px rgba(255,215,0,0.9)) drop-shadow(0 0 24px rgba(255,170,0,0.55))';
        div.style.transform = 'scale(1.18)'; setTimeout(() => { div.style.transition = 'transform 0.25s ease, filter 0.6s'; div.style.transform = 'scale(1)'; }, 120);

        const ring = document.getElementById('ring-' + sd.id); if (ring) ring.classList.add('filled');
        const lbl = document.getElementById('lbl-' + sd.id); if (lbl) lbl.style.opacity = '0';

        if (sd.id === 'stone-key') { setTimeout(() => triggerWin(), 420); return; }
        
        const leftSD = STONE_DATA.find(s => s.id === 'stone-left'); const rightSD = STONE_DATA.find(s => s.id === 'stone-right'); const keySD = STONE_DATA.find(s => s.id === 'stone-key');
        if (leftSD.placed && rightSD.placed && !keySD.placed) { setTimeout(() => unlockKeystone(keySD), 400); }
    }

    function unlockKeystone(keySD) {
        keySD.locked = false;
        const div = document.getElementById('stone-key'); if (!div) return;
        div.classList.remove('disabled'); div.style.opacity = '1'; div.style.cursor = 'grab'; div.style.pointerEvents = 'auto';
        div.classList.add('keystone-unlocked'); div.addEventListener('animationend', () => div.classList.remove('keystone-unlocked'), { once: true });
        const lbl = document.getElementById('lbl-stone-key'); if (lbl) { lbl.style.color = 'rgba(232,184,75,0.85)'; lbl.style.transition = 'color 0.4s'; }
        phase2Banner.textContent = '现可放置龙门石 · 合龙成桥';
        attachStoneDrag(div, keySD);
    }

    function triggerWin() {
        if (isSolved) return;
        isSolved = true; phase = 2; clearTimeout(clearTimer);

        magicArcReal.classList.remove('blueprint');
        magicArcSvg.style.stroke = '#ffd700'; magicArcSvg.style.strokeWidth = '32'; magicArcSvg.style.strokeLinecap = 'butt'; magicArcSvg.style.strokeDasharray = 'none';
        magicArcSvg.style.strokeDashoffset= '0'; magicArcSvg.style.filter = 'drop-shadow(0 0 20px rgba(255,215,0,1)) drop-shadow(0 0 40px rgba(255,170,0,0.8))';
        magicArcSvg.style.transition = 'stroke 1s ease, filter 1s ease';

        phase2Banner.style.opacity = '0';
        STONE_DATA.forEach(sd => { const lbl = document.getElementById('lbl-' + sd.id); if (lbl) { lbl.style.opacity = '0'; } });

        gameBox.classList.add('solved'); waterBox.classList.add('is-clear');
        moon.style.pointerEvents = 'none'; lotus.style.pointerEvents = 'none'; bell.style.pointerEvents = 'none';
        setTimeout(() => winLevel2(), 1200);
    }
    setVar('--water-y', 450); setVar('--lotus-x', 150); setVar('--moon-y',  200);
}

function winLevel2() {
    const dialogBox = document.getElementById('lu-dialog');
    if (dialogBox) {
        dialogBox.innerText = "鲁师傅：妙哉！虚实合璧，水月交辉，石桥天降！你已勘破这造物幻境的玄机，速速前往下一关！";
    }
    const nextBtn = document.getElementById('btn-next-level2');
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
    }
}