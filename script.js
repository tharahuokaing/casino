// 🎰 FULL LAS VEGAS BACCARAT - COMPLETE PRODUCTION SCRIPT
// Digital Bank Integration + $10,000 Welcome Bonus + Deposit System

const values = {
  A: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  6: 6, 7: 7, 8: 8, 9: 9,
  '10': 0, J: 0, Q: 0, K: 0
};

const cardsArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// FIRST TIME $10,000 BONUS SYSTEM
const FIRST_TIME_KEY = 'baccarat_first_time';
const MAX_DEPOSIT_BONUS = 5000; // Additional deposit bonus

function getWelcomeBonus() {
  if (!localStorage.getItem(FIRST_TIME_KEY)) {
    localStorage.setItem(FIRST_TIME_KEY, 'claimed');
    return 10000;
  }
  return 0;
}

function hasDeposited() {
  return localStorage.getItem('baccarat_deposit_made') === 'true';
}

// Game initialization with bonus
let gameState = {
  playerCards: [],
  bankerCards: [],
  balance: getWelcomeBonus(), // $10,000 first time!
  originalBalance: getWelcomeBonus(),
  winStreak: 0,
  selectedChip: 25,
  currentBet: { betOn: 'Banker', amount: 0 },
  soundEnabled: true,
  gameHistory: [],
  isDealing: false,
  bonusClaimed: getWelcomeBonus() > 0,
  depositMade: hasDeposited()
};

// DOM Elements
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

// Core game functions
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
  card.dataset.value = cardValue;
  return card;
}

async function flyCardFromDealer(cardElement, targetContainer, delay = 0, fast = false) {
  return new Promise((resolve) => {
    const flightTime = fast ? 0.4 : 0.8;
    
    cardElement.style.cssText = `
      position: fixed !important;
      left: 75% !important;
      top: 55% !important;
      z-index: 10000 !important;
      transform: translate(-50%, -50%) rotateY(180deg) scale(0.4) !important;
      opacity: 0 !important;
      transition: none !important;
    `;
    
    document.body.appendChild(cardElement);
    
    setTimeout(() => {
      const targetX = targetContainer.dataset.positionX;
      const targetY = targetContainer.dataset.positionY;
      
      cardElement.style.cssText = `
        transition: all ${flightTime}s cubic-bezier(0.22, 0.61, 0.36, 1) !important;
        left: ${targetX} !important;
        top: ${targetY} !important;
        transform: translate(-50%, -50%) rotateY(0deg) scale(1) !important;
        opacity: 1 !important;
      `;
      
      setTimeout(() => {
        cardElement.classList.add('landed');
        setTimeout(() => {
          cardElement.style.cssText = '';
          targetContainer.appendChild(cardElement);
          resolve(cardElement);
        }, 300);
      }, flightTime * 1000);
    }, delay);
  });
}

function decideWinner(playerTotal, bankerTotal) {
  if (playerTotal > bankerTotal) return 'Player';
  if (bankerTotal > playerTotal) return 'Banker';
  return 'Tie';
}

