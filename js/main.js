let bgmHasStarted = false;
let bgmIsPriming = false;
let bgmPrimeDone = false;
let gameHasEntered = false;

const BGM_DEFAULT_VOLUME = 30;


const BGM_START_OFFSET = 0;

function getBgmAudio() {
    return document.getElementById('global-bgm');
}

function getBgmVolumePercent() {
    const volumeSlider = document.getElementById('bgm-volume');

    if (!volumeSlider) {
        return BGM_DEFAULT_VOLUME;
    }

    const volume = Number(volumeSlider.value);

    if (!Number.isFinite(volume)) {
        return BGM_DEFAULT_VOLUME;
    }

    return Math.max(0, Math.min(100, volume));
}

function applyBgmVolumeFromSlider() {
    const bgm = getBgmAudio();
    const volumeValue = document.getElementById('bgm-volume-value');
    const volume = getBgmVolumePercent();

    if (bgm) {
        bgm.volume = volume / 100;
        bgm.muted = volume === 0;
    }

    if (volumeValue) {
        volumeValue.innerText = volume + '%';
    }
}

function setBgmStartPosition() {
    const bgm = getBgmAudio();

    if (!bgm) return;

    const offset = Math.max(0, Number(BGM_START_OFFSET) || 0);

    const doSeek = function() {
        try {
            if (Math.abs(bgm.currentTime - offset) > 0.03) {
                if (typeof bgm.fastSeek === 'function') {
                    bgm.fastSeek(offset);
                } else {
                    bgm.currentTime = offset;
                }
            }
        } catch (e) {
            console.warn('BGM 设置起播位置失败：', e);
        }
    };

    if (bgm.readyState >= 1) {
        doSeek();
    } else {
        bgm.addEventListener('loadedmetadata', doSeek, { once: true });
    }
}

function preloadBgm() {
    const bgm = getBgmAudio();

    if (!bgm) return;

    try {
        bgm.preload = 'auto';
        bgm.load();
    } catch (e) {
        console.warn('BGM 预加载失败：', e);
    }
}

function warmUpBgmSilently() {
    const bgm = getBgmAudio();

    if (!bgm || bgmHasStarted || bgmIsPriming || bgmPrimeDone) return;

    bgmIsPriming = true;

    const finishWarmUp = function() {
        if (bgmHasStarted) {
            bgmIsPriming = false;
            bgmPrimeDone = true;
            return;
        }

        try {
            bgm.pause();
        } catch (e) {
            console.warn('BGM 预热暂停失败：', e);
        }

        setBgmStartPosition();
        applyBgmVolumeFromSlider();

        bgmIsPriming = false;
        bgmPrimeDone = true;
    };

    try {
        bgm.muted = true;
        bgm.volume = 0;

        preloadBgm();

        const playPromise = bgm.play();

        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(function() {
                    setTimeout(finishWarmUp, 80);
                })
                .catch(function(error) {
                    bgmIsPriming = false;
                    applyBgmVolumeFromSlider();
                    preloadBgm();

                    console.warn('BGM 静音预热被浏览器阻止，点击开始时仍会播放：', error);
                });
        } else {
            setTimeout(finishWarmUp, 80);
        }

    } catch (e) {
        bgmIsPriming = false;
        applyBgmVolumeFromSlider();
        preloadBgm();

        console.warn('BGM 静音预热失败：', e);
    }
}

function setMusicPanelOpen(isOpen) {
    const settingsBtn = document.getElementById('music-settings-btn');
    const settingsPanel = document.getElementById('music-settings-panel');

    if (!settingsBtn || !settingsPanel) return;

    settingsPanel.classList.toggle('hidden', !isOpen);
    settingsPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    settingsBtn.classList.toggle('active', isOpen);
    settingsBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMusicSettingsPanel() {
    setMusicPanelOpen(false);
}

function initBgmControls() {
    const bgm = getBgmAudio();
    const settingsRoot = document.getElementById('music-settings');
    const settingsBtn = document.getElementById('music-settings-btn');
    const settingsPanel = document.getElementById('music-settings-panel');
    const volumeSlider = document.getElementById('bgm-volume');
    const volumeValue = document.getElementById('bgm-volume-value');

    if (!bgm || !volumeSlider) return;

    volumeSlider.value = String(BGM_DEFAULT_VOLUME);
    bgm.volume = BGM_DEFAULT_VOLUME / 100;
    bgm.muted = false;

    if (volumeValue) {
        volumeValue.innerText = BGM_DEFAULT_VOLUME + '%';
    }

    if (settingsPanel) {
        settingsPanel.classList.add('hidden');
        settingsPanel.setAttribute('aria-hidden', 'true');
    }

    if (settingsBtn) {
        settingsBtn.classList.remove('active');
        settingsBtn.setAttribute('aria-expanded', 'false');
    }

    if (settingsRoot) {
        [
            'click',
            'mousedown',
            'mouseup',
            'pointerdown',
            'pointerup',
            'touchstart',
            'touchend'
        ].forEach(eventName => {
            settingsRoot.addEventListener(eventName, function(e) {
                e.stopPropagation();
            });
        });
    }

    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();

            const isCurrentlyHidden = settingsPanel.classList.contains('hidden');
            setMusicPanelOpen(isCurrentlyHidden);
        });
    }

    volumeSlider.addEventListener('input', function(e) {
        e.stopPropagation();

        applyBgmVolumeFromSlider();

        const bgm = getBgmAudio();
        const volume = getBgmVolumePercent();

        if (bgmHasStarted && bgm && bgm.paused && volume > 0) {
            playBgm(false);
        }
    });

    preloadBgm();
    warmUpBgmSilently();
}

