import { saveGameResult } from '../data.js';

const gameBoard = document.getElementById('game-board');
const timerSpan = document.getElementById('timer');
const nextNumberSpan = document.getElementById('next-number');
const countdownEl = document.getElementById('countdown');

const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
let currentNumber = 1;
let timer;
let seconds = 0;

function startGame() {
    gameBoard.innerHTML = '';
    currentNumber = 1;
    seconds = 0;
    timerSpan.textContent = seconds;
    nextNumberSpan.textContent = currentNumber;
    countdownEl.textContent = '';
    clearInterval(timer);
    placeNumbers();
}

function placeNumbers() {
    const positions = [];
    for (let i = 0; i < numbers.length; i++) {
        const numberDot = document.createElement('div');
        numberDot.classList.add('number-dot');
        numberDot.textContent = numbers[i];
        numberDot.dataset.number = numbers[i];

        let position;
        do {
            position = {
                top: Math.random() * (300 - 40) + 150, // 150px offset
                left: Math.random() * (400 - 40) + 200 // 200px offset
            };
        } while (positions.some(p => isOverlapping(p, position)));

        positions.push(position);
        numberDot.style.top = `${position.top}px`;
        numberDot.style.left = `${position.left}px`;

        numberDot.addEventListener('click', handleNumberClick);
        gameBoard.appendChild(numberDot);
    }
}

function isOverlapping(pos1, pos2) {
    const dx = pos1.left - pos2.left;
    const dy = pos1.top - pos2.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 50; // 40px diameter + 10px margin
}

function handleNumberClick(event) {
    const clickedNumber = parseInt(event.target.dataset.number);

    if (clickedNumber === currentNumber) {
        event.target.classList.add('clicked');
        if (currentNumber === 1) {
            startTimer();
        }

        currentNumber++;
        nextNumberSpan.textContent = currentNumber;

        if (currentNumber > numbers.length) {
            endGame();
        }
    }
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timerSpan.textContent = seconds;
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    saveGameResult('trail-making', numbers.length, seconds);
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

startGame();