function playDealerVoice(action) {
  if (!gameState.soundEnabled || !('speechSynthesis' in window)) return;
  
  const voices = {
    dealStart: "Cards flying! Player first card.",
    playerCard: "Player.",
    bankerCard: "Banker.",
    reveal: "Banker reveals the cards!",
    playerWin: "Player takes the hand!",
    bankerWin: "Banker wins!",
    tie: "It's a tie! Eight times payout!",
    bonus: "Welcome bonus activated! Ten thousand dollars!"
  };
  
  const utterance = new SpeechSynthesisUtterance(voices[action] || action);
  utterance.rate = 1.4;
  utterance.pitch = 1.3;
  utterance.volume = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// DEPOSIT SYSTEM INTEGRATION
function checkDepositStatus() {
  const depositAmount = parseInt(localStorage.getItem('baccarat_deposit_amount') || '0');
  if (depositAmount > 0 && !gameState.depositMade) {
    // Add deposit bonus (50% up to $5k)
    const bonus = Math.min(depositAmount * 0.5, MAX_DEPOSIT_BONUS);
    gameState.balance += depositAmount + bonus;
    gameState.depositMade = true;
    localStorage.setItem('baccarat_deposit_made', 'true');
    showNotification(`💰 Deposit $${depositAmount} + $${bonus} bonus!`, 'info');
    updateUI();
  }
}

function simulateDeposit(amount) {
  // Simulate Digital Bank deposit
  localStorage.setItem('baccarat_deposit_amount', amount.toString());
  checkDepositStatus();
}

// UI Updates
function updateUI() {
  elements.balance.textContent = gameState.balance.toLocaleString();
  elements.winStreak.textContent = gameState.winStreak;
  elements.currentBetAmount.textContent = gameState.currentBet.amount.toLocaleString();
  elements.currentBetText.textContent = gameState.currentBet.betOn || 'None';
  
  // Balance warning
  if (gameState.balance < 100 && !gameState.depositMade) {
    showNotification('⚠️ Low balance! Use Digital Bank to deposit ➡️', 'warning');
  }
}

// WELCOME BONUS NOTIFICATION
function showWelcomeBonus() {
  if (gameState.bonusClaimed) {
    showNotification('🎉 $10,000 WELCOME BONUS ACTIVATED!\nPlay now or deposit more!', 'info');
    playDealerVoice('bonus');
  }
}

// MAIN DEAL FUNCTION
async function dealGame(fastMode = false) {
  if (gameState.currentBet.amount === 0) {
    showNotification('Place your bet first!', 'warning');
    return;
  }
  if (gameState.isDealing) return;
  
  gameState.isDealing = true;
  
  // Lock controls
  elements.dealBtn.disabled = true;
  elements.resetBtn.disabled = true;
  elements.fastDealBtn.disabled = true;
  
  elements.dealerVideo.classList.add('dealing');
  elements.statusLight.classList.add('active');
  elements.dealerStatus.textContent = 'DEALING LIVE';
  
  playDealerVoice('dealStart');
  elements.result.innerHTML = '🃏 CARDS IN THE AIR!';
  elements.result.classList.add('dealing');
  
  // Generate cards
  gameState.playerCards = [getRandomCard(), getRandomCard()];
  gameState.bankerCards = [getRandomCard(), getRandomCard()];
  
  const dealDelay = fastMode ? 250 : 900;
  
  // REAL CASINO SEQUENCE: P1 → B1(down) → P2 → B2(down)
  await flyCardFromDealer(createCardElement(gameState.playerCards[0], 'player1'), 
                         elements.playerCards, 0, fastMode);
  playDealerVoice('playerCard');
  
  const bankerCard1 = createCardElement(gameState.bankerCards[0], 'banker1', true);
  bankerCard1.classList.add('face-down');
  await flyCardFromDealer(bankerCard1, elements.bankerCards, dealDelay/2, fastMode);
  playDealerVoice('bankerCard');
  
  await flyCardFromDealer(createCardElement(gameState.playerCards[1], 'player2'), 
                         elements.playerCards, dealDelay, fastMode);
  playDealerVoice('playerCard');
  
  const bankerCard2 = createCardElement(gameState.bankerCards[1], 'banker2', true);
  bankerCard2.classList.add('face-down');
  await flyCardFromDealer(bankerCard2, elements.bankerCards, dealDelay * 1.5, fastMode);
  playDealerVoice('bankerCard');
  
  // BANKER REVEAL
  await new Promise(resolve => setTimeout(resolve, fastMode ? 600 : 1600));
  playDealerVoice('reveal');
  
  [bankerCard1, bankerCard2].forEach((card, i) => {
    setTimeout(() => {
      card.classList.remove('face-down');
      card.classList.add('flip-reveal');
    }, i * 400);
  });
  
  // TOTALS
  await new Promise(resolve => setTimeout(resolve, fastMode ? 800 : 2200));
  
  const playerTotal = calcTotal(gameState.playerCards);
  const bankerTotal = calcTotal(gameState.bankerCards);
  
  elements.playerTotal.textContent = playerTotal;
  elements.bankerTotal.textContent = bankerTotal;
  
  // WINNER
  await new Promise(resolve => setTimeout(resolve, fastMode ? 1000 : 2800));
  
  const winner = decideWinner(playerTotal, bankerTotal);
  let payout = 0;
  
  elements.result.classList.remove('dealing');
  
  if (winner === 'Tie') {
    payout = gameState.currentBet.amount * 8;
    gameState.balance += payout;
    gameState.winStreak = 0;
    elements.result.innerHTML = `🎀 TIE WIN! +$${payout.toLocaleString()}<br><small>8x PAYOUT</small>`;
  } else if (winner === gameState.currentBet.betOn) {
    payout = winner === 'Banker' ? 
      Math.floor(gameState.currentBet.amount * 1.95) : 
      gameState.currentBet.amount * 2;
    gameState.balance += payout;
    gameState.winStreak++;
    elements.result.innerHTML = `${winner}<br>WINS BIG!<br>+$${payout.toLocaleString()}`;
  } else {
    gameState.winStreak = 0;
    elements.result.innerHTML = `${winner.toUpperCase()}<br>BEATS YOU<br>-$${gameState.currentBet.amount.toLocaleString()}`;
  }
  
  elements.result.className = `result-text ${winner.toLowerCase()}${winner === gameState.currentBet.betOn ? '-win' : ''}`;
  
  updateUI();
  addToHistory(winner, payout);
  
  // Reset bet
  gameState.currentBet = { betOn: null, amount: 0 };
  
  setTimeout(() => {
    gameState.isDealing = false;
    elements.dealBtn.disabled = true;
    elements.resetBtn.disabled = false;
    elements.fastDealBtn.disabled = false;
    elements.dealerVideo.classList.remove('dealing');
    elements.statusLight.classList.remove('active');
    elements.dealerStatus.textContent = 'READY';
  }, fastMode ? 1800 : 4000);
}

// Betting
function initBetting() {
  elements.chips.forEach((chip, index) => {
    chip.addEventListener('click', () => {
      gameState.selectedChip = Number(chip.dataset.value);
      elements.chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
    
    // Auto-select first chip
    if (index === 2) chip.click(); // $25 default
  });
  
  elements.betButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!gameState.selectedChip) {
        showNotification('Select chip first!', 'warning');
        return;
      }
      if (gameState.currentBet.amount + gameState.selectedChip > gameState.balance) {
        showNotification(`Need $${gameState.selectedChip}! Open Digital Bank ➡️`, 'error');
        return;
      }
      
      gameState.currentBet.betOn = btn.dataset.bet;
      gameState.currentBet.amount += gameState.selectedChip;
      gameState.balance -= gameState.selectedChip;
      
      elements.betButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      updateUI();
      elements.dealBtn.disabled = false;
    });
  });
  
  elements.clearBet.addEventListener('click', () => {
    gameState.balance += gameState.currentBet.amount;
    gameState.currentBet = { betOn: null, amount: 0 };
    updateUI();
    elements.dealBtn.disabled = true;
    elements.betButtons.forEach(b => b.classList.remove('selected'));
  });
}

