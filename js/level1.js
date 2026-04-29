document.addEventListener('DOMContentLoaded', () => {
    initLevel1DragAndDrop();
    initInfoButtons();
});

function initLevel1DragAndDrop() {
    const draggables = document.querySelectorAll('.layout-item');
    const dropZones  = document.querySelectorAll('.courtyard-cell, #zone-inventory');

    draggables.forEach(draggable => {
        const itemText = draggable.querySelector('.item-text');
        const infoBtn = draggable.querySelector('.info-btn');
        
        if (infoBtn) {
            infoBtn.setAttribute('draggable', 'false');
        }
        
        draggable.addEventListener('dragstart', (e) => {
            if (e.target === infoBtn) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData('text/plain', draggable.id);
            setTimeout(() => draggable.classList.add('dragging'), 0);
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (zone.classList.contains('courtyard-cell') && zone.querySelector('.layout-item')) return;
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (zone.classList.contains('courtyard-cell') && zone.querySelector('.layout-item')) return;

            const id = e.dataTransfer.getData('text/plain');
            const el = document.getElementById(id);
            if (!el) return;

            if (zone.id === 'zone-inventory') {
                const contentContainer = zone.querySelector('.items-panel-content');
                if (contentContainer) {
                    contentContainer.appendChild(el);
                } else {
                    zone.appendChild(el);
                }
            } else {
                zone.appendChild(el);
            }
            
            updateLevel1RealtimeHint();
            document.getElementById('btn-next-level1').classList.add('hidden');
        });
    });
}

function resetLevel1() {
    const inventory = document.getElementById('zone-inventory');
    const contentContainer = inventory.querySelector('.items-panel-content');
    document.querySelectorAll('.layout-item').forEach(item => {
        if (contentContainer) {
            contentContainer.appendChild(item);
        } else {
            inventory.appendChild(item);
        }
    });
    document.getElementById('btn-next-level1').classList.add('hidden');

    const dialogBox = document.getElementById('lu-dialog');
    dialogBox.innerText = '鲁师傅：院落之制，贵在前后有序，中轴分明。先安门、井、厅、院，再定起居杂用。';
}

function updateLevel1RealtimeHint() {
    const dialogBox = document.getElementById('lu-dialog');
    const count = getPlacedItems().length;

    if (count <= 2) {
        dialogBox.innerText = '鲁师傅：先看中轴。大门在前，天井居中，正厅压后，这三处是骨架，不可乱。';
    } else if (count <= 4) {
        dialogBox.innerText = '鲁师傅：已有些轮廓了。想想哪些该居中，哪些该在两翼，哪些该偏在角隅。';
    } else if (count < 7) {
        dialogBox.innerText = '鲁师傅：构件将齐。卧房与厢房宜居侧，厨房与水井宜偏下角，不可争主位。';
    } else {
        dialogBox.innerText = '鲁师傅：构件已齐。点击"请鲁师傅评定"，看你这院子是否合乎营造之理。';
    }
}

function getPlacedItems() {
    const placed = [];
    document.querySelectorAll('.courtyard-cell').forEach(cell => {
        const item = cell.querySelector('.layout-item');
        if (item) {
            placed.push({
                type : item.dataset.type,
                x    : Number(cell.dataset.x),
                y    : Number(cell.dataset.y),
            });
        }
    });
    return placed;
}

function getItemPosition(type) {
    return getPlacedItems().find(i => i.type === type) || null;
}

