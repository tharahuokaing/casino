// 🎰 VIP HIGH-STAKES SIMPLE BACCARAT (2-CARD PORK STYLE)
// $10,000 Minimum | No Fees | High-Speed Performance

const values = {
  A: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  6: 6, 7: 7, 8: 8, 9: 9,
  '10': 0, J: 0, Q: 0, K: 0
};

const cardsArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const FIRST_TIME_KEY = 'baccarat_vip_first_time';
const MAX_DEPOSIT_BONUS = 50000; // Increased for VIP

function getWelcomeBonus() {
  if (!localStorage.getItem(FIRST_TIME_KEY)) {
    localStorage.setItem(FIRST_TIME_KEY, 'claimed');
    return 10000; // Giving $100k to start since min bet is $10k
  }
  return 10000; 
}

let gameState = {
  playerCards: [],
  bankerCards: [],
  balance: getWelcomeBonus(),
  winStreak: 0,
  selectedChip: 10000, // Default to $10K
  currentBet: { betOn: 'Banker', amount: 0 },
  soundEnabled: true,
  gameHistory: [],
  isDealing: false
};

const elements = {
  dealBtn: document.getElementById('dealBtn'),
  resetBtn: document.getElementById('resetBtn'),
  fastDealBtn: document.getElementById('fastDealBtn'),
  playerCards: document.getElementById('playerCards'),
  bankerCards: document.getElementById('bankerCards'),
  playerTotal: document.getElementById('playerTotal'),
  bankerTotal: document.getElementById('bankerTotal'),
  result: document.getElementById('result'),
  dealerVideo: document.getElementById('dealerVideo'),
  balance: document.getElementById('balance'),
  winStreak: document.getElementById('winStreak'),
  currentBetText: document.getElementById('currentBetText'),
  currentBetAmount: document.getElementById('currentBetAmount'),
  chips: document.querySelectorAll('.chip'),
  betButtons: document.querySelectorAll('.bet-btn'),
  clearBet: document.getElementById('clearBet'),
  soundToggle: document.getElementById('soundToggle'),
  gameHistory: document.getElementById('gameHistory'),
  bankToggle: document.getElementById('bankToggle'),
  statusLight: document.getElementById('statusLight'),
  dealerStatus: document.getElementById('dealerStatus')
};

function getRandomCard() {
  return cardsArray[Math.floor(Math.random() * cardsArray.length)];
}

function calcTotal(cards) {
  const sum = cards.reduce((acc, card) => acc + values[card], 0);
  return sum % 10;
}

function createCardElement(cardValue, position, isBanker = false) {
  const card = document.createElement('div');
  card.className = `card ${isBanker ? 'banker-card' : ''} ${position}`;
  card.textContent = cardValue;
  return card;
}

async function flyCardFromDealer(cardElement, targetContainer, delay = 0, fast = false) {
  return new Promise((resolve) => {
    const flightTime = fast ? 0.3 : 0.6;
    cardElement.style.cssText = `position: fixed; left: 75%; top: 40%; opacity: 0; transform: scale(0.5); z-index: 1000;`;
    document.body.appendChild(cardElement);

    setTimeout(() => {
      const targetX = targetContainer.dataset.positionX;
      const targetY = targetContainer.dataset.positionY;
      cardElement.style.cssText = `transition: all ${flightTime}s ease-out; left: ${targetX}; top: ${targetY}; opacity: 1; transform: scale(1);`;
      
      setTimeout(() => {
        targetContainer.appendChild(cardElement);
        resolve();
      }, flightTime * 1000);
    }, delay);
  });
}

function decideWinner(p, b) {
  if (p > b) return 'Player';
  if (b > p) return 'Banker';
  return 'Tie';
}

function updateUI() {
  elements.balance.textContent = gameState.balance.toLocaleString();
  elements.winStreak.textContent = gameState.winStreak;
  elements.currentBetAmount.textContent = gameState.currentBet.amount.toLocaleString();
  elements.currentBetText.textContent = gameState.currentBet.betOn || 'None';

  if (gameState.balance < 10000) {
    showNotification('⚠️ Balance low for VIP play! Visit Bank.', 'warning');
  }
}

