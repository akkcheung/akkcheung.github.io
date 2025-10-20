import { saveGameResult } from '../data.js';

const gameBoard = document.getElementById('game-board');
const movesSpan = document.getElementById('moves');
const timerSpan = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const autoRestartContainer = document.getElementById('auto-restart-container');
const restartTimerSpan = document.getElementById('restart-timer');
const cancelRestartBtn = document.getElementById('cancel-restart-btn');

const fruits = ['apple', 'cherry', 'dragon_fruit', 'kiwi', 'orange', 'pear',  'strawberry', 'water_melon'];
const cards = [...fruits, ...fruits];

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer;
let seconds = 0;
let restartTimer;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    moves = 0;
    seconds = 0;
    movesSpan.textContent = moves;
    timerSpan.textContent = seconds;
    matchedCards = [];
    flippedCards = [];
    shuffle(cards);
    gameBoard.innerHTML = '';
    autoRestartContainer.style.display = 'none';
    clearTimeout(restartTimer);
    createBoard();
    startTimer();
}

function createBoard() {
    for (let i = 0; i < cards.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.fruit = cards[i];

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');

        const img = document.createElement('img');
        // img.src = `images/${cards[i]}.png`;
        img.src = `images/${cards[i]}.jpg`;
        img.alt = cards[i];
        cardBack.appendChild(img);

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesSpan.textContent = moves;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.fruit === card2.dataset.fruit) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        flippedCards = [];
        if (matchedCards.length === cards.length) {
            clearInterval(timer);
            saveGameResult('memory', moves, seconds);
            autoRestartContainer.style.display = 'block';
            let restartSeconds = 5;
            restartTimerSpan.textContent = restartSeconds;
            restartTimer = setInterval(() => {
                restartSeconds--;
                restartTimerSpan.textContent = restartSeconds;
                if (restartSeconds === 0) {
                    clearInterval(restartTimer);
                    startGame();
                }
            }, 1000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        timerSpan.textContent = seconds;
    }, 1000);
}





startGame();