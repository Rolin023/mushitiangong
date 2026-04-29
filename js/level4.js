const l4SvgStrings = {
    player: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#d49a36" stroke="#fff3e0" stroke-width="2"/><circle cx="20" cy="20" r="8" fill="#ffecb3"/><path d="M 20 6 L 20 10 M 20 30 L 20 34 M 6 20 L 10 20 M 30 20 L 34 20" stroke="#fff3e0" stroke-width="2" stroke-linecap="round"/></svg>`,
    hanbaiyu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="6" y="22" width="28" height="10" fill="#f8f9fa" stroke="#cfd8dc" stroke-width="1"/><rect x="10" y="14" width="20" height="8" fill="#ffffff" stroke="#cfd8dc" stroke-width="1"/><path d="M 8 22 L 32 22 L 30 14 L 10 14 Z" fill="#e9ecef" stroke="#cfd8dc"/><line x1="12" y1="26" x2="28" y2="26" stroke="#e0e0e0" stroke-width="1"/></svg>`,
    jinsinanmu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="12" y="4" width="16" height="32" rx="2" fill="#d32f2f"/><rect x="14" y="4" width="4" height="32" fill="#ef5350" opacity="0.6"/><line x1="12" y1="8" x2="28" y2="8" stroke="#ffb300" stroke-width="2"/><line x1="12" y1="32" x2="28" y2="32" stroke="#ffb300" stroke-width="2"/></svg>`,
    sunmao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="8" y="18" width="24" height="8" fill="#ffb300" stroke="#f57f17" stroke-width="1"/><rect x="16" y="10" width="8" height="20" fill="#ffca28" stroke="#f57f17" stroke-width="1"/><rect x="18" y="18" width="4" height="8" fill="#f57f17"/></svg>`,
    zhuhongwuwa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M 6 24 Q 20 10 34 24" fill="none" stroke="#ff8f00" stroke-width="4" stroke-linecap="round"/><path d="M 6 28 Q 20 14 34 28" fill="none" stroke="#ffca28" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="28" r="3" fill="#ff8f00"/></svg>`,
    fake1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M 8 26 Q 12 12 20 16 T 32 26 L 30 32 L 10 32 Z" fill="#9e9e9e" stroke="#616161" stroke-width="2"/><path d="M 14 18 L 18 24 L 16 30 M 22 20 L 26 28 M 10 28 L 14 26" fill="none" stroke="#424242" stroke-width="1"/></svg>`,
    fake2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="15" y="6" width="10" height="28" rx="1" fill="#795548"/><ellipse cx="20" cy="14" rx="2" ry="4" fill="#5d4037"/><ellipse cx="18" cy="24" rx="1" ry="3" fill="#5d4037"/><path d="M 16 10 Q 18 12 16 14 M 24 20 Q 22 22 24 24" fill="none" stroke="#5d4037"/></svg>`,
    fake3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="6" y="16" width="28" height="6" fill="#8d6e63" stroke="#5d4037"/><rect x="14" y="8" width="6" height="24" fill="#a1887f" stroke="#5d4037"/><circle cx="17" cy="19" r="2.5" fill="#cfd8dc" stroke="#455a64" stroke-width="1"/><circle cx="10" cy="19" r="2" fill="#cfd8dc" stroke="#455a64" stroke-width="1"/><circle cx="30" cy="19" r="2" fill="#cfd8dc" stroke="#455a64" stroke-width="1"/></svg>`,
    fake4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M 8 20 L 32 20" fill="none" stroke="#78909c" stroke-width="4"/><path d="M 8 26 L 32 26" fill="none" stroke="#90a4ae" stroke-width="4"/><line x1="14" y1="18" x2="14" y2="28" stroke="#546e7a" stroke-width="2"/><line x1="26" y1="18" x2="26" y2="28" stroke="#546e7a" stroke-width="2"/></svg>`
};

const l4Textures = {};
let l4ImagesLoaded = false;

