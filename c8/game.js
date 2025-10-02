class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Load card images
                const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

        for (let suit of suits) {
            for (let rank of ranks) {
                this.load.image(`${suit}${rank}`, `Cards Pack/PNG/Medium/${suit} ${rank}.png`);
            }
        }
        this.load.image('cardBack', 'Cards Pack/PNG/Medium/Back Blue 1.png');
    }

    create() {
        this.suits = ['H', 'D', 'C', 'S'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = this.createDeck();
        this.shuffleDeck(this.deck);

        this.playerHand = this.dealCards(7);
        this.opponentHand = this.dealCards(7);

        this.discardPile = [this.deck.pop()];

        this.drawPile = this.deck;

        this.drawTwoStack = 0;

        this.renderPlayerHand();
        this.renderOpponentHand();
        this.renderDiscardPile();
        this.renderDrawPile();

        this.turn = 'player'; // player or opponent
        this.currentSuit = this.discardPile[0].suit;
        this.currentRank = this.discardPile[0].rank;

        this.statusText = this.add.text(10, 10, 'Your turn.', { fontSize: '20px', fill: '#fff' });
        this.suitText = this.add.text(10, 40, `Current Suit: ${this.currentSuit}`, { fontSize: '20px', fill: '#fff' });
    }

    getCardImageKey(card) {
        const suitMap = { 'H': 'Hearts', 'D': 'Diamonds', 'C': 'Clubs', 'S': 'Spades' };
        const rankMap = { 'A': '1', 'J': '11', 'Q': '12', 'K': '13' };
        
        let rank = rankMap[card.rank] || card.rank;
        let suit = suitMap[card.suit];

        return `${suit}${rank}`;
    }

    createDeck() {
        let deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                deck.push({ suit, rank });
            }
        }
        return deck;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    dealCards(numCards) {
        let hand = [];
        for (let i = 0; i < numCards; i++) {
            hand.push(this.deck.pop());
        }
        return hand;
    }

    renderPlayerHand() {
        let handWidth = this.playerHand.length * 50;
        let startX = (this.sys.game.config.width - handWidth) / 2;

        this.playerHand.forEach((card, index) => {
            let cardImageKey = this.getCardImageKey(card);
            let cardObject = this.add.image(startX + (index * 50), 450, cardImageKey)
                .setScale(0.8)
                .setInteractive();

            cardObject.on('pointerdown', () => {
                this.playCard(card, cardObject);
            });

            cardObject.on('pointerover', () => {
                cardObject.y = 430;
                cardObject.setDepth(1);
            });

            cardObject.on('pointerout', () => {
                cardObject.y = 450;
                cardObject.setDepth(0);
            });
        });
    }

    renderOpponentHand() {
        let handWidth = this.opponentHand.length * 50;
        let startX = (this.sys.game.config.width - handWidth) / 2;

        this.opponentHand.forEach((card, index) => {
            this.add.image(startX + (index * 50), 150, 'cardBack').setScale(0.8);
        });
    }

    renderDiscardPile() {
        if (this.discardPile.length > 0) {
            let topCard = this.discardPile[this.discardPile.length - 1];
            let cardImageKey = this.getCardImageKey(topCard);
            this.add.image(400, 250, cardImageKey).setScale(0.8);
        }
    }

    renderDrawPile() {
        if (this.drawPile.length > 0) {
            let drawPileObject = this.add.image(200, 250, 'cardBack')
                .setScale(0.8)
                .setInteractive();
            
            if (this.drawTwoStack > 0) {
                this.add.text(160, 350, `Draw ${this.drawTwoStack} cards`, { fontSize: '16px', fill: '#ff0' });
            } else {
                this.add.text(160, 350, `Draw (${this.drawPile.length})`, { fontSize: '16px', fill: '#fff' });
            }

            drawPileObject.on('pointerdown', () => {
                this.drawCard();
            });
        }
    }

    playCard(card, cardObject) {
        if (this.turn !== 'player') return;

        // Handle "draw two" stack
        if (this.drawTwoStack > 0) {
            if (card.rank === '2') {
                this.drawTwoStack += 2;
                this.moveCardToDiscardPile(card);
                cardObject.destroy();
                this.statusText.setText(`Stack is now ${this.drawTwoStack}.`);
                this.endTurn();
            } else {
                this.statusText.setText(`You must play a '2' or draw ${this.drawTwoStack} cards.`);
            }
            return; // Must exit after handling stack
        }

        // Normal play logic
        if (card.rank === '8') {
            this.handleCrazyEight(card, cardObject);
        } else if (card.suit === this.currentSuit || card.rank === this.currentRank) {
            this.moveCardToDiscardPile(card);
            cardObject.destroy();

            if (this.playerHand.length === 0) {
                this.statusText.setText('You win!');
                this.showRestartButton();
                return;
            }

            if (card.rank === 'Q') {
                this.statusText.setText('Opponent skips a turn. Your turn again.');
            } else if (card.rank === '2') {
                this.drawTwoStack = 2;
                this.statusText.setText('Opponent must play a \'2\' or draw 2.');
                this.endTurn();
            } else {
                this.endTurn();
            }
        } else {
            this.statusText.setText('Invalid move. Try again.');
        }
    }

    handleCrazyEight(card, cardObject) {
        this.moveCardToDiscardPile(card);
        cardObject.destroy();
        this.promptForSuitChoice();
    }

    promptForSuitChoice() {
        this.statusText.setText('Choose a suit');
        // const suitOptions = ['H', 'D', 'C', 'S'];
        const suitOptions = ['S', 'H', 'C', 'D'];
        const suitTexts = [];

        suitOptions.forEach((suit, index) => {
            let suitText = this.add.text(350 + (index * 50), 300, suit, { fontSize: '32px', fill: '#fff', backgroundColor: '#555', padding: {x: 10, y: 5 } })
                .setInteractive();
            
            suitText.on('pointerdown', () => {
                this.currentSuit = suit;
                this.suitText.setText(`Current Suit: ${this.currentSuit}`);
                suitTexts.forEach(text => text.destroy());
                this.endTurn();
            });
            suitTexts.push(suitText);
        });
    }

    moveCardToDiscardPile(card) {
        this.discardPile.push(card);
        this.currentSuit = card.suit;
        this.currentRank = card.rank;
        this.playerHand = this.playerHand.filter(c => c !== card);
        this.rerender();
    }

    drawCard() {
        if (this.turn !== 'player') return;

        if (this.drawTwoStack > 0) {
            let numToDraw = this.drawTwoStack;
            for (let i = 0; i < numToDraw; i++) {
                if (this.drawPile.length > 0) {
                    this.playerHand.push(this.drawPile.pop());
                    if (this.drawPile.length === 0) {
                        this.endGameOnEmptyDrawPile();
                        return;
                    }
                }
            }
            this.statusText.setText(`You drew ${numToDraw} cards.`);
            this.drawTwoStack = 0;
            this.rerender(); // Show the player their new cards
            this.endTurn(); // Pass turn to opponent
            return;
        }

        if (this.drawPile.length === 0) {
            let canPlay = this.playerHand.some(card => card.rank === '8' || card.suit === this.currentSuit || card.rank === this.currentRank);
            if (!canPlay) {
                this.statusText.setText('Draw!');
                this.showRestartButton();
            }
            return;
        }

        this.playerHand.push(this.drawPile.pop());
        if (this.drawPile.length === 0) {
            this.endGameOnEmptyDrawPile();
            return;
        }

        this.rerender();
        this.endTurn();
    }

    endTurn() {
        if (this.playerHand.length === 0) {
            this.statusText.setText('You win!');
            this.showRestartButton();
            return;
        }

        if (this.opponentHand.length === 0) {
            this.statusText.setText('Opponent wins!');
            this.showRestartButton();
            return;
        }

        this.turn = 'opponent';
        this.statusText.setText("Opponent's turn.");
        
        // Simple AI
        setTimeout(() => {
            this.opponentTurn();
        }, 1000);
    }

    opponentTurn() {
        // Handle "draw two" stack first
        if (this.drawTwoStack > 0) {
            let twoCardIndex = this.opponentHand.findIndex(card => card.rank === '2');
            if (twoCardIndex !== -1) {
                let card = this.opponentHand.splice(twoCardIndex, 1)[0];
                this.discardPile.push(card);
                this.currentSuit = card.suit;
                this.currentRank = card.rank;
                this.drawTwoStack += 2;
                this.statusText.setText(`Opponent stacked a '2'. Stack is now ${this.drawTwoStack}. Your turn.`);
            } else {
                let numToDraw = this.drawTwoStack;
                for (let i = 0; i < numToDraw; i++) {
                    if (this.drawPile.length > 0) { 
                        this.opponentHand.push(this.drawPile.pop());
                        if (this.drawPile.length === 0) {
                            this.endGameOnEmptyDrawPile();
                            return;
                        }
                    }
                }
                this.drawTwoStack = 0;
                this.statusText.setText(`Opponent drew ${numToDraw} cards. Your turn.`);
            }
            this.rerender();
            this.turn = 'player';
            return;
        }

        // Normal opponent turn
        let playableCardIndex = this.opponentHand.findIndex(card => card.rank === '8' || card.suit === this.currentSuit || card.rank === this.currentRank);

        if (playableCardIndex !== -1) {
            let card = this.opponentHand.splice(playableCardIndex, 1)[0];
            this.discardPile.push(card);
            this.currentSuit = card.suit;
            this.currentRank = card.rank;

            if (this.opponentHand.length === 0) {
                this.rerender();
                this.statusText.setText('Opponent wins!');
                this.showRestartButton();
                return;
            }

            if (card.rank === '8') {
                // AI chooses the most common suit in its hand
                const suitCounts = { H: 0, D: 0, C: 0, S: 0 };
                this.opponentHand.forEach(c => { suitCounts[c.suit]++; });
                let maxSuit = 'H';
                for (const suit in suitCounts) {
                    if (suitCounts[suit] > suitCounts[maxSuit]) { maxSuit = suit; }
                }
                this.currentSuit = maxSuit;
            }

            if (card.rank === 'Q') {
                this.statusText.setText('You skip a turn. Opponent plays again.');
                this.rerender();
                setTimeout(() => this.opponentTurn(), 1000);
                return;
            }

            if (card.rank === '2') {
                this.drawTwoStack = 2;
                this.statusText.setText('You must play a \'2\' or draw 2. Your turn.');
            }
        } else if (this.drawPile.length > 0) {
            this.opponentHand.push(this.drawPile.pop());
            if (this.drawPile.length === 0) {
                this.endGameOnEmptyDrawPile();
                return;
            }
        }

        this.rerender();

        if (this.opponentHand.length === 0) {
            this.statusText.setText('Opponent wins!');
            this.showRestartButton();
            return;
        }

        this.turn = 'player';
        if(this.drawTwoStack === 0) { // Avoid overwriting the 'draw 2' message
            this.statusText.setText('Your turn.');
        }
    }

    rerender() {
        // Clear and rerender everything
        this.children.removeAll();
        this.renderPlayerHand();
        this.renderOpponentHand();
        this.renderDiscardPile();
        this.renderDrawPile();
        this.statusText = this.add.text(10, 10, 'Your turn.', { fontSize: '20px', fill: '#fff' });
        this.suitText = this.add.text(10, 40, `Current Suit: ${this.currentSuit}`, { fontSize: '20px', fill: '#fff' });
    }

    showRestartButton() {
        const restartButton = this.add.text(400, 300, 'Restart', { fontSize: '32px', fill: '#fff', backgroundColor: '#000', padding: { x: 10, y: 5 } })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    endGameOnEmptyDrawPile() {
        this.rerender(); // Show the final state
        this.statusText.setText('Draw pile is empty!');

        const playerScore = this.playerHand.length;
        const opponentScore = this.opponentHand.length;

        let winnerText = '';
        if (playerScore < opponentScore) {
            winnerText = 'You win by having fewer cards!';
        } else if (opponentScore < playerScore) {
            winnerText = 'Opponent wins by having fewer cards!';
        } else {
            winnerText = 'It\'s a draw!';
        }

        // Display winner text after a delay and show restart button
        setTimeout(() => {
            this.statusText.setText(winnerText);
            this.showRestartButton();
        }, 2000);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GameScene],
    backgroundColor: '#004d00'
};

const game = new Phaser.Game(config);