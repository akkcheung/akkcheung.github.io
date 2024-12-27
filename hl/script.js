let deck = [];
let currentCard = null;
let gameOver = false;
let guessedCards = [];

const startButton = document.getElementById("start-btn");

function generateDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = [
        "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "jack", "queen", "king", "ace"
    ];
    const newDeck = [];
    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ value, suit, rank: values.indexOf(value) + 2 });
        }
    }
    return newDeck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    deck = generateDeck();
    shuffleDeck(deck);
    gameOver = false;
    guessedCards = [];
    if (deck.length === 0) {
        updateMessage("The deck is empty. Game over!", gameOver);
        return;
    }
    currentCard = deck.pop();
    guessedCards.push(currentCard);

    updateCurrentCard();
    updateMessage("Guess if the next card is 'High' or 'Low'.");
    updateGuessedCards();
}

function playRound(guess) {
    if (gameOver || deck.length === 0) {
        updateMessage("The game is over. Restart to play again.", gameOver);
        return;
    }

    const nextCard = deck.pop();
    updateMessage(`Next card: ${cardToString(nextCard)}`);

    if (
        (guess === "high" && nextCard.rank > currentCard.rank) ||
        (guess === "low" && nextCard.rank < currentCard.rank)
    ) {
        updateMessage("Correct guess! The game continues.");

        // guessedCards.push(currentCard);
        guessedCards.push(nextCard);

        currentCard = nextCard;
        updateCurrentCard();
        updateGuessedCards();
        if (deck.length === 0) {
            gameOver = true;
            updateMessage("Congratulations! You've guessed all cards correctly!", gameOver);
        }
    } else {
        guessedCards.push(nextCard);
        currentCard = nextCard;
        updateCurrentCard();
        updateGuessedCards();
        gameOver = true;
        updateMessage("Wrong guess! Game over.", gameOver);
    }
}

function cardToString(card) {
    return `${card.value} of ${card.suit}`;
}

function updateCurrentCard() {
    document.getElementById('current-card').textContent = `Current Card: ${cardToString(currentCard)}`;
}

function updateMessage(message, isGameOver = false) {

    const messageElement = document.getElementById('message')
    messageElement.textContent = message;

    if (isGameOver) {
        messageElement.classList.add('blinking-text');
        messageElement.style.color = "yellow"
    } else {
        messageElement.classList.remove('blinking-text');
        messageElement.style.color = "white"
    }
}

function updateGuessedCards() {
    const guessedCardsContainer = document.getElementById('guessed-cards');
    guessedCardsContainer.innerHTML = '';
    guessedCards.forEach(card => {
        const cardImage = document.createElement('img');

        // cardImage.src = `card-images/${card.value}_of_${card.suit}.png`;
        cardImage.src = `https://deckofcardsapi.com/static/img/${card.value == '10' ? card.value[1].toUpperCase() : card.value[0].toUpperCase()}${card.suit[0].toUpperCase()}.png`;

        cardImage.alt = cardToString(card);
        cardImage.className = 'card-image';
        guessedCardsContainer.appendChild(cardImage);
    });
}

// Initialize the game
// startGame();

// Event listeners for buttons
document.getElementById('high-btn').addEventListener('click', () => playRound('high'));
document.getElementById('low-btn').addEventListener('click', () => playRound('low'));

startButton.addEventListener('click',()=>{
  startGame()
})

startGame()