const materialSlotMap = {
    hanbaiyu: { slot: 'inv-base', name: '汉白玉须弥座', desc: '皇家大殿之基' },
    jinsinanmu: { slot: 'inv-column', name: '金丝楠木', desc: '立柱网之良材' },
    sunmao: { slot: 'inv-dougong', name: '榫卯大木', desc: '斗拱承托之用' },
    zhuhongwuwa: { slot: 'inv-roof', name: '黄琉璃瓦', desc: '皇家重檐御瓦' }
};

const fakeMaterialNames = {
    fake1: '粗糙麻石',
    fake2: '普通松木',
    fake3: '铁钉铁条',
    fake4: '青灰板瓦'
};

const L4_TILE_SIZE = 40;
const L4_MAP_COLS = 15;
const L4_MAP_ROWS = 15;
const L4_CANVAS_W = L4_TILE_SIZE * L4_MAP_COLS;
const L4_CANVAS_H = L4_TILE_SIZE * L4_MAP_ROWS;
const L4_PLAYER_RADIUS = 14;
const L4_MOVE_SPEED = 3.2;

const l4BaseMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,1,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,1,1,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,0,1,0,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let l4WallMap = [];
let l4TrueMaterials = [];
let l4FalseMaterials = [];
let l4TrueCollectedCount = 0;
let l4Player = { x: 0, y: 0, gridRow: 13, gridCol: 2 };
let l4MazeActive = false;
let l4GameWin = false;
let l4Canvas;
let l4Ctx;
let l4AnimTime = 0;
let l4CollectEffects = [];
let l4AnimId = null;
let l4LastFrameTime = 0;

let l4Keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    W: false,
    A: false,
    S: false,
    D: false
};

