const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');

// Example lyrics with timestamps in seconds
const lyrics = [
    { time: 0, text: "我向你禱告" },
    { time: 15, text: "你是我神，是我的依傍，" },
    { time: 23, text: "在我無助困苦中，你在細聽察看；"},
    { time: 30, text: "是我磐石與拯救，是我高臺與詩歌，"},
    { time: 37, text: "你體恤我，你保守我。"},
    { time: 44, text: "你是我神，是我的依傍，"},
    { time: 53, text: "在我無助困苦中，你在細聽察看；"},
    { time: 60, text: "是我能力與保障，是我盾牌與幫助，"},
    { time: 69, text: "你應許我，你在掌舵。"},

    { time: 74, text: "我向你禱告縱使我軟弱，我雖失信你仍然可信，"},
    { time: 89, text: "面對的山嶺那麼高，路徑艱難如沒去路，"},
    { time: 98, text: "但信靠你，你定會開路。"},
    { time: 104, text: "向世界宣告你是我盼望，我心相信靠著你得勝，"},
    { time: 119, text: "讓你的手替我爭戰，奉你的名成就美事，一心倚靠你遵行你旨意。"},
    { time: 146, text: "你是我神，是我的依傍，" },
    { time: 153, text: "在我無助困苦中，你在細聽察看；" },
    { time: 161, text: "是我能力與保障，是我盾牌與幫助，" },
    { time: 169, text: "你應許我，你在掌舵。" },

    { time: 175, text: "我向你禱告縱使我軟弱，我雖失信你仍然可信，" },
    { time: 191, text: "面對的山嶺那麼高，路徑艱難如沒去路，" },
    { time: 199, text: "但信靠你，你定會開路。" },
    { time: 205, text: "向世界宣告你是我盼望，我心相信靠著你得勝，" },
    { time: 220, text: "讓你的手替我爭戰，奉你的名成就美事，" },
    { time: 228, text: "一心倚靠你遵行你旨意。" },

    { time: 247, text: "我看著眾山嶺， 吩咐它們挪開，在你並沒有難成的事；" },
    { time: 261, text: "你教導我禱告，要帶著信心宣告，相信你定會聽到。" },
    { time: 276, text: "我看著眾山嶺， 吩咐它們挪開，在你並沒有難成的事；" },
    { time: 291, text: "你教導我禱告，要帶著權柄宣告，相信你定會聽到。" },

    { time: 308, text: "向世界宣告你是我盼望，我心相信靠著你得勝，" },
    { time: 324, text: "讓你的手替我爭戰，奉你的名成就美事，" },
    { time: 332, text: "一心倚靠你遵行你旨意。一心倚靠你神蹟必可看見。" },
    { time: 352, text: "讓你的手替我爭戰，奉你的名成就美事，" },
    { time: 361, text: "只想看見，我只想看見你旨意彰顯。" },

    // Add more lines as needed
];

let currentLine = 0;

audio.addEventListener('timeupdate', () => {
    if (currentLine < lyrics.length && audio.currentTime >= lyrics[currentLine].time) {
        lyricsContainer.innerText = lyrics[currentLine].text;
        currentLine++;
    }
});

audio.addEventListener('ended', () => {
    currentLine = 0; // Reset when the song ends
});
