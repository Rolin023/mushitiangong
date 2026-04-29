const API_KEY = 'sk-xlikhrxedrvktgqlxsthjcemjxdsnldsrgeedxjssjlnuult';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL_NAME = 'deepseek-ai/DeepSeek-R1';

const SYSTEM_PROMPT = `你叫鲁师傅，是中国古代经验丰富的都料匠（总建筑师）。
当前你的徒弟（玩家）正在体验一个营造游戏，包含四关，当徒弟提问时，请根据以下【关卡具体机制】进行指导：
1. 民居布局（九宫格拖拽）：大门在下中，天井在正中，正厅在上中。卧房/厢房在侧，厨房/水井在角落。
2. 水月镜花建桥：上下拖动【月亮】对齐水位，左右拖动【荷叶】对齐水中桥影（变黄即对齐）。对齐后【敲钟】凝固水面，最后拖拽安放【左拱石】、【右拱石】和【龙门石】。
3. 官府修缮：左右移动主角接掉落的【青砖灰瓦】，绝不能碰犯忌讳的【黄琉璃瓦】。
4. 皇宫营建：先在迷宫用WASD寻找发金光的四大真材，避开泛红光的假材；找齐后按“须弥座->柱网->斗拱->庑殿顶”顺序搭建，最后点击麦克风发出清楚声音完成封顶礼。
【严格约束】：
1. 只回答与上述四关操作或中国古建相关的问题，古代建筑相关问题都可以回复。若问及无关话题严厉训斥。日常问候可以回答。
2. 不要直接给出完整傻瓜式答案，可以一步步引导。请以师傅考教徒弟的口吻，给出一句符合当前关卡机制的隐晦提示。
3. 你的回答必须极其简短精炼，坚决控制在80个字以内！`;

let conversationHistory = [
    { role: 'system', content: SYSTEM_PROMPT }
];

let luShifuThinking = false;
async function callLLM(messages) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: messages,
            temperature: 0.7,
            max_tokens: 150
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! 状态码: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
function isLevel4Active() {
    return (
        document.getElementById('scene-level4-maze')?.classList.contains('active') ||
        document.getElementById('scene-level4-build')?.classList.contains('active')
    );
}

function getLuAvatarSrc() {
    return isLevel4Active()
        ? 'assets/盛装鲁师傅.png'
        : 'assets/鲁师傅.png';
}

function getPlayerAvatarSrc() {
    return isLevel4Active()
        ? 'assets/大师主角.png'
        : 'assets/主角.png';
}

function cleanSpeakerPrefix(text) {
    return String(text || '')
        .replace(/^\s*(鲁师傅|鲁大师)[：:]\s*/g, '')
        .replace(/^\s*(主角|徒儿)[：:]\s*/g, '')
        .trim();
}

function scrollLuChatToBottom() {
    const box = document.getElementById('lu-dialog');

    if (!box) return;

    requestAnimationFrame(() => {
        box.scrollTop = box.scrollHeight;
    });

    setTimeout(() => {
        box.scrollTop = box.scrollHeight;
    }, 0);
}

function installLuInnerTextHook(box) {
    if (!box || box.dataset.innerTextHooked === '1') return;

    const nativeDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');

    Object.defineProperty(box, 'innerText', {
        configurable: true,

        get() {
            if (nativeDescriptor && typeof nativeDescriptor.get === 'function') {
                return nativeDescriptor.get.call(box);
            }

            return box.textContent;
        },

        set(value) {
            const text = String(value || '').trim();

            if (!text) return;

            addLuMessage(text);
        }
    });

    box.dataset.innerTextHooked = '1';
}

function ensureLuChatBox() {
    const box = document.getElementById('lu-dialog');

    if (!box) return null;

    box.classList.add('chat-box');

    if (box.dataset.chatReady !== '1') {
        const initialText = box.textContent.trim();

        box.innerHTML = '';
        box.dataset.chatReady = '1';

        installLuInnerTextHook(box);

        if (initialText) {
            addLuMessage(initialText);
        }
    } else {
        installLuInnerTextHook(box);
    }

    return box;
}

