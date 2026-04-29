let l3Score = 0;
let l3GameRunning = false;
let l3AnimationId = null;
let tiles = [];
let playerX = 50;
let l3LastSpawnTime = 0;
let l3LastFrameTime = 0;
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    a: false,
    d: false,
    A: false,
    D: false
};
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        if (l3GameRunning && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});
function startLevel3Game() {
    const dialogBox = document.getElementById('lu-dialog');

    if (dialogBox) {
        dialogBox.innerText = "鲁师傅：快用键盘【A/D】或【左右方向键】移动！务必接住合乎礼制的【青砖灰瓦】，千万别碰【黄琉璃瓦】！";
    }

    const startBtn = document.getElementById('btn-start-l3-game');
    if (startBtn) {
        startBtn.classList.add('hidden');
    }
    const nextBtn = document.getElementById('btn-next-level3');
    if (nextBtn) {
        nextBtn.classList.add('hidden');
        nextBtn.style.position = '';
        nextBtn.style.top = '';
        nextBtn.style.left = '';
        nextBtn.style.transform = '';
        nextBtn.style.zIndex = '';
        nextBtn.style.margin = '';
        nextBtn.style.whiteSpace = '';
        nextBtn.style.pointerEvents = '';
    }

    l3Score = 0;
    playerX = 50;
    updateL3Score();

    l3GameRunning = true;
    tiles = [];

    document.querySelectorAll('.falling-tile').forEach(t => t.remove());
    l3LastSpawnTime = performance.now();
    l3LastFrameTime = performance.now();

    l3AnimationId = requestAnimationFrame(l3GameLoop);
}
function spawnTile() {
    if (!l3GameRunning) return;
    const container = document.getElementById('falling-game-container');
    if (!container) return;
    const tile = document.createElement('div');
    tile.className = 'falling-tile';
    const isGood = Math.random() > 0.4;
    tile.dataset.type = isGood ? 'good' : 'bad';
    const svgGood = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M12 52 Q 32 10 52 52 Z" fill="%23607D8B" stroke="%2337474F" stroke-width="3"/><rect x="10" y="52" width="44" height="6" rx="3" fill="%23455A64" stroke="%2337474F" stroke-width="2"/><path d="M24 52 Q 32 25 40 52" fill="none" stroke="%2390A4AE" stroke-width="3" stroke-linecap="round"/></svg>`;

    const svgBad = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M12 52 Q 32 10 52 52 Z" fill="%23FFCA28" stroke="%23F57F17" stroke-width="3"/><rect x="10" y="52" width="44" height="6" rx="3" fill="%23FFB300" stroke="%23F57F17" stroke-width="2"/><path d="M24 52 Q 32 25 40 52" fill="none" stroke="%23FFE082" stroke-width="3" stroke-linecap="round"/></svg>`;

    tile.style.backgroundImage = `url('${isGood ? svgGood : svgBad}')`;
    tile.style.backgroundSize = 'contain';
    tile.style.backgroundRepeat = 'no-repeat';
    tile.style.backgroundPosition = 'center';

    tile.style.position = 'absolute';
    tile.style.top = '-60px';
    tile.style.left = (Math.random() * 80 + 10) + '%';
    tile.style.width = '50px';
    tile.style.height = '50px';
    tile.style.zIndex = '10';

    container.appendChild(tile);

    tiles.push({
        el: tile,
        y: -60,
        speed: Math.random() * 1.5 + 1
    });
}
function l3GameLoop(timestamp) {
    if (!l3GameRunning) return;

    let deltaTime = timestamp - l3LastFrameTime;
    l3LastFrameTime = timestamp;

    if (deltaTime > 100 || document.hidden) {
        l3LastSpawnTime += deltaTime;
        l3AnimationId = requestAnimationFrame(l3GameLoop);
        return;
    }

    if (timestamp - l3LastSpawnTime > 1100) {
        spawnTile();
        l3LastSpawnTime = timestamp;
    }

    const player = document.getElementById('l3-player');
    const container = document.getElementById('falling-game-container');

    if (!player || !container) return;

    let moveSpeed = 0.9;

    if (keys.ArrowLeft || keys.a || keys.A) {
        playerX -= moveSpeed;
    }

    if (keys.ArrowRight || keys.d || keys.D) {
        playerX += moveSpeed;
    }

    playerX = Math.max(10, Math.min(90, playerX));
    player.style.left = playerX + '%';

    const playerRect = player.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    for (let i = tiles.length - 1; i >= 0; i--) {
        let t = tiles[i];

        t.y += t.speed;
        t.el.style.top = t.y + 'px';

        const tileRect = t.el.getBoundingClientRect();

        if (isColliding(playerRect, tileRect)) {
            if (t.el.dataset.type === 'good') {
                l3Score++;
                showFloatingText(t.el.style.left, t.y, '+1', '#4caf50');
            } else {
                l3Score = Math.max(0, l3Score - 1);
                showFloatingText(t.el.style.left, t.y, '-1', '#f44336');
            }

            updateL3Score();

            t.el.remove();
            tiles.splice(i, 1);

            checkL3Win();

        } else if (t.y > containerRect.height) {
            t.el.remove();
            tiles.splice(i, 1);
        }
    }

    if (l3GameRunning) {
        l3AnimationId = requestAnimationFrame(l3GameLoop);
    }
}

