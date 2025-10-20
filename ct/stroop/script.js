import { saveGameResult } from '../data.js';

const wordDisplay = document.getElementById('word-display');
const colorOptions = document.getElementById('color-options');
const scoreSpan = document.getElementById('score');
const timeLeftSpan = document.getElementById('time-left');
const countdownEl = document.getElementById('countdown');

const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Orange'];
const colorMap = {
    'Red': '#ff0000',
    'Green': '#00ff00',
    'Blue': '#0000ff',
    'Yellow': '#ffff00',
    'Purple': '#800080',
    'Orange': '#ffa500'
};

let score = 0;
let timeLeft = 30;
let timer;
let gameInProgress = false;
let correctColorName;

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
    score = 0;
    timeLeft = 30;
    scoreSpan.textContent = score;
    timeLeftSpan.textContent = timeLeft;
    gameInProgress = true;
    nextRound();
    timer = setInterval(updateTimer, 1000);
}

function nextRound() {
    const randomWord = colors[Math.floor(Math.random() * colors.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    correctColorName = randomColor;

    wordDisplay.textContent = randomWord;
    wordDisplay.style.color = colorMap[randomColor];

    colorOptions.innerHTML = '';
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

    shuffledColors.forEach(color => {
        const button = document.createElement('button');
        button.classList.add('color-btn');
        button.style.backgroundColor = colorMap[color];
        button.dataset.color = color;
        button.addEventListener('click', checkAnswer);
        colorOptions.appendChild(button);
    });
}

function checkAnswer(event) {
    if (!gameInProgress) return;

    const selectedColor = event.target.dataset.color;

    if (selectedColor === correctColorName) {
        score++;
        scoreSpan.textContent = score;
    }
    nextRound();
}

function updateTimer() {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    gameInProgress = false;
    wordDisplay.textContent = 'Game Over';
    wordDisplay.style.color = 'black';
    colorOptions.innerHTML = '';
    saveGameResult('stroop', score, 30 - timeLeft);
    startCountdown(); // Restart the game
}

startCountdown();