function playBgm(restart = false) {
    const bgm = getBgmAudio();

    if (!bgm) return;

    bgmHasStarted = true;
    applyBgmVolumeFromSlider();

    if (restart) {
        setBgmStartPosition();
    }

    const playPromise = bgm.play();

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function(error) {
            console.warn('浏览器阻止了播放，需要玩家点击后才能播放 BGM：', error);
        });
    }
}

function pauseBgm() {
    const bgm = getBgmAudio();

    if (!bgm) return;

    bgm.pause();
}

function resumeBgmIfNeeded() {
    const bgm = getBgmAudio();

    if (
        bgmHasStarted &&
        bgm &&
        bgm.paused &&
        !bgm.muted &&
        bgm.volume > 0
    ) {
        playBgm(false);
    }
}

document.addEventListener('DOMContentLoaded', initBgmControls);

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        resumeBgmIfNeeded();
    }
});

function enterGame(event) {
   
    if (event) {
        if (
            event.type === 'pointerdown' &&
            typeof event.button === 'number' &&
            event.button !== 0
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    if (gameHasEntered) return;

    gameHasEntered = true;

 
    playBgm(true);

    startIntroStory();
}

function typeWriterEffect() {
    var introText = document.getElementById('intro-text');
    var btnStart = document.getElementById('btn-start');

    if (!introText || !btnStart) return;

    var text = "江南水乡，一卷古旧的竹简在师傅手中轻轻展开。|踏上千年造物之路，历经万家万户，终成京城栋梁...";
    var i = 0;

    function typing() {
        if (i < text.length) {
            var char = text.charAt(i);

            if (char === '|') {
                introText.innerHTML += "<br>";
            } else {
                introText.innerHTML += char;
            }

            i++;

            setTimeout(typing, 80);
        } else {
            btnStart.style.opacity = "1";
            btnStart.style.pointerEvents = "auto";
        }
    }

    typing();
}

function getCurrentSceneBg() {
    var l1 = document.getElementById('scene-level1');
    var l2 = document.getElementById('scene-level2');
    var l3 = document.getElementById('scene-level3');
    var l4Maze = document.getElementById('scene-level4-maze');
    var l4Build = document.getElementById('scene-level4-build');

    if (l1 && l1.classList.contains('active')) return "assets/b1.jpg";
    if (l2 && l2.classList.contains('active')) return "assets/b2.jpg";
    if (l3 && l3.classList.contains('active')) return "assets/b3.jpg";

    if (
        (l4Maze && l4Maze.classList.contains('active')) ||
        (l4Build && l4Build.classList.contains('active'))
    ) {
        return "assets/b4.jpg";
    }

    return "assets/b0.jpg";
}
function pushLuMessage(text) {
    if (typeof addLuMessage === 'function') {
        addLuMessage(text);
        return;
    }

    var dialogBox = document.getElementById('lu-dialog');

    if (dialogBox) {
        dialogBox.innerText = text;
    }
}
function updateLuHeaderAvatar(targetSceneId) {
    var avatarImg = document.getElementById('npc-header-lu-img');

    if (!avatarImg) return;

    var isLevel4 =
        targetSceneId === 'scene-level4-maze' ||
        targetSceneId === 'scene-level4-build';

    if (isLevel4) {
        avatarImg.src = 'assets/盛装鲁师傅.png';
        avatarImg.alt = '盛装鲁师傅头像';
    } else {
        avatarImg.src = 'assets/鲁师傅.png';
        avatarImg.alt = '鲁师傅头像';
    }
}
function showDefaultHint() {
    if (typeof resumeBgmIfNeeded === 'function') {
        resumeBgmIfNeeded();
    }

    var hintText = "鲁师傅：徒儿，造物非止于形，更在于与天地同心，与人事相和。遇到难处尽可问老夫！";

    var l1 = document.getElementById('scene-level1');
    var l2 = document.getElementById('scene-level2');
    var l3 = document.getElementById('scene-level3');
    var l4Maze = document.getElementById('scene-level4-maze');
    var l4Build = document.getElementById('scene-level4-build');

    if (l1 && l1.classList.contains('active')) {
        hintText = "鲁师傅：盖屋遮风不可无章法。徒儿，大门宜居中迎阳，正厅压后显庄重，私密起居与水井火患分列两侧。用九宫之法布阵吧！";
    } else if (l2 && l2.classList.contains('active')) {
        hintText = "鲁师傅：洪水猛若虎狼，不可硬抗强弩。徒儿，拨弄水月对齐虚实，敲响铜钟破境！用巨石叠起‘敞肩拱’，让水流穿过副拱便可固若金汤！";
    } else if (l3 && l3.classList.contains('active')) {
        hintText = "鲁师傅：匠心亦需服膺礼法。天子居所方用黄琉璃，府衙若用便是死罪！你快去接取合乎规矩的【青灰瓦】，切忌碰触【黄琉璃】！";
    } else if (
        (l4Maze && l4Maze.classList.contains('active')) ||
        (l4Build && l4Build.classList.contains('active'))
    ) {
        hintText = "鲁师傅：徒儿，这太和殿乃国之大重！快去木厂迷宫探寻，避开死角里的假材劣木，将汉白玉、金丝楠、大木与朱瓦这四样真材集齐！";
    }

    pushLuMessage(hintText);
}
function startIntroStory() {
    playStory('intro', function() {
        nextScene('scene-level1');
    });
}

function nextScene(targetSceneId) {
    var scenes = document.querySelectorAll('.scene');

    scenes.forEach(function(scene) {
        scene.classList.remove('active');
        scene.classList.add('hidden');
    });

    var storyKey = null;

    if (targetSceneId === 'scene-level1') storyKey = 'level1';
    if (targetSceneId === 'scene-level2') storyKey = 'level2';
    if (targetSceneId === 'scene-level3') storyKey = 'level3';
    if (targetSceneId === 'scene-level4-maze') storyKey = 'level4';
    if (targetSceneId === 'scene-outro') storyKey = 'outro';

    if (storyKey && typeof playStory === 'function') {
        playStory(storyKey, function() {
            showSceneAndUpdateAI(targetSceneId);
        });
    } else {
        showSceneAndUpdateAI(targetSceneId);
    }
}

function finishLevel(currentLevelStr, targetSceneId) {
    var endStoryKey = currentLevelStr + '_end';

    if (typeof playStory === 'function') {
        playStory(endStoryKey, function() {
            nextScene(targetSceneId);
        });
    } else {
        nextScene(targetSceneId);
    }
}

function showSceneAndUpdateAI(targetSceneId) {
    var targetScene = document.getElementById(targetSceneId);

    if (targetScene) {
        targetScene.classList.remove('hidden');
        targetScene.classList.add('active');
    }
    updateLuHeaderAvatar(targetSceneId);

    var npcUI = document.getElementById('npc-lu-shifu');

    if (targetSceneId === 'scene-intro' || targetSceneId === 'scene-outro') {
        if (npcUI) npcUI.classList.add('hidden');
    } else {
        if (npcUI) npcUI.classList.remove('hidden');

        switch (targetSceneId) {
            case 'scene-level1':
                pushLuMessage("鲁大师：快看左侧，将九宫图纸上的构件拖入安居之位。");
                break;

            case 'scene-level2':
                pushLuMessage("鲁大师：拨弄水面莲叶对齐月影，敲钟破境安放巨石！");
                break;

            case 'scene-level3':
                pushLuMessage("鲁大师：点击【开始游戏】！左右滑动，只接合乎礼法的青灰瓦，万不可触碰黄琉璃！");
                break;

            case 'scene-level4-maze':
                pushLuMessage("鲁大师：入迷宫辨真伪！集齐四样真材方可为主理太和殿营造。");

                if (typeof initLevel4Maze === 'function') {
                    initLevel4Maze();
                }
                break;

            case 'scene-level4-build':
                pushLuMessage("鲁大师：真材已齐！速按【自下而上】之序搭建太和殿。");

                if (typeof initLevel4Build === 'function') {
                    initLevel4Build();
                }
                break;
        }
    }
}