function isColliding(rect1, rect2) {
    const padding = 15;

    return !(
        rect1.right - padding < rect2.left + padding ||
        rect1.left + padding > rect2.right - padding ||
        rect1.bottom - padding < rect2.top + padding ||
        rect1.top + padding > rect2.bottom - padding
    );
}

function updateL3Score() {
    const scoreEl = document.getElementById('l3-score');
    if (scoreEl) {
        scoreEl.innerText = l3Score;
    }
}

function checkL3Win() {
    if (l3Score >= 10) {
        l3GameRunning = false;

        for (let key in keys) {
            keys[key] = false;
        }

        const dialogBox = document.getElementById('lu-dialog');
        if (dialogBox) {
            dialogBox.innerText = "鲁师傅：善哉！10块青砖灰瓦收集齐了！府衙的逾制之灾总算化解，徒儿，咱们去皇城！";
        }

        tiles.forEach(t => t.el.remove());
        tiles = [];
        const nextBtn = document.getElementById('btn-next-level3');
        const container = document.getElementById('falling-game-container');

        if (nextBtn) {
            if (container && nextBtn.parentElement !== container) {
                container.appendChild(nextBtn);
            }

            nextBtn.classList.remove('hidden');

            nextBtn.style.position = 'absolute';
            nextBtn.style.top = '50%';
            nextBtn.style.left = '50%';
            nextBtn.style.transform = 'translate(-50%, -50%)';
            nextBtn.style.zIndex = '40';
            nextBtn.style.margin = '0';
            nextBtn.style.whiteSpace = 'nowrap';
            nextBtn.style.pointerEvents = 'auto';
        }
    }
}

function showFloatingText(left, top, text, color) {
    const container = document.getElementById('falling-game-container');
    if (!container) return;

    const floatEl = document.createElement('div');

    floatEl.innerText = text;
    floatEl.style.position = 'absolute';
    floatEl.style.left = left;
    floatEl.style.top = top + 'px';
    floatEl.style.color = color;
    floatEl.style.fontWeight = '900';
    floatEl.style.fontSize = '30px';
    floatEl.style.zIndex = '20';
    floatEl.style.pointerEvents = 'none';
    floatEl.style.textShadow = '2px 2px 0px #fff';
    floatEl.style.animation = 'floatUpAndFade 1s forwards';

    container.appendChild(floatEl);

    setTimeout(() => floatEl.remove(), 1000);
}