function evaluateCourtyard() {
    const dialogBox = document.getElementById('lu-dialog');
    const nextBtn   = document.getElementById('btn-next-level1');

    const requiredTypes = ['gate', 'hall', 'bedroom', 'wing', 'kitchen', 'patio', 'well'];
    const placed        = getPlacedItems();
    const placedTypes   = placed.map(i => i.type);
    const missing       = requiredTypes.filter(t => !placedTypes.includes(t));

    if (missing.length > 0) {
        dialogBox.innerText = `鲁师傅：院落尚未布全，还缺：${missing.map(getTypeName).join('、')}。`;
        nextBtn.classList.add('hidden');
        return;
    }

    const gate  = getItemPosition('gate');
    const hall  = getItemPosition('hall');
    const patio = getItemPosition('patio');

    const gatePass  = gate  && gate.x  === 1 && gate.y  === 2;
    const hallPass  = hall  && hall.x  === 1 && hall.y  === 0; 
    const patioPass = patio && patio.x === 1 && patio.y === 1; 

    const corePass  = gatePass && hallPass && patioPass;

    const bedroom = getItemPosition('bedroom');
    const wing    = getItemPosition('wing');
    const kitchen = getItemPosition('kitchen');
    const well    = getItemPosition('well');

    let softScore = 0;
    const softFeedback = [];

    if (bedroom && bedroom.x !== 1)          softScore++;
    else softFeedback.push('卧房不宜压中轴，宜居侧翼');

    if (wing && wing.x !== 1)               softScore++;
    else softFeedback.push('厢房宜列于两翼');

    if (kitchen && kitchen.x !== 1)         softScore++;
    else softFeedback.push('厨房宜偏处杂用位，不可占主位');

    if (well && well.x !== 1)               softScore++;
    else softFeedback.push('水井宜设于角落，不宜居中');

    if (bedroom && bedroom.y < 2)            softScore++;
    else softFeedback.push('卧房不宜压到门庭前排');

    if (wing && wing.y < 2)                 softScore++;
    else softFeedback.push('厢房不宜压到门庭前排');

    if (kitchen && well &&
        kitchen.y === 2 && well.y === 2 &&
        kitchen.x !== well.x)               softScore++;
    else softFeedback.push('厨房与水井宜分列两角');

    const totalScore = (corePass ? 3 : 0) + softScore; 

    if (!corePass) {
        const coreProblems = [];
        if (!gatePass)  coreProblems.push('大门应居前方正中（门庭入口）');
        if (!hallPass)  coreProblems.push('正厅应居后方正中（主位）');
        if (!patioPass) coreProblems.push('天井应在院落正中（院心）');

        if (coreProblems.length === 3) {
            dialogBox.innerText = '鲁师傅：你这院子主次不分，厅堂失位，哪像个安居之所？院落先看中轴——门、院、厅须成一线，气象方聚。';
        } else {
            dialogBox.innerText = `鲁师傅：大方向有误！${coreProblems.join('；')}。门、院、厅若不成一线，气象便散了。`;
        }
        nextBtn.classList.add('hidden');

    } else if (softScore < 4) {
        const hint = softFeedback.slice(0, 2).join('；');
        dialogBox.innerText = `鲁师傅：已有几分样子了，中轴骨架不错。再辨清尊卑主次，便成章法。提示：${hint}。（评分 ${totalScore}/10）`;
        nextBtn.classList.add('hidden');

    } else {
        dialogBox.innerText = `鲁师傅：不错！此院门厅有序，院心开朗，起居杂用各安其位，可谓安居之宅！（评分 ${totalScore}/10）`;
        nextBtn.classList.remove('hidden');
    }
}

function getTypeName(type) {
    const map = {
        gate    : '大门',
        hall    : '正厅',
        bedroom : '卧房',
        wing    : '厢房',
        kitchen : '厨房',
        patio   : '天井',
        well    : '水井',
    };
    return map[type] || type;
}

function getItemDescription(type) {
    const map = {
        hall    : '正厅是指一栋建筑里最主要的那个大厅，通常是举行典礼、接待贵客、商议大事的核心场所。',
        patio   : '天井是指建筑中由四面房屋或围墙围成的露天空间，主要用于采光、通风、排水，也是家庭活动的重要场所。',
        gate    : '大门是整个院落的入口，不仅具有通行功能，还象征着家庭的门面和社会地位，通常位于中轴线上。',
        bedroom : '卧房是供人睡眠休息的房间，通常安排在较为安静、私密的位置，避免直接对着大门或天井。',
        wing    : '厢房是指正房两侧的房屋，通常作为晚辈居住、客房或储物使用，在建筑等级上低于正房。',
        kitchen : '厨房是烹制食物的场所，通常安排在院落的侧面或角落，避免油烟影响主要生活区域。',
        well    : '水井是提供生活用水的设施，通常设置在院落的角落位置，既方便取水又不影响主要活动空间。',
    };
    return map[type] || '暂无介绍';
}

function initInfoButtons() {
    const infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const type = btn.dataset.type;
            showItemDesc(type);
        });
    });
}

function showItemDesc(type) {
    const popup = document.getElementById('item-desc-popup');
    const title = document.getElementById('popup-title');
    const desc = document.getElementById('popup-desc');
    
    title.textContent = getTypeName(type);
    desc.textContent = getItemDescription(type);
    
    popup.classList.remove('hidden');
}

function closeItemDesc() {
    const popup = document.getElementById('item-desc-popup');
    popup.classList.add('hidden');
}

document.addEventListener('click', (e) => {
    const popup = document.getElementById('item-desc-popup');
    if (e.target === popup) {
        closeItemDesc();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeItemDesc();
    }
});

