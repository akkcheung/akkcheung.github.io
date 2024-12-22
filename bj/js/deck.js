export const suits = ["hearts", "diamonds", "clubs", "spades"];
export const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

export function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function getCardValue(card) {
  if (["jack", "queen", "king"].includes(card.value)) return 10;
  if (card.value === "ace") return 11; // Ace is worth 11 by default
  return parseInt(card.value);
}

export function calculateHandValue(hand) {
  let total = 0;
  let aceCount = 0;

  for (let card of hand) {
    total += getCardValue(card);
    if (card.value === "ace") aceCount++;
  }

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

