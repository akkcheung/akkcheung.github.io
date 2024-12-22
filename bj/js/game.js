import { createDeck, calculateHandValue } from './deck.js';
import { renderGame, renderHand, updateMessage } from './ui.js';

let deck, playerHand, dealerHand;

export function startGame() {
  deck = createDeck();
  
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  console.log('renderGame called!')
  renderGame(playerHand, dealerHand);

  updateMessage('')
}

export function hit() {
   playerHand.push(deck.pop());
   renderGame(playerHand, dealerHand);
   checkWinner();
}

export function stand() {
   while (calculateHandValue(dealerHand) < 17) {
       dealerHand.push(deck.pop());
   }
   renderGame(playerHand, dealerHand);
   checkWinner();
}

function checkWinner() {
   const playerTotal = calculateHandValue(playerHand);
   const dealerTotal = calculateHandValue(dealerHand);

   if (playerTotal > 21) {
       updateMessage('Player busts! Dealer wins.');
   } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
       updateMessage('Player wins!');
   } else if (playerTotal < dealerTotal) {
       updateMessage('Dealer wins!');
   } else {
       updateMessage('It\'s a tie!');
   }
}

