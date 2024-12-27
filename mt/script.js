// Card deck
const createDeck = () => {
    const deck = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }


    return deck;
};

// Shuffle function
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

// Player functions
const createPlayer = (name, isComputer = false) => ({
    name,
    hand: [],
    isComputer
});

const drawCard = (player, deck) => {
    if (deck.length > 0) {
        player.hand.push(deck.pop());
    } else {
      endGame()
      updateUI()
    }
};

const discardCard = (player, index) => {
    return player.hand.splice(index, 1)[0];
};

const checkForTen = (player) => {

    // console.log(player);

    let sum = 0
    for (let i = 0; i < player.hand.length; i++) {
      sum += player.hand[i].value == "ace" ? 1 : Number(player.hand[i].value)
    }

    // return player.hand.reduce((sum, card) => sum + card.value, 0) === 10;
    console.log(sum)
 
    return sum === 10
};

// Game functions
const createGame = () => {
    const deck = createDeck();
    shuffle(deck);
    return {
        deck,
        players: [
            createPlayer("Human"),
            createPlayer("Computer", true)
        ],
        currentPlayerIndex: 0,
        isEndGame: false,
    };
};

const dealInitialCards = (game) => {
    for (let player of game.players) {
        for (let i = 0; i < 3; i++) {
            drawCard(player, game.deck);
        }
    }
};

const playTurn = (game, discardIndex) => {
    let currentPlayer = game.players[game.currentPlayerIndex];
    
    if (discardIndex !== null) {
        discardCard(currentPlayer, discardIndex);
        drawCard(currentPlayer, game.deck);
    }


    if (checkForTen(currentPlayer)) {
        console.log("checkForTen ..." , checkForTen(currentPlayer))
        updateUI()
        return true;
    }

    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    return false;
};

const computerPlay = (game) => {
    let computer = game.players[1];
    let discardIndex = Math.floor(Math.random() * computer.hand.length);
    return playTurn(game, discardIndex);
};

// UI functions
const displayHand = (player, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    player.hand.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('card');

        if (!player.isComputer){
          cardElement.classList.add('card-clickable');
        }

        cardElement.src = `https://deckofcardsapi.com/static/img/${card.value == '10' ? card.value[1].toUpperCase() : card.value[0].toUpperCase()}${card.suit[0].toUpperCase()}.png`;

        cardElement.alt = `${card.value} of ${card.suit}`;
        if (!player.isComputer) {
            cardElement.onclick = () => humanPlay(index);
        }
        container.appendChild(cardElement);
    });
};

const displayMessage = (message) => {
    document.getElementById('message').textContent = message;
};

// Game state
let game;

// Game loop
const startGame = () => {
    game = createGame();
    dealInitialCards(game);
    
    // let isGameEnd = false
    if (checkForTen(game.players[0]) || checkForTen(game.players[1]))
       game.isGameEnd = true ;

    updateUI();
};

const updateUI = () => {
    displayHand(game.players[0], 'human-hand');
    displayHand(game.players[1], 'computer-hand');

    if (game.isEndGame){
      if (game.deck.length > 0){
        displayMessage(game.players[game.currentPlayerIndex].name + " wins the round!");
      } else {
        displayMessage("No more card to draw. Game is over!");
      }
    } else {
      displayMessage("");
    }
    
};

const humanPlay = (discardIndex) => {

    if (!game.isEndGame) {
      if (playTurn(game, discardIndex)) {
          endGame();
      } else {
          computerTurn();
      }
      updateUI();
    }
};

const computerTurn = () => {
    if (computerPlay(game)) {
        endGame();
    }
    updateUI();
};

const endGame = () => {
    console.log('endGame invoked!')
    document.querySelectorAll('.card').forEach(card => {
      // console.log(card)
      // card.onclick = null; // image element
      // card.removeAttribute("onclick")
    })
 
    game.isEndGame = true

};

// Event listeners
// document.getElementById('keep-cards').addEventListener('click', () => humanPlay(null));

document.getElementById('start-new-game').addEventListener('click', () => startGame());

// Start the game
startGame();

