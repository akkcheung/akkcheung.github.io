// Card Matching Game with Timer and Start Button
const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Timer variables
let timeLeft = 300; // Total time in seconds (5 minutes)
let timerInterval;

const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

function createDeck() {
  const deck = [];
  for (let suit of suits) {
     for (let value of values) {
       deck.push({ suit, value });
     }
  }
  return deck;
}


// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to create the game board
function createBoard() {

  const cardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

  let cardValuesTmp = []
 
  let deck = createDeck()
  console.log(shuffle(deck))

  for (let i=0; i < 8; i++){

    console.log(deck[i])
    cardValuesTmp.push(deck[i]);
  }

  console.log(cardValuesTmp)
  
  // Duplicate and shuffle the cards
  // cards = [...cardValues, ...cardValues];
  // shuffle(cards);
  
  cards = [...cardValuesTmp, ...cardValuesTmp]
  shuffle(cards)

  // Clear the board and reset variables
  gameBoard.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;

  // Create card elements
  cards.forEach(value => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value; // Store the card's value
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });

  message.textContent = ""; // Clear any previous messages
}

// Function to flip a card
function flipCard() {
  if (flippedCards.length === 2) return; // Prevent flipping more than two cards

  const card = this;

  // Prevent clicking the same card twice or already matched cards
  if (card.classList.contains("flipped") || card.classList.contains("hidden")) return;

  // Flip the card
  card.classList.add("flipped");
  card.textContent = card.dataset.value;

  flippedCards.push(card);

  // Check for a match if two cards are flipped
  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Function to check if two flipped cards match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.value === card2.dataset.value) {
    // Match found
    matchedPairs++;
    flippedCards.forEach(card => card.classList.add("hidden")); // Hide matched cards

    // Check for win condition
    if (matchedPairs === cards.length / 2) {
      clearInterval(timerInterval); // Stop the timer
      message.textContent = "🎉 You Win! All pairs matched!";
    }

    flippedCards = [];
    
  } else {
    // No match - flip the cards back after a short delay
    setTimeout(() => {
      flippedCards.forEach(card => {
        card.classList.remove("flipped");
        card.textContent = "";
      });
      flippedCards = [];
    }, 1000);
    
}
}

// Function to start the timer
function startTimer() {
  
  timeLeft=300//reset!
  clearInterval(timerInterval)
  timerInterval=setInterval(()=>{
    if(timeLeft<=0){
      clearInterval(timerInterval)
      message.textContent="⏰ Time's up! Game Over!"
      return
    }

    timeLeft--
    const minutes=Math.floor(timeLeft/60)
    const seconds=timeLeft%60

    timerDisplay.textContent=`Time Left:${minutes}:${seconds.toString().padStart(2,'0')}`
  },1000)
}

startButton.addEventListener('click',()=>{
  createBoard()
  startTimer()
})

createDeck()