function setupL4CanvasDpr() {
    if (!l4Canvas) return;

    /*
        macOS Retina 屏幕 DPR 通常是 2。
        这里把 canvas 内部分辨率提高，避免第四关迷宫在 Mac 上发糊。
    */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    l4Canvas.width = L4_CANVAS_W * dpr;
    l4Canvas.height = L4_CANVAS_H * dpr;

    l4Canvas.style.width = '420px';
    l4Canvas.style.height = '420px';

    l4Ctx = l4Canvas.getContext('2d');
    l4Ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function loadL4Textures() {
    if (l4ImagesLoaded) return;

    for (let key in l4SvgStrings) {
        let img = new Image();
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(l4SvgStrings[key]);
        l4Textures[key] = img;
    }

    l4ImagesLoaded = true;
}

function initLevel4Maze() {
    loadL4Textures();

    l4Canvas = document.getElementById('l4GameCanvas');
    if (!l4Canvas) return;

    setupL4CanvasDpr();

    l4WallMap = JSON.parse(JSON.stringify(l4BaseMap));

    l4TrueMaterials = [
        { type: "hanbaiyu", row: 1, col: 1, collected: false },
        { type: "jinsinanmu", row: 1, col: 13, collected: false },
        { type: "zhuhongwuwa", row: 11, col: 1, collected: false },
        { type: "sunmao", row: 13, col: 13, collected: false }
    ];

    l4FalseMaterials = [
        { type: "fake1", row: 4, col: 6, collected: false },
        { type: "fake2", row: 8, col: 8, collected: false },
        { type: "fake3", row: 3, col: 11, collected: false },
        { type: "fake4", row: 11, col: 10, collected: false }
    ];

    l4TrueCollectedCount = 0;
    l4GameWin = false;
    l4MazeActive = true;
    l4CollectEffects = [];
    l4AnimTime = 0;

    l4Player.gridRow = 13;
    l4Player.gridCol = 2;
    l4Player.x = l4Player.gridCol * L4_TILE_SIZE + L4_TILE_SIZE / 2;
    l4Player.y = l4Player.gridRow * L4_TILE_SIZE + L4_TILE_SIZE / 2;

    for (let k in l4Keys) {
        l4Keys[k] = false;
    }

    document.querySelectorAll('.inv-slot').forEach(slot => {
        slot.classList.remove('collected');

        if (slot.id === 'inv-base') slot.innerHTML = "待收集: 须弥座真材";
        if (slot.id === 'inv-column') slot.innerHTML = "待收集: 柱网真材";
        if (slot.id === 'inv-dougong') slot.innerHTML = "待收集: 斗拱真材";
        if (slot.id === 'inv-roof') slot.innerHTML = "待收集: 屋顶真材";
    });

    if (l4AnimId) {
        cancelAnimationFrame(l4AnimId);
        l4AnimId = null;
    }

    l4LastFrameTime = performance.now();
    l4AnimId = requestAnimationFrame(l4GameLoop);
}

document.addEventListener('keydown', (e) => {
    if (!l4MazeActive) return;

    if (l4Keys.hasOwnProperty(e.key)) {
        l4Keys[e.key] = true;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (l4Keys.hasOwnProperty(e.key)) {
        l4Keys[e.key] = false;
    }
});

function checkL4Collisions() {
    const px = l4Player.x;
    const py = l4Player.y;
    const threshold = L4_PLAYER_RADIUS + 15;

    for (let i = 0; i < l4TrueMaterials.length; i++) {
        const mat = l4TrueMaterials[i];

        if (
            !mat.collected &&
            Math.hypot(
                px - (mat.col * L4_TILE_SIZE + L4_TILE_SIZE / 2),
                py - (mat.row * L4_TILE_SIZE + L4_TILE_SIZE / 2)
            ) < threshold
        ) {
            mat.collected = true;
            l4TrueCollectedCount++;

            l4CollectEffects.push({
                x: px,
                y: py,
                color: '#FFD700',
                size: 25,
                life: 1.0,
                maxLife: 1.0
            });

            const slotInfo = materialSlotMap[mat.type];
            const slot = document.getElementById(slotInfo.slot);

            if (slot) {
                slot.innerHTML = `<img src="${l4Textures[mat.type].src}" style="width:24px; height:24px; vertical-align:middle; margin-right:8px; filter: drop-shadow(0 0 4px #FFD700);"> <span>${slotInfo.name}</span>`;
                slot.classList.add('collected');
            }

            const dialogBox = document.getElementById('lu-dialog');
            if (dialogBox) {
                dialogBox.innerText = `鲁师傅：好眼力！此乃真材【${slotInfo.name}】。`;
            }

            if (l4TrueCollectedCount >= 4 && !l4GameWin) {
                l4GameWin = true;
                l4MazeActive = false;

                setTimeout(() => {
                    if (typeof playDynamicStory === 'function') {
                        playDynamicStory([
                            {
                                name: "鲁大师",
                                avatar: "assets/盛装鲁师傅.png",
                                bg: typeof getCurrentSceneBg === 'function' ? getCurrentSceneBg() : "assets/b4.jpg",
                                text: "太和殿四大真材皆已集齐！金光破开迷雾，吉时已到，随老夫前往太和殿主理营建！"
                            }
                        ], () => {
                            nextScene('scene-level4-build');
                        });
                    }
                }, 800);
            }

            break;
        }
    }

    for (let i = 0; i < l4FalseMaterials.length; i++) {
        const mat = l4FalseMaterials[i];

        if (
            !mat.collected &&
            Math.hypot(
                px - (mat.col * L4_TILE_SIZE + L4_TILE_SIZE / 2),
                py - (mat.row * L4_TILE_SIZE + L4_TILE_SIZE / 2)
            ) < threshold
        ) {
            mat.collected = true;

            l4CollectEffects.push({
                x: px,
                y: py,
                color: '#d32f2f',
                size: 25,
                life: 1.0,
                maxLife: 1.0
            });

            l4MazeActive = false;

            if (typeof playDynamicStory === 'function') {
                playDynamicStory([
                    {
                        name: "鲁大师",
                        avatar: "assets/盛装鲁师傅.png",
                        bg: typeof getCurrentSceneBg === 'function' ? getCurrentSceneBg() : "assets/b4.jpg",
                        text: `糊涂！你捡到了劣质的【${fakeMaterialNames[mat.type]}】！此等俗物怎可用于皇家重地？仔细在迷雾中辨别形状，不可再错！`
                    }
                ], () => {
                    l4MazeActive = true;

                    for (let k in l4Keys) {
                        l4Keys[k] = false;
                    }
                });
            }

            break;
        }
    }
}

function l4CollideWall(newX, newY) {
    const r = L4_PLAYER_RADIUS;

    const checkPoints = [
        { x: newX - r, y: newY - r },
        { x: newX + r, y: newY - r },
        { x: newX - r, y: newY + r },
        { x: newX + r, y: newY + r },
        { x: newX, y: newY }
    ];

    for (let p of checkPoints) {
        const col = Math.floor(p.x / L4_TILE_SIZE);
        const row = Math.floor(p.y / L4_TILE_SIZE);

        if (row < 0 || row >= L4_MAP_ROWS || col < 0 || col >= L4_MAP_COLS) {
            return true;
        }

        if (l4WallMap[row][col] === 1) {
            return true;
        }
    }

    return false;
}

function updateL4Movement(dt = 1) {
    let dx = 0;
    let dy = 0;

    if (l4Keys.ArrowUp || l4Keys.w || l4Keys.W) dy -= 1;
    if (l4Keys.ArrowDown || l4Keys.s || l4Keys.S) dy += 1;
    if (l4Keys.ArrowLeft || l4Keys.a || l4Keys.A) dx -= 1;
    if (l4Keys.ArrowRight || l4Keys.d || l4Keys.D) dx += 1;

    if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);

        /*
            关键优化：
            乘以 dt 后，不同刷新率的 Windows / macOS 速度基本一致。
        */
        dx = dx / len * L4_MOVE_SPEED * dt;
        dy = dy / len * L4_MOVE_SPEED * dt;

        if (!l4CollideWall(l4Player.x + dx, l4Player.y)) {
            l4Player.x += dx;
        }

        if (!l4CollideWall(l4Player.x, l4Player.y + dy)) {
            l4Player.y += dy;
        }

        l4Player.gridCol = Math.floor(l4Player.x / L4_TILE_SIZE);
        l4Player.gridRow = Math.floor(l4Player.y / L4_TILE_SIZE);

        l4Player.x = Math.min(Math.max(l4Player.x, L4_PLAYER_RADIUS), L4_CANVAS_W - L4_PLAYER_RADIUS);
        l4Player.y = Math.min(Math.max(l4Player.y, L4_PLAYER_RADIUS), L4_CANVAS_H - L4_PLAYER_RADIUS);
    }

    checkL4Collisions();
}