async function dealGame(fastMode = false) {
  if (gameState.currentBet.amount === 0 || gameState.isDealing) return;

  gameState.isDealing = true;
  elements.dealBtn.disabled = true;
  elements.statusLight.classList.add('active');
  elements.result.innerHTML = 'DEALING...';

  // 2 CARDS ONLY - SIMPLE RULE
  gameState.playerCards = [getRandomCard(), getRandomCard()];
  gameState.bankerCards = [getRandomCard(), getRandomCard()];

  const delay = fastMode ? 100 : 500;

  // Animation Sequence
  elements.playerCards.innerHTML = '';
  elements.bankerCards.innerHTML = '';

  await flyCardFromDealer(createCardElement(gameState.playerCards[0], 'p1'), elements.playerCards, 0, fastMode);
  await flyCardFromDealer(createCardElement(gameState.bankerCards[0], 'b1', true), elements.bankerCards, delay, fastMode);
  await flyCardFromDealer(createCardElement(gameState.playerCards[1], 'p2'), elements.playerCards, delay, fastMode);
  await flyCardFromDealer(createCardElement(gameState.bankerCards[1], 'b2', true), elements.bankerCards, delay, fastMode);

  const pTotal = calcTotal(gameState.playerCards);
  const bTotal = calcTotal(gameState.bankerCards);
  
  elements.playerTotal.textContent = pTotal;
  elements.bankerTotal.textContent = bTotal;

  const winner = decideWinner(pTotal, bTotal);
  let payout = 0;

  if (winner === 'Tie' && gameState.currentBet.betOn === 'Tie') {
    payout = gameState.currentBet.amount * 9; // 8:1 payout + original bet
    gameState.balance += payout;
    elements.result.innerHTML = `🤝 TIE! +$${payout.toLocaleString()}`;
  } else if (winner === gameState.currentBet.betOn) {
    payout = gameState.currentBet.amount * 2; // Simple 1:1 Profit (No Fees)
    gameState.balance += payout;
    gameState.winStreak++;
    elements.result.innerHTML = `🎉 ${winner.toUpperCase()} WINS +$${payout.toLocaleString()}`;
  } else if (winner === 'Tie') {
      gameState.balance += gameState.currentBet.amount; // Push - Return money on Tie
      elements.result.innerHTML = `🤝 TIE - BET RETURNED`;
  } else {
    gameState.winStreak = 0;
    elements.result.innerHTML = `❌ ${winner.toUpperCase()} BEATS YOU`;
  }

  updateUI();
  addToHistory(winner, (winner === gameState.currentBet.betOn || winner === 'Tie') ? payout : 0);
  
  gameState.currentBet.amount = 0;
  gameState.isDealing = false;
  elements.resetBtn.disabled = false;
  elements.fastDealBtn.disabled = false;
  elements.statusLight.classList.remove('active');
}

function initBetting() {
  elements.chips.forEach(chip => {
    chip.addEventListener('click', () => {
      gameState.selectedChip = Number(chip.dataset.value);
      elements.chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  elements.betButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (gameState.isDealing) return;
      if (gameState.balance < gameState.selectedChip) {
        showNotification('Insufficient Funds!', 'error');
        return;
      }
      gameState.currentBet.betOn = btn.dataset.bet;
      gameState.currentBet.amount += gameState.selectedChip;
      gameState.balance -= gameState.selectedChip;
      updateUI();
      elements.dealBtn.disabled = false;
    });
  });

  elements.clearBet.addEventListener('click', () => {
    if (gameState.isDealing) return;
    gameState.balance += gameState.currentBet.amount;
    gameState.currentBet.amount = 0;
    updateUI();
    elements.dealBtn.disabled = true;
  });
}

function addToHistory(winner, payout) {
    const item = document.createElement('div');
    item.className = `history-item ${payout > 0 ? 'win' : 'loss'}`;
    item.innerHTML = `<strong>${winner[0]}</strong><br><small>$${payout.toLocaleString()}</small>`;
    elements.gameHistory.prepend(item);
}

function initControls() {
  elements.dealBtn.addEventListener('click', () => dealGame(false));
  elements.fastDealBtn.addEventListener('click', () => dealGame(true));
  elements.resetBtn.addEventListener('click', () => {
      elements.playerCards.innerHTML = '';
      elements.bankerCards.innerHTML = '';
      elements.playerTotal.textContent = '0';
      elements.bankerTotal.textContent = '0';
      elements.result.textContent = 'Place Bet';
      elements.resetBtn.disabled = true;
  });
  
  elements.bankToggle.addEventListener('click', () => {
    const frame = document.querySelector('.bank-iframe');
    frame.style.display = frame.style.display === 'none' ? 'block' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBetting();
  initControls();
  updateUI();
});

// Add this inside your dealGame function where the winner is decided
async function playDealerReaction(type) {
  const video = document.getElementById('aiDealerLive');
  
  if (type === 'win') {
    // Play a "Smiling/Nodding" deepfake clip
    video.src = 'dealer-smile.mp4';
  } else if (type === 'loss') {
    // Play a "Neutral/Serious" deepfake clip
    video.src = 'dealer-neutral.mp4';
  }
  
  video.play();
  
  // Return to idle loop after 3 seconds
  setTimeout(() => {
    video.src = 'ai-dealer-reaction.mp4';
    video.play();
  }, 3000);
}
