// State variables
let bibleData = []; // Start with an empty array
let currentPage = 1;
const itemsPerPage = 10;

// DOM Elements
const listContainer = document.getElementById('verse-list');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

/**
 * NEW: Fetch data from the JSON file
 */
async function loadBibleData() {
    try {
        const response = await fetch('verses.json');
        if (!response.ok) throw new Error("Could not load verses.json");
        
        bibleData = await response.json();
        
        // Only render once the data is actually here
        renderPage(currentPage);
    } catch (error) {
        listContainer.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
        console.error("Error loading JSON:", error);
    }
}

function renderPage(page) {
    listContainer.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = bibleData.slice(start, end);

    pageItems.forEach(item => {
        const card = document.createElement('article');
        card.innerHTML = `
            <header>
                <span class="category-tag">${item.category}</span>
                <hgroup>
                    <h3>${item.book}</h3>
                    <p>${item.chapter}</p>
                </hgroup>
                <!--
                <button class="outline" onclick="speakVerse('${item.bible_in_chinese}', '${item.bible_in_eng}')" style="width: auto; margin-bottom: 0;">
                    🔊 播放 (Play)
                </button>
                -->
            </header>
            <strong>${item.bible_in_chinese}</strong>
            <span class="verse-en">${item.bible_in_eng}</span>
        `;
        listContainer.appendChild(card);
    });

    updateControls();
}

function updateControls() {
    const totalPages = Math.ceil(bibleData.length / itemsPerPage);
    pageInfo.innerText = `${currentPage} / ${totalPages}`;
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === totalPages);
}

// Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(bibleData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/**
 * 朗讀功能邏輯
 */
function speakVerse(chineseText, englishText) {
    // 停止目前正在播放的聲音
    window.speechSynthesis.cancel();

    // 1. 設定中文朗讀 (zh-TW 或 zh-CN)
    const chineseUtterance = new SpeechSynthesisUtterance(chineseText);
    chineseUtterance.lang = 'zh-TW';
    chineseUtterance.rate = 0.9; // 語速稍微放慢一點點

    // 2. 設定英文朗讀 (en-US)
    const englishUtterance = new SpeechSynthesisUtterance(englishText);
    englishUtterance.lang = 'en-US';
    englishUtterance.rate = 0.9;

    // 3. 設定廣東話朗讀 (zh-HK)
    const cantoneseUtterance = new SpeechSynthesisUtterance(chineseText);
    cantoneseUtterance.lang = 'zh-HK'; // 設定為香港粵語
    cantoneseUtterance.rate = 0.9;      // 語速稍微放慢，聽得更清楚
    cantoneseUtterance.pitch = 1.0;     // 音調

    // 播放順序：先中後英
    // window.speechSynthesis.speak(chineseUtterance);
    window.speechSynthesis.speak(cantoneseUtterance);
    window.speechSynthesis.speak(englishUtterance);
}

// 播放器狀態
const player = {
    currentIndex: -1,
    isPlaying: false,
    isPaused: false,
    voices: []
};

/**
 * 朗讀單個經文的函數 (核心邏輯)
 */
function speak(text, lang, onEndCallback) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;

    if (onEndCallback) {
        utterance.onend = onEndCallback;
    }

    window.speechSynthesis.speak(utterance);
}

/**
 * 將 "13:4-7" 格式化為 "13章4至7節"
 */
function formatReference(chapterText) {
    // 使用正則表達式匹配 數字:數字-數字 或 數字:數字
    return chapterText
        .replace(/:/g, '章')      // 將冒號改為「章」
        .replace(/-/g, '至')      // 將連字號改為「至」
        + '節';                   // 最後加上「節」
}

/**
 * 播放整頁循環邏輯
 */
function playSequence(index) {
    if (!player.isPlaying || player.isPaused) return;

    // 獲取當前分頁的 10 句經文
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = bibleData.slice(start, end);

    // 如果播放到最後一句，回到第一句 (Loop)
    if (index >= pageItems.length) {
        index = 0;
    }
    player.currentIndex = index;
    const item = pageItems[index];

    // 構建朗讀內容：書卷名 + 章節 + 內容
    // const fullChineseText = `${item.book} ${item.chapter}。 ${item.bible_in_chinese}`;
    const spokenChapter = formatReference(item.chapter); 
    const fullChineseText = `${item.book}${spokenChapter}。${item.bible_in_chinese}`;

    // 執行播放順序：廣東話 -> 英文 -> 下一句
    speak(fullChineseText, 'zh-HK', () => {
        // 廣東話讀完後，讀英文
        if (!player.isPlaying || player.isPaused) return;

        speak(item.bible_in_eng, 'en-US', () => {
            // 英文讀完後，延遲 1 秒播放下一句
            if (player.isPlaying && !player.isPaused) {
                setTimeout(() => playSequence(index + 1), 1000);
            }
        });
    });
}

/**
 * 控制按鈕函數
 */
function togglePlayPause() {
    const btn = document.getElementById('playControlBtn');

    if (!player.isPlaying) {
        // 開始全新播放
        player.isPlaying = true;
        player.isPaused = false;
        btn.innerText = "⏸ 暫停播放";
        playSequence(0);
    } else if (player.isPaused) {
        // 恢復播放
        player.isPaused = false;
        btn.innerText = "⏸ 暫停播放";
        playSequence(player.currentIndex);
    } else {
        // 暫停
        player.isPaused = true;
        window.speechSynthesis.cancel();
        btn.innerText = "▶️ 恢復播放";
    }
}

function stopPlayback() {
    player.isPlaying = false;
    player.isPaused = false;
    player.currentIndex = -1;
    window.speechSynthesis.cancel();
    document.getElementById('playControlBtn').innerText = "▶️ 循環朗讀本頁";
}

// Start the process
loadBibleData();