function drawL4Maze(dt = 1) {
    if (!l4Ctx) return;

    l4Ctx.clearRect(0, 0, L4_CANVAS_W, L4_CANVAS_H);

    for (let row = 0; row < L4_MAP_ROWS; row++) {
        for (let col = 0; col < L4_MAP_COLS; col++) {
            if (l4WallMap[row][col] === 1) {
                const x = col * L4_TILE_SIZE;
                const y = row * L4_TILE_SIZE;

                l4Ctx.fillStyle = '#5c412b';
                l4Ctx.fillRect(x + 2, y + 2, L4_TILE_SIZE - 4, L4_TILE_SIZE - 4);

                l4Ctx.fillStyle = '#3e291a';
                l4Ctx.fillRect(x + 4, y + 4, L4_TILE_SIZE - 8, L4_TILE_SIZE - 8);

                l4Ctx.strokeStyle = '#1f130b';
                l4Ctx.lineWidth = 2;
                l4Ctx.strokeRect(x + 1, y + 1, L4_TILE_SIZE - 2, L4_TILE_SIZE - 2);
            }
        }
    }

    const currentTime = l4AnimTime;

    l4TrueMaterials.forEach((mat, index) => {
        if (mat.collected) return;

        const x = mat.col * L4_TILE_SIZE + L4_TILE_SIZE / 2;
        const y = mat.row * L4_TILE_SIZE + L4_TILE_SIZE / 2;
        const drawY = y + Math.sin((currentTime + index * 0.5) * 3) * 2;

        l4Ctx.save();

        if (Math.sin((currentTime + index * 0.5) * 5) > 0.7) {
            l4Ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
            l4Ctx.shadowBlur = 15;
        }

        if (l4Textures[mat.type]) {
            l4Ctx.drawImage(l4Textures[mat.type], x - 14, drawY - 14, 28, 28);
        }

        l4Ctx.restore();
    });

    l4FalseMaterials.forEach((mat, index) => {
        if (mat.collected) return;

        const x = mat.col * L4_TILE_SIZE + L4_TILE_SIZE / 2;
        const y = mat.row * L4_TILE_SIZE + L4_TILE_SIZE / 2;
        const drawY = y + Math.sin((currentTime + index * 0.5 + 1) * 2) * 1.5;

        l4Ctx.save();

        if (Math.sin((currentTime + index * 0.5 + 1) * 4) > 0.5) {
            l4Ctx.shadowColor = 'rgba(211, 47, 47, 0.7)';
            l4Ctx.shadowBlur = 10;
        }

        if (l4Textures[mat.type]) {
            l4Ctx.drawImage(l4Textures[mat.type], x - 14, drawY - 14, 28, 28);
        }

        l4Ctx.restore();
    });

    for (let i = l4CollectEffects.length - 1; i >= 0; i--) {
        const eff = l4CollectEffects[i];

        if (eff.life <= 0) {
            l4CollectEffects.splice(i, 1);
            continue;
        }

        l4Ctx.save();
        l4Ctx.globalAlpha = eff.life;
        l4Ctx.fillStyle = eff.color;
        l4Ctx.beginPath();
        l4Ctx.arc(eff.x, eff.y, eff.size * (1 - eff.life / eff.maxLife), 0, Math.PI * 2);
        l4Ctx.fill();
        l4Ctx.restore();

        eff.life -= 0.05 * dt;
    }

    const px = l4Player.x;
    const py = l4Player.y;

    l4Ctx.save();
    l4Ctx.shadowColor = '#e8b84b';
    l4Ctx.shadowBlur = 18;

    if (l4Textures.player) {
        l4Ctx.drawImage(l4Textures.player, px - 16, py - 16, 32, 32);
    }

    l4Ctx.restore();

    l4Ctx.save();
    l4Ctx.globalCompositeOperation = 'source-over';

    const fogGrad = l4Ctx.createRadialGradient(px, py, 45, px, py, 160);
    fogGrad.addColorStop(0, 'rgba(25, 15, 8, 0)');
    fogGrad.addColorStop(0.5, 'rgba(25, 15, 8, 0.75)');
    fogGrad.addColorStop(1, 'rgba(15, 8, 4, 0.98)');

    l4Ctx.fillStyle = fogGrad;
    l4Ctx.fillRect(0, 0, L4_CANVAS_W, L4_CANVAS_H);
    l4Ctx.restore();
}

