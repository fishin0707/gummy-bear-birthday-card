// 確保 GSAP 核心庫和 MotionPath 插件在 HTML 中已正確引入
const colors = ['red', 'yellow', 'green', 'blue', 'orange', 'pink'];
const messages = [
    // ⚠️ 確保這個祝福語陣列是完整且正確的 ⚠️
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
let musicPlayed = false;

// --- 輔助函數：生成隨機軟糖粒子 ---
function createSmallGummy() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 20 + 10;
    const gummy = document.createElement('div');
    gummy.className = `gummy small-gummy ${color}`;
    gummy.style.width = `${size}px`;
    gummy.style.height = `${size * 1.3}px`;
    document.getElementById('app').appendChild(gummy);
    return gummy;
}

// --- 階段 1 & 2: 初始爆發與散落 ---
function startInitialAnimation() {
    const initialGummy = document.getElementById('initial-gummy');
    const smallGummies = [];

    if (!initialGummy) {
        startMergeAnimation();
        return;
    }

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

// --- 階段 3: 合體成六顆主軟糖 (修復氣泡框元素創建與 z-index) ---
function startMergeAnimation() {
    const smallGummies = document.querySelectorAll('.small-gummy');
    const mainContainer = document.getElementById('main-gummies-container');

    const mainGummies = colors.map((color, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'main-gummy';
        wrapper.id = `gummy-${index}`;
        wrapper.setAttribute('data-clicked', 'false');
        // 核心修復：強制所有 Wrapper 都有獨立的高層級 (解決點擊問題)
        wrapper.style.zIndex = 100 + index; 

        // 1. 創建軟糖形狀 (用於顯示圖片)
        const gummyShape = document.createElement('div');
        gummyShape.className = `gummy ${color}`;
        
        // 2. 創建祝福語氣泡框 (關鍵修復點！)
        const messageBox = document.createElement('div');
        messageBox.className = 'gummy-message';
        messageBox.innerHTML = messages[index].replace(/\n/g, '<br>');

        // 3. 附加元素到包裹層
        wrapper.appendChild(gummyShape);
        wrapper.appendChild(messageBox); // 👈 確保 messageBox 被正確附加！
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
                onComplete: () => {
                    console.log("Gummies are ready to be clicked.");
                }
            });
        }
    });
}

// --- 音樂播放邏輯 ---
function startMusic() {
    if (musicPlayed) return;
    const music = document.getElementById('birthday-music');
    if (music) {
        music.play().then(() => {
            musicPlayed = true;
        }).catch(error => {
            console.warn("Audio autoplay blocked by browser. User needs to interact first.");
        });
    }
}

// --- 階段 4: 處理點擊與祝福語展示 (點擊修復) ---
function handleGummyClick(event) {
    const gummyWrapper = event.currentTarget;
    const messageBox = gummyWrapper.querySelector('.gummy-message');
    const isClicked = gummyWrapper.getAttribute('data-clicked', 'true');
    
    startMusic();

    // 關鍵修復：確保已經點擊的軟糖不再響應
    if (isClicked) return;

    // 點擊動畫
    gsap.timeline()
    .to(gummyWrapper.querySelector('.gummy'), {
        scale: 1.15,
        rotation: 5,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
        ease: "power1.out"
    })
    // 氣泡框彈出
    .to(messageBox, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
    }, 0);

    // 標記為已點擊
    gummyWrapper.setAttribute('data-clicked', 'true');
    clickedCount++;

    // 檢查是否所有軟糖都點完了
    if (clickedCount === totalGummies) {
        showFinalMessage();
    }
}

// --- 新增：創建並啟動額外的隨機跳動軟糖 ---
function startBouncingGummiesAnimation() {
    const bounceGummyCount = window.innerWidth <= 768 ? 15 : 30; // 手機和平板顯示數量
    const bounceRadius = window.innerWidth <= 768 ? 180 : 300; // 跳動範圍半徑
    const bouncingGummies = [];

    const ringContainer = document.getElementById('final-gummy-ring');
    if (!ringContainer) return;

    for (let i = 0; i < bounceGummyCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 40 + 20; // 軟糖大小隨機
        const gummy = document.createElement('div');
        gummy.className = `final-gummy-item bouncy-gummy`; 
        gummy.style.backgroundImage = `url('gummy-${color}.png')`;
        gummy.style.width = `${size}px`;
        gummy.style.height = `${size * 1.3}px`;
        gummy.style.left = `calc(50% + ${Math.random() * 100 - 50}px)`;
        gummy.style.top = `calc(50% + ${Math.random() * 100 - 50}px)`;
        gummy.style.opacity = 0; 
        gummy.style.zIndex = 20; 
        ringContainer.appendChild(gummy);
        bouncingGummies.push(gummy);
    }

    gsap.to(bouncingGummies, {
        opacity: 1,
        scale: () => Math.random() * 0.8 + 0.5, 
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.05,
        delay: 0.5 
    });

    bouncingGummies.forEach(gummy => {
        // 隨機跳動和漂浮動畫
        gsap.to(gummy, {
            x: () => (Math.random() - 0.5) * bounceRadius * 2, 
            y: () => (Math.random() - 0.5) * bounceRadius * 2, 
            rotation: () => Math.random() * 360 - 180, 
            scale: () => Math.random() * 0.8 + 0.8, 
            duration: () => Math.random() * 4 + 3, 
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 2 
        });
    });
}


// --- 新增：創建並啟動環繞文字的軟糖 ---
function startGummyRingAnimation() {
    const ringRadius = window.innerWidth <= 768 ? 150 : 250; 
    const ringContainer = document.getElementById('final-gummy-ring');
    const items = [];
    
    colors.forEach((color, index) => {
        const item = document.createElement('div');
        item.className = 'final-gummy-item main-ring-gummy'; 
        item.style.backgroundImage = `url('gummy-${color}.png')`;
        ringContainer.appendChild(item);
        items.push(item);
    });

    gsap.to(ringContainer, { opacity: 1, duration: 1.5, delay: 0.8 });

    gsap.to(items, {
        duration: 15,
        ease: "none",
        repeat: -1,
        stagger: {
            each: 0.2,
            repeat: -1,
            yoyo: true
        },
        motionPath: {
            path: (i) => {
                const angle = (Math.PI * 2) * (i / colors.length);
                const x = ringRadius * Math.cos(angle);
                const y = ringRadius * Math.sin(angle);
                return `M0,0 C${x/2},${y/2} ${x*1.5},${y*1.5} ${x},${y}`;
            },
            type: "rotational",
            align: "self",
            alignOrigin: [0.5, 0.5],
            autoRotate: true
        }
    });

    gsap.to(items, {
        y: "+=10",
        yoyo: true,
        repeat: -1,
        duration: 3,
        stagger: 0.5,
        ease: "sine.inOut"
    });
}


// --- 階段 5: 最終彩蛋 (更新：呼叫環繞動畫) ---
function showFinalMessage() {
    const finalMessage = document.getElementById('final-message');
    const mainGummies = document.querySelectorAll('.main-gummy');

    // 1. 隱藏所有互動元素
    gsap.to(mainGummies, {
        opacity: 0, 
        scale: 0.5, 
        duration: 0.5,
        ease: "power1.in"
    });

    // 2. 最終文字柔和出現
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
    
    // 3. 啟動主要的軟糖環繞動畫 (6顆)
    startGummyRingAnimation();
    // 4. 啟動額外隨機跳動的軟糖動畫 (更多顆)
    startBouncingGummiesAnimation();
}

document.addEventListener('DOMContentLoaded', startInitialAnimation);
