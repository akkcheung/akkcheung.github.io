import { saveGameResult } from '../data.js';

const target = document.getElementById('target');
const reactionTimeSpan = document.getElementById('reaction-time');
const countdownEl = document.getElementById('countdown');

let startTime;
let timeoutId;

function startCountdown() {
    let count = 5;
    countdownEl.textContent = count;
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.textContent = '';
            initGame();
        }
    }, 1000);
}

function initGame() {
    reactionTimeSpan.textContent = '...';
    target.classList.remove('active');

    const colors = ['red', 'green', 'orange', 'yellow', 'blue', 'violet'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const randomDelay = Math.random() * 3000 + 1000; // 1-4 seconds

    timeoutId = setTimeout(() => {
        target.style.backgroundColor = randomColor;
        target.classList.add('active');
        startTime = new Date().getTime();
    }, randomDelay);
}

function handleClick() {
    if (startTime) {
        const endTime = new Date().getTime();
        const reactionTime = endTime - startTime;
        reactionTimeSpan.textContent = `${reactionTime}ms`;
        saveGameResult('reaction', 1, reactionTime);
        startTime = null;
        target.classList.remove('active');
        startCountdown(); // Start next round
    } else {
        clearTimeout(timeoutId);
        alert('You clicked too early!');
        startCountdown(); // Start next round
    }
}

target.addEventListener('click', handleClick);

startCountdown();