function l4GameLoop(timestamp) {
    const deltaTime = l4LastFrameTime ? timestamp - l4LastFrameTime : 1000 / 60;
    l4LastFrameTime = timestamp;

    if (deltaTime > 100 || document.hidden) {
        l4AnimId = requestAnimationFrame(l4GameLoop);
        return;
    }

    const dt = Math.min(deltaTime, 50) / (1000 / 60);

    if (l4MazeActive && !l4GameWin) {
        updateL4Movement(dt);
    }

    l4AnimTime += 0.05 * dt;
    drawL4Maze(dt);

    l4AnimId = requestAnimationFrame(l4GameLoop);
}

let builtParts = [];
const requiredOrder = ['base', 'column', 'dougong', 'roof'];

function initLevel4Build() {
    if (typeof stopL4MicDetection === 'function') {
        stopL4MicDetection(false);
    }

    if (l4AnimId) {
        cancelAnimationFrame(l4AnimId);
        l4AnimId = null;
    }

    builtParts = [];

    document.querySelectorAll('.palace-btn').forEach(btn => {
        btn.style.display = 'block';
    });

    document.querySelectorAll('.p-part').forEach(part => {
        part.classList.add('hidden');
    });

    const speechBtn = document.getElementById('btn-speech');
    const nextBtn = document.getElementById('btn-next-level4');

    if (speechBtn) {
        speechBtn.classList.add('hidden');
        speechBtn.innerText = "🎤 发声完成封顶";
        speechBtn.disabled = false;
        speechBtn.style.opacity = '';
        speechBtn.style.cursor = '';
    }

    if (nextBtn) {
        nextBtn.classList.add('hidden');
    }
}

