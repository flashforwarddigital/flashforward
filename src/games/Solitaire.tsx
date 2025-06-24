import React, { useState, useEffect } from 'react';
import '../styles/Solitaire.css';

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: number;
  faceUp: boolean;
  color: 'red' | 'black';
}

interface GameState {
  deck: Card[];
  tableau: Card[][];
  foundation: Card[][];
  waste: Card[];
  stock: Card[];
  selectedCard: {
    cards: Card[];
    source: string;
    index: number;
  } | null;
  score: number;
  moves: number;
}

const SolitaireGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    tableau: Array(7).fill([]),
    foundation: Array(4).fill([]),
    waste: [],
    stock: [],
    selectedCard: null,
    score: 0,
    moves: 0
  });

  const createDeck = (): Card[] => {
    const suits: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck: Card[] = [];

    suits.forEach(suit => {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({
          suit,
          rank,
          faceUp: false,
          color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'
        });
      }
    });

    return shuffle(deck);
  };

  const shuffle = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCards = () => {
    const deck = createDeck();
    const tableau: Card[][] = Array(7).fill([]).map(() => []);
    let cardIndex = 0;

    // Deal cards to tableau
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = deck[cardIndex++];
        card.faceUp = i === j;
        tableau[j] = [...tableau[j], card];
      }
    }

    // Remaining cards go to stock
    const stock = deck.slice(cardIndex).map(card => ({ ...card, faceUp: false }));

    setGameState({
      deck,
      tableau,
      foundation: Array(4).fill([]),
      waste: [],
      stock,
      selectedCard: null,
      score: 0,
      moves: 0
    });
  };

  useEffect(() => {
    dealCards();
  }, []);

  const handleCardClick = (card: Card, source: string, index: number) => {
    if (!card.faceUp) return;

    if (!gameState.selectedCard) {
      // Select card and any cards below it in tableau
      let cards: Card[] = [];
      if (source.startsWith('tableau')) {
        const pileIndex = parseInt(source.slice(-1));
        const pile = gameState.tableau[pileIndex];
        cards = pile.slice(index);
      } else {
        cards = [card];
      }

      setGameState({
        ...gameState,
        selectedCard: { cards, source, index }
      });
    } else {
      // Try to move card(s)
      const move = isValidMove(gameState.selectedCard.cards[0], card, source);
      if (move) {
        moveCards(gameState.selectedCard.cards, gameState.selectedCard.source, source);
      }
      setGameState({
        ...gameState,
        selectedCard: null
      });
    }
  };

  const isValidMove = (sourceCard: Card, targetCard: Card, targetPile: string): boolean => {
    if (targetPile.startsWith('foundation')) {
      return (
        (targetCard === undefined && sourceCard.rank === 1) ||
        (targetCard && targetCard.suit === sourceCard.suit && targetCard.rank === sourceCard.rank - 1)
      );
    }

    if (targetPile.startsWith('tableau')) {
      return (
        (targetCard === undefined && sourceCard.rank === 13) ||
        (targetCard && targetCard.color !== sourceCard.color && targetCard.rank === sourceCard.rank + 1)
      );
    }

    return false;
  };

  const moveCards = (cards: Card[], source: string, target: string) => {
    const newState = { ...gameState };
    
    // Remove cards from source
    if (source.startsWith('tableau')) {
      const pileIndex = parseInt(source.slice(-1));
      newState.tableau[pileIndex] = newState.tableau[pileIndex].slice(0, -cards.length);
      if (newState.tableau[pileIndex].length > 0) {
        newState.tableau[pileIndex][newState.tableau[pileIndex].length - 1].faceUp = true;
      }
    } else if (source === 'waste') {
      newState.waste = newState.waste.slice(0, -1);
    }

    // Add cards to target
    if (target.startsWith('tableau')) {
      const pileIndex = parseInt(target.slice(-1));
      newState.tableau[pileIndex] = [...newState.tableau[pileIndex], ...cards];
    } else if (target.startsWith('foundation')) {
      const pileIndex = parseInt(target.slice(-1));
      newState.foundation[pileIndex] = [...newState.foundation[pileIndex], ...cards];
    }

    newState.moves++;
    newState.score += 10;

    setGameState(newState);
  };

  const drawCard = () => {
    if (gameState.stock.length === 0) {
      // Flip waste pile back to stock
      setGameState({
        ...gameState,
        stock: [...gameState.waste].reverse().map(card => ({ ...card, faceUp: false })),
        waste: []
      });
      return;
    }

    const card = gameState.stock[gameState.stock.length - 1];
    card.faceUp = true;

    setGameState({
      ...gameState,
      stock: gameState.stock.slice(0, -1),
      waste: [...gameState.waste, card]
    });
  };

  const renderCard = (card: Card | undefined, source: string, index: number) => {
    if (!card) return <div className="solitaire-card-placeholder" />;

    const isSelected = gameState.selectedCard?.cards.includes(card);
    const classes = `solitaire-card ${card.faceUp ? 'face-up' : 'face-down'} ${isSelected ? 'selected' : ''}`;

    return (
      <div 
        className={classes}
        onClick={() => handleCardClick(card, source, index)}
      >
        {card.faceUp && (
          <div className={`card-content ${card.color}`}>
            {card.rank === 1 ? 'A' : 
             card.rank === 11 ? 'J' :
             card.rank === 12 ? 'Q' :
             card.rank === 13 ? 'K' : card.rank}
            <span className="suit">{
              card.suit === 'hearts' ? '♥' :
              card.suit === 'diamonds' ? '♦' :
              card.suit === 'clubs' ? '♣' : '♠'
            }</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="solitaire-game">
      <div className="solitaire-header">
        <div className="solitaire-score">Score: {gameState.score}</div>
        <button className="win95-button" onClick={dealCards}>New Game</button>
        <div className="solitaire-moves">Moves: {gameState.moves}</div>
      </div>

      <div className="solitaire-table">
        <div className="solitaire-top">
          <div className="solitaire-stock-waste">
            <div className="solitaire-pile stock" onClick={drawCard}>
              {gameState.stock.length > 0 ? (
                <div className="solitaire-card face-down" />
              ) : (
                <div className="solitaire-card-placeholder" />
              )}
            </div>
            <div className="solitaire-pile waste">
              {gameState.waste.length > 0 ? 
                renderCard(gameState.waste[gameState.waste.length - 1], 'waste', gameState.waste.length - 1) :
                <div className="solitaire-card-placeholder" />
              }
            </div>
          </div>

          <div className="solitaire-foundation">
            {gameState.foundation.map((pile, i) => (
              <div key={`foundation-${i}`} className="solitaire-pile">
                {pile.length > 0 ?
                  renderCard(pile[pile.length - 1], `foundation${i}`, pile.length - 1) :
                  <div className="solitaire-card-placeholder" />
                }
              </div>
            ))}
          </div>
        </div>

        <div className="solitaire-tableau">
          {gameState.tableau.map((pile, i) => (
            <div key={`tableau-${i}`} className="solitaire-pile">
              {pile.map((card, j) => (
                <div key={`${i}-${j}`} style={{ top: `${j * 20}px` }}>
                  {renderCard(card, `tableau${i}`, j)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolitaireGame;