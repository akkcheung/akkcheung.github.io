import { saveGameResult } from '../data.js';

const scoreSpan = document.getElementById('score');
const timeLeftSpan = document.getElementById('time-left');
const countdownEl = document.getElementById('countdown');
const letterDisplay = document.getElementById('letter-display');
const grid1 = document.getElementById('grid1');
const grid2 = document.getElementById('grid2');

const letters = ['B', 'C', 'D', 'E', 'F', 'G', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'Z'];
const transformations = [
    'rotate(90deg)',
    'rotate(180deg)',
    'rotate(270deg)',
    'scaleY(-1)'
];

let score = 0;
let timeLeft = 60;
let gameTimer;
let correctGrid;
let gameInProgress = false;

function startGame() {
    score = 0;
    timeLeft = 60;
    scoreSpan.textContent = score;
    timeLeftSpan.textContent = timeLeft;
    countdownEl.textContent = '';
    gameInProgress = true;
    grid1.addEventListener('click', checkAnswer);
    grid2.addEventListener('click', checkAnswer);
    nextRound();
    gameTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameTimer);
    gameInProgress = false;
    grid1.removeEventListener('click', checkAnswer);
    grid2.removeEventListener('click', checkAnswer);
    saveGameResult('mirror-game', score, 60);
    startRestartCountdown();
}

function startRestartCountdown() {
    let count = 5;
    countdownEl.textContent = `Restarting in ${count}s`;
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = `Restarting in ${count}s`;
        } else {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);
}

function nextRound() {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    letterDisplay.textContent = randomLetter;

    const randomTransformation = transformations[Math.floor(Math.random() * transformations.length)];

    if (Math.random() > 0.5) {
        correctGrid = grid1;
        grid1.style.transform = 'scaleX(-1)';
        grid2.style.transform = randomTransformation;
        grid1.textContent = randomLetter;
        grid2.textContent = randomLetter;
    } else {
        correctGrid = grid2;
        grid2.style.transform = 'scaleX(-1)';
        grid1.style.transform = randomTransformation;
        grid2.textContent = randomLetter;
        grid1.textContent = randomLetter;
    }
}

function checkAnswer(event) {
    if (!gameInProgress) return;

    if (event.target === correctGrid) {
        score++;
        scoreSpan.textContent = score;
    } else {
        // Optional: provide feedback for wrong answer
    }
    nextRound();
}

startGame();
