const colors = ['red', 'yellow', 'green', 'blue', 'orange', 'pink'];
const messages = [
    // 1. 紅色軟糖 (葉欣)
    "葉欣：Dear崇傑～這是我第二次祝崇傑生日快樂了!!! 您是很棒很棒的主管，找了很多可愛的同事，我們像第二到第三季的鬼殺隊，祝福生日快樂、明年旅遊不用再關心辦公室新人!!!",
    
    // 2. 黃色軟糖 (薇雲)
    "薇雲：崇傑生日快樂~很感謝第一份工作遇到很讚讚的主管！願你每天都和小熊軟糖一樣繽紛多彩，去日本都能訂到最便宜的住宿~",
    
    // 3. 綠色軟糖 (采瑾)
    "采瑾：生日快樂～～謝謝崇傑平常的照顧！生日這天就不用減肥了，可以吃小熊軟糖吃到飽！",
    
    // 4. 藍色軟糖 (嘉琳)
    "嘉琳：崇傑生日快樂！🎉 感謝你一直以來的幫助，讓我們在工作中能更有方向地前進~祝福你新的一年順心順利、身體健康，你是我們最喜歡的主管~",
    
    // 5. 橘色軟糖 (玉瑄)
    "玉瑄：崇傑生日快樂 ㊗️你身體健康、平安順心、大展鴻圖，願您在新的一歲天天開心",
    
    // 6. 粉色軟糖 (亭妤)
    "亭妤：崇傑！雖然才進來一個月，但你真的是個很好的主管！超棒的 祝你生日大快樂🎉以後一樣要麻煩你了！最後最後～我會努力跟大家一起奮鬥的💪"
];

let clickedCount = 0;
const totalGummies = 6;
const smallGummyCount = 80;
let musicPlayed = false; // 新增：用於標記音樂是否已播放 (解決瀏覽器自動播放限制)

// ... [createSmallGummy 函數保持不變] ...

// --- 階段 1 & 2: 初始爆發與散落 (保持不變) ---
function createSmallGummy() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 20 + 10; // 10px 到 30px
    const gummy = document.createElement('div');
    gummy.className = `gummy small-gummy ${color}`;
    gummy.style.width = `${size}px`;
    gummy.style.height = `${size * 1.3}px`;
    document.getElementById('app').appendChild(gummy);
    return gummy;
}

function startInitialAnimation() {
    const initialGummy = document.getElementById('initial-gummy');
    const smallGummies = [];

    for (let i = 0; i < smallGummyCount; i++) {
        smallGummies.push(createSmallGummy());
    }

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });

    tl
    .to(initialGummy, { scale: 1.2, duration: 0.2, ease: "power1.inOut" }, 2) 
    .to(initialGummy, { opacity: 0, scale: 0.1, duration: 0.1 }, "<") 

    .to(smallGummies, {
        duration: 2,
        x: () => (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: () => (Math.random() - 0.5) * window.innerHeight * 1.5,
        rotation: () => Math.random() * 360,
        scale: () => Math.random() * 0.5 + 0.5,
        ease: "power3.out",
        stagger: 0.01,
        onComplete: startMergeAnimation
    }, "<0.1");
}

// --- 階段 3: 合體成六顆主軟糖 (更新：呼叫點擊提示) ---
function startMergeAnimation() {
    const smallGummies = document.querySelectorAll('.small-gummy');
    const mainContainer = document.getElementById('main-gummies-container');

    const mainGummies = colors.map((color, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'main-gummy';
        wrapper.id = `gummy-${index}`;
        wrapper.setAttribute('data-clicked', 'false');

        const gummyShape = document.createElement('div');
        gummyShape.className = `gummy ${color}`;
        
        const messageBox = document.createElement('div');
        messageBox.className = 'gummy-message';
        messageBox.innerHTML = messages[index].replace(/\n/g, '<br>');

        wrapper.appendChild(gummyShape);
        wrapper.appendChild(messageBox);
        mainContainer.appendChild(wrapper);

        wrapper.addEventListener('click', handleGummyClick);
        return wrapper;
    });

    gsap.to(smallGummies, {
        duration: 1.5,
        opacity: 0,
        scale: 0.1,
        x: () => (Math.random() - 0.5) * 200, 
        y: () => (Math.random() - 0.5) * 200,
        ease: "power2.in", 
        stagger: 0.005,
        onComplete: () => {
            smallGummies.forEach(g => g.remove());
            
            gsap.fromTo(mainGummies, { scale: 0.5, opacity: 0 }, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)", 
                stagger: 0.1,
                onComplete: showClickPrompt // <--- 新增：顯示點擊提示
            });
        }
    });
}

// --- 新增：顯示點擊提示動畫 ---
function showClickPrompt() {
    gsap.to("#click-prompt", {
        opacity: 1,
        scale: 1.1,
        duration: 0.8,
        repeat: -1, // 無限循環
        yoyo: true, // 往返動畫
        ease: "power1.inOut"
    });
}

// --- 新增：音樂播放邏輯 (需由使用者點擊後觸發) ---
function startMusic() {
    if (musicPlayed) return;
    const music = document.getElementById('birthday-music');
    if (music) {
        music.play().then(() => {
            musicPlayed = true;
        }).catch(error => {
            console.warn("Audio autoplay blocked by browser. Music will not play until a second user interaction.");
        });
    }
}

// --- 階段 4: 處理點擊與祝福語展示 (更新：加入音樂觸發) ---
function handleGummyClick(event) {
    const gummyWrapper = event.currentTarget;
    const messageBox = gummyWrapper.querySelector('.gummy-message');
    const isClicked = gummyWrapper.getAttribute('data-clicked') === 'true';
    
    // 嘗試在第一次點擊時播放音樂 (繞過瀏覽器自動播放限制)
    startMusic();

    if (isClicked) return;

    // ... [軟糖彈跳動畫] ...
    gsap.to(gummyWrapper.querySelector('.gummy'), {
        scale: 1.15,
        rotation: 5,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
        ease: "power1.out"
    });

    // ... [祝福語氣泡彈出] ...
    gsap.to(messageBox, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
    });
    
    gummyWrapper.setAttribute('data-clicked', 'true');
    clickedCount++;

    // 檢查是否全部點擊
    if (clickedCount === totalGummies) {
        showFinalMessage();
    }
}

// --- 階段 5: 最終彩蛋 (更新：隱藏點擊提示) ---
function showFinalMessage() {
    const finalMessage = document.getElementById('final-message');
    const mainGummies = document.querySelectorAll('.main-gummy');
    const clickPrompt = document.getElementById('click-prompt');

    // 1. 隱藏主軟糖和點擊提示
    gsap.to([clickPrompt, mainGummies], { // <--- 隱藏點擊提示
        opacity: 0, 
        scale: 0.5, 
        duration: 0.5,
        ease: "power1.in"
    });

    // 2. 文字柔和出現 (模擬軟糖聚合)
    gsap.to(finalMessage, {
        opacity: 1,
        scale: 1.05,
        duration: 2,
        ease: "power2.out", 
        delay: 0.5,
        onComplete: () => {
             gsap.to(finalMessage, {
                opacity: 0.8,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
             });
        }
    });
}

document.addEventListener('DOMContentLoaded', startInitialAnimation);
