import { calculateHandValue } from './deck.js';

const dealerCardsElement = document.getElementById('dealer-cards');
const playerCardsElement = document.getElementById('player-cards');
const dealerTotalElement = document.getElementById('dealer-total');
const playerTotalElement = document.getElementById('player-total');
const messageElement = document.getElementById('message');

export function renderGame(playerHand, dealerHand) {
   renderHand(playerHand, playerCardsElement);
   renderHand(dealerHand, dealerCardsElement);

   const playerTotal = calculateHandValue(playerHand);
   const dealerTotal = calculateHandValue(dealerHand);

   playerTotalElement.textContent = `Total : ${playerTotal}`;
   
   if (dealerHand.length > 1) {
       dealerTotalElement.textContent = `Total: ${dealerTotal}`;
       return;
   } else {
       dealerTotalElement.textContent = `Total: ?`;
   }

   // messageElement.textContent = '';

}

export function renderHand(hand, element) {
   element.innerHTML = '';
   
   hand.forEach(card => {
       const cardImage = document.createElement('img');

       cardImage.src = `https://deckofcardsapi.com/static/img/${card.value == '10' ? card.value[1].toUpperCase() : card.value[0].toUpperCase()}${card.suit[0].toUpperCase()}.png`;
       cardImage.alt = `${card.value} of ${card.suit}`;
  
       cardImage.classList.add('card');
       element.appendChild(cardImage);
   });
}

export function updateMessage(message) {
   messageElement.textContent = message;
}