function stackPalace(part) {
    const dialogBox = document.getElementById('lu-dialog');
    const expectedPart = requiredOrder[builtParts.length];

    if (builtParts.includes(part)) return;

    if (part !== expectedPart) {
        if (dialogBox) {
            dialogBox.innerText = `鲁师傅：胡闹！当前应先安置【${getPartName(expectedPart)}】！`;
        }
        return;
    }

    const partEl = document.getElementById('p-' + part);
    const btnEl = document.getElementById('btn-stack-' + part);

    if (partEl) {
        partEl.classList.remove('hidden');
    }

    builtParts.push(part);

    if (btnEl) {
        btnEl.style.display = 'none';
    }

    if (dialogBox) {
        dialogBox.innerText = `鲁师傅：好！【${getPartName(part)}】已稳稳就位。`;
    }

    if (builtParts.length === 4) {
        const speechBtn = document.getElementById('btn-speech');

        if (speechBtn) {
            speechBtn.classList.remove('hidden');
            speechBtn.innerText = "🎤 发声完成封顶";
            speechBtn.disabled = false;
            speechBtn.style.opacity = '';
            speechBtn.style.cursor = '';
        }

        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：皇宫木构已成！点击麦克风并允许权限，发出任意声音，以成封顶之礼！";
        }
    }
}

function getPartName(part) {
    const names = {
        base: '汉白玉须弥座',
        column: '朱红柱网',
        dougong: '踩斗拱',
        roof: '重檐庑殿顶'
    };

    return names[part];
}

let l4MicDetecting = false;
let l4MicStream = null;
let l4AudioContext = null;
let l4Analyser = null;
let l4MicAnimationId = null;
let l4SoundConfirmFrames = 0;
let l4MicListenStartTime = 0;

const L4_SOUND_RMS_THRESHOLD = 0.025;
const L4_SOUND_PEAK_THRESHOLD = 0.14;
const L4_SOUND_CONFIRM_FRAMES = 4;
const L4_MIC_LISTEN_TIMEOUT = 15000;

function setL4MicButtonState(isListening) {
    const speechBtn = document.getElementById('btn-speech');

    if (!speechBtn) return;

    if (isListening) {
        speechBtn.disabled = true;
        speechBtn.innerText = "🎧 正在听声...";
        speechBtn.style.opacity = "0.75";
        speechBtn.style.cursor = "not-allowed";
    } else {
        speechBtn.disabled = false;
        speechBtn.innerText = "🎤 发声完成封顶";
        speechBtn.style.opacity = "";
        speechBtn.style.cursor = "";
    }
}

function stopL4MicDetection(resetButton = true) {
    l4MicDetecting = false;

    if (l4MicAnimationId) {
        cancelAnimationFrame(l4MicAnimationId);
        l4MicAnimationId = null;
    }

    if (l4MicStream) {
        l4MicStream.getTracks().forEach(track => track.stop());
        l4MicStream = null;
    }

    if (l4AudioContext && l4AudioContext.state !== 'closed') {
        l4AudioContext.close().catch(() => {});
    }

    l4AudioContext = null;
    l4Analyser = null;
    l4SoundConfirmFrames = 0;
    l4MicListenStartTime = 0;

    if (resetButton) {
        setL4MicButtonState(false);
    }
}

function getL4AudioLevel(dataArray) {
    let sum = 0;
    let peak = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const value = (dataArray[i] - 128) / 128;
        const absValue = Math.abs(value);

        sum += value * value;

        if (absValue > peak) {
            peak = absValue;
        }
    }

    const rms = Math.sqrt(sum / dataArray.length);

    return { rms, peak };
}