function createChatMessage(sender, text, options = {}) {
    const box = ensureLuChatBox();

    if (!box) return null;

    const isUser = sender === 'user';

    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${isUser ? 'user' : 'lu'}`;

    if (options.thinking) {
        messageEl.classList.add('thinking');
    }

    const avatar = document.createElement('img');
    avatar.className = 'chat-avatar';
    avatar.src = isUser ? getPlayerAvatarSrc() : getLuAvatarSrc();
    avatar.alt = isUser ? '主角' : '鲁师傅';

    const content = document.createElement('div');
    content.className = 'chat-content';

    const name = document.createElement('div');
    name.className = 'chat-name';
    name.textContent = isUser ? '主角' : '鲁师傅';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = isUser
        ? String(text || '').trim()
        : cleanSpeakerPrefix(text);

    content.appendChild(name);
    content.appendChild(bubble);

    messageEl.appendChild(avatar);
    messageEl.appendChild(content);

    box.appendChild(messageEl);
    scrollLuChatToBottom();

    return messageEl;
}

function updateChatMessage(messageEl, text) {
    if (!messageEl) return;

    const bubble = messageEl.querySelector('.chat-bubble');

    if (!bubble) return;

    bubble.textContent = cleanSpeakerPrefix(text);
    messageEl.classList.remove('thinking');

    scrollLuChatToBottom();
}

function addLuMessage(text, options = {}) {
    return createChatMessage('lu', text, options);
}

function addUserMessage(text) {
    return createChatMessage('user', text);
}

function clearLuChat() {
    const box = ensureLuChatBox();

    if (!box) return;

    box.innerHTML = '';
}
function setLuDialogText(text) {
    return addLuMessage(text);
}

function formatLuReply(reply) {
    const text = String(reply || '').trim();

    if (!text) {
        return '老夫一时无言，你且再问得明白些。';
    }

    return cleanSpeakerPrefix(text);
}

async function askLuShifu() {
    const inputEl = document.getElementById('ai-input');

    if (!inputEl) return;

    ensureLuChatBox();

    if (luShifuThinking) {
        addLuMessage('莫急，老夫正在思量上一问。');
        return;
    }

    const userText = inputEl.value.trim();

    if (!userText) {
        if (typeof showDefaultHint === 'function') {
            showDefaultHint();
        } else {
            addLuMessage('徒儿，遇到难处尽可问老夫。');
        }

        return;
    }

    const sendBtn = inputEl.parentElement
        ? inputEl.parentElement.querySelector('button')
        : null;

    inputEl.value = '';

    addUserMessage(userText);

    const thinkingMsg = addLuMessage('且容老夫思索一会，为你掐算片刻……', {
        thinking: true
    });

    luShifuThinking = true;

    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerText = '思量中';
    }

    conversationHistory.push({
        role: 'user',
        content: userText
    });

    try {
        const aiReply = await callLLM(conversationHistory);

        conversationHistory.push({
            role: 'assistant',
            content: aiReply
        });

        if (conversationHistory.length > 9) {
            conversationHistory.splice(1, 2);
        }

        updateChatMessage(thinkingMsg, formatLuReply(aiReply));

    } catch (error) {
        console.error('AI 聊天接口请求失败:', error);

        updateChatMessage(
            thinkingMsg,
            '哎呀，老夫今日偶感风寒，脑子有些转不过弯来。'
        );

        conversationHistory.pop();

    } finally {
        luShifuThinking = false;

        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerText = '请教';
        }

        inputEl.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ensureLuChatBox();

    const inputEl = document.getElementById('ai-input');

    if (!inputEl) return;

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
            e.preventDefault();
            askLuShifu();
        }
    });
});

async function getLayoutScore(prompt) {
    try {
        const tempHistory = [
            {
                role: 'system',
                content: '你是古代都料匠鲁师傅。请根据徒弟的布置直接进行风水或布局打分和严厉点评，指出对错即可，限50字。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        return await callLLM(tempHistory);

    } catch (error) {
        console.error('AI 打分接口请求失败:', error);
        return null;
    }
}