// Controls
function initControls() {
  elements.dealBtn.addEventListener('click', () => dealGame(false));
  elements.fastDealBtn.addEventListener('click', () => dealGame(true));
  elements.resetBtn.addEventListener('click', resetGame);
  
  elements.soundToggle.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    elements.soundToggle.classList.toggle('muted', !gameState.soundEnabled);
  });
  
  elements.bankToggle.addEventListener('click', () => {
    const bankFrame = document.querySelector('.bank-iframe');
    const isOpen = bankFrame.style.transform === 'translateX(0)';
    bankFrame.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0)';
    elements.bankToggle.textContent = isOpen ? '💳 BANK' : '✕';
  });
}

// Notifications & History
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

function addToHistory(winner, payout) {
  const entry = {
    winner,
    payout: payout || 0,
    timestamp: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
  gameState.gameHistory.unshift(entry);
  if (gameState.gameHistory.length > 12) gameState.gameHistory.pop();
  
  elements.gameHistory.innerHTML = gameState.gameHistory.map(entry => `
    <div class="history-item ${entry.payout > 0 ? 'win' : 'loss'}">
      <strong>${entry.winner}</strong>
      ${entry.payout ? `<br>+$${entry.payout.toLocaleString()}` : '<br>- Bet'}
      <small>${entry.timestamp}</small>
    </div>
  `).join('');
}

function resetGame() {
  gameState.playerCards = [];
  gameState.bankerCards = [];
  elements.playerCards.innerHTML = '';
  elements.bankerCards.innerHTML = '';
  elements.playerTotal.textContent = '0';
  elements.bankerTotal.textContent = '0';
  elements.result.textContent = 'Ready for next hand!';
  elements.result.className = 'result-text';
  
  elements.dealBtn.disabled = true;
  elements.resetBtn.disabled = true;
  elements.fastDealBtn.disabled = true;
  
  gameState.currentBet = { betOn: null, amount: 0 };
  updateUI();
  elements.betButtons.forEach(b => b.classList.remove('selected'));
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initBetting();
  initControls();
  updateUI();
  checkDepositStatus();
  
  // Dealer video
  elements.dealerVideo.play().catch(() => {});
  
  // Welcome sequence
  setTimeout(() => {
    showWelcomeBonus();
    showNotification('💳 Digital Bank ready for deposits anytime!', 'info');
  }, 800);
  
  console.log(`🎰 BACCARAT LOADED | Balance: $${gameState.balance.toLocaleString()} | Bonus: ${gameState.bonusClaimed ? 'CLAIMED' : 'AVAILABLE'}`);
  
  // Deposit simulation (for testing)
  window.simulateDeposit = simulateDeposit;
});