async function startSpeechRecognition() {
    const dialogBox = document.getElementById('lu-dialog');

    if (l4MicDetecting) {
        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：麦克风已经开启了。无需说固定词句，只要发出任意清楚声音即可！";
        }
        return;
    }

    const isLocalhost =
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1' ||
        location.hostname === '[::1]';

    if (!window.isSecureContext && !isLocalhost) {
        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：此法需在 HTTPS 或 localhost 环境下启用麦克风。请换成安全地址后再试。";
        }
        return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：此浏览器无法启用麦克风。请换用支持麦克风权限的现代浏览器。";
        }
        return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：此浏览器无法检测声音强弱。请换用支持 Web Audio 的浏览器。";
        }
        return;
    }

    l4MicDetecting = true;
    l4SoundConfirmFrames = 0;
    setL4MicButtonState(true);

    if (dialogBox) {
        dialogBox.innerText = "鲁师傅：请在弹窗中允许麦克风权限。启用后，发出任意声音即可完成封顶礼！";
    }

    try {
        l4MicStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        l4AudioContext = new AudioContextClass();

        if (l4AudioContext.state === 'suspended') {
            await l4AudioContext.resume();
        }

        const source = l4AudioContext.createMediaStreamSource(l4MicStream);

        l4Analyser = l4AudioContext.createAnalyser();
        l4Analyser.fftSize = 2048;
        l4Analyser.smoothingTimeConstant = 0.15;

        source.connect(l4Analyser);

        const dataArray = new Uint8Array(l4Analyser.fftSize);

        l4MicListenStartTime = performance.now();

        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：麦克风已启！无需识别字句，只要发出任意清楚声音即可封顶。";
        }

        function listenForSound() {
            if (!l4MicDetecting || !l4Analyser) return;

            l4Analyser.getByteTimeDomainData(dataArray);

            const level = getL4AudioLevel(dataArray);

            const soundDetected =
                level.rms >= L4_SOUND_RMS_THRESHOLD ||
                level.peak >= L4_SOUND_PEAK_THRESHOLD;

            if (soundDetected) {
                l4SoundConfirmFrames++;
            } else {
                l4SoundConfirmFrames = Math.max(0, l4SoundConfirmFrames - 1);
            }

            if (l4SoundConfirmFrames >= L4_SOUND_CONFIRM_FRAMES) {
                if (dialogBox) {
                    dialogBox.innerText = "鲁师傅：声响入云，吉气已至！封顶礼成！";
                }

                stopL4MicDetection(false);
                triggerGoldenEffect();
                return;
            }

            if (performance.now() - l4MicListenStartTime > L4_MIC_LISTEN_TIMEOUT) {
                if (dialogBox) {
                    dialogBox.innerText = "鲁师傅：麦克风已启，但声音太轻或太远。请再点击一次，并靠近麦克风发声。";
                }

                stopL4MicDetection(true);
                return;
            }

            l4MicAnimationId = requestAnimationFrame(listenForSound);
        }

        l4MicAnimationId = requestAnimationFrame(listenForSound);

    } catch (err) {
        console.error("第四关麦克风启用或声音检测失败：", err);

        stopL4MicDetection(true);

        const errName = err && err.name ? err.name : "";

        if (dialogBox) {
            if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
                dialogBox.innerText = "鲁师傅：你未允许麦克风权限。请重新点击按钮，并在浏览器弹窗中选择允许。";
            } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
                dialogBox.innerText = "鲁师傅：未找到可用麦克风。请检查设备后再试。";
            } else {
                dialogBox.innerText = "鲁师傅：麦克风暂未启用成功。请检查浏览器权限或刷新后再试。";
            }
        }
    }
}

function triggerGoldenEffect() {
    const dialogBox = document.getElementById('lu-dialog');
    const buildScene = document.getElementById('scene-level4-build');
    const nextBtn = document.getElementById('btn-next-level4');
    const speechBtn = document.getElementById('btn-speech');

    if (typeof stopL4MicDetection === 'function') {
        stopL4MicDetection(false);
    }

    if (speechBtn) {
        speechBtn.classList.add('hidden');
    }

    const oldEffectLayer = document.getElementById('golden-effect-layer');
    if (oldEffectLayer) {
        oldEffectLayer.remove();
    }

    if (buildScene) {
        buildScene.classList.add('golden-finish');

        setTimeout(() => {
            buildScene.classList.remove('golden-finish');
        }, 2200);
    }

    if (dialogBox) {
        dialogBox.innerText = "鲁师傅：金光万丈，瑞彩千条！太和殿封顶礼成，你已得天下营造之大成！";
    }

    setTimeout(() => {
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
        }
    }, 1200);
}