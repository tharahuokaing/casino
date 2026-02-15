// Banking System
document.getElementById('bankForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const transactionType = document.getElementById('transactionType').value;
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.textContent.replace(/[^0-9.-]+/g, ""));
    
    // Card type selection
    let cardType = document.querySelector('.card-icon.active').id === 'visaIcon' ? 'visa' : 'mastercard';
    
    let newBalance;
    let message;
    
    if (transactionType === 'deposit') {
        newBalance = currentBalance + amount;
        message = `Deposited $${amount.toFixed(2)} via ${cardType}. New balance: $${newBalance.toFixed(2)}`;
    } else {
        if (amount > currentBalance) {
            alert("Insufficient funds!");
            return;
        }
        newBalance = currentBalance - amount;
        message = `Withdrew $${amount.toFixed(2)} via ${cardType}. New balance: $${newBalance.toFixed(2)}`;
    }
    
    // Update balance display
    balanceElement.textContent = `$${newBalance.toFixed(2)}`;
    
    // Show transaction message
    alert(message);
});

// Card type selection
document.getElementById('visaIcon').addEventListener('click', function() {
    document.getElementById('visaIcon').classList.add('active');
    document.getElementById('mastercardIcon').classList.remove('active');
    document.getElementById('cardType').value = 'visa';
});

document.getElementById('mastercardIcon').addEventListener('click', function() {
    document.getElementById('mastercardIcon').classList.add('active');
    document.getElementById('visaIcon').classList.remove('active');
    document.getElementById('cardType').value = 'mastercard';
});

// Game Functions
function play(game) {
    const resultsDiv = document.getElementById('gameResults');
    let result = "";
    
    // Game logic implementations
    if (game === 'blackjack') {
        result = blackjack();
    } else if (game === 'baccarat') {
        result = baccarat();
    } else if (game === 'roulette') {
        result = roulette();
    } else if (game === 'slots') {
        result = slots();
    } else if (game === 'hi-lo') {
        result = hiLo();
    } else if (game === 'craps') {
        result = craps();
    } else if (game === 'dragon-tiger') {
        result = dragonTiger();
    } else if (game === 'poker-draw') {
        result = videoPoker();
    } else if (game === 'keno') {
        result = keno();
    } else if (game === 'big-six') {
        result = bigSix();
    }
    
    resultsDiv.innerHTML = `
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <strong>${game.charAt(0).toUpperCase() + game.slice(1)}</strong>
            <div style="margin-top: 10px;">${result}</div>
        </div>
    `;
}

// Game implementations
function blackjack() {
    const deck = ['2','3','J','A','K','Q','10','9','8','7','6','5','4'];
    const suits = ['♠','♥','♦','♣'];
    const player = [
        [randomFromArray(deck), randomFromArray(suits)],
        [randomFromArray(deck), randomFromArray(suits)]
    ];
    const dealer = [
        [randomFromArray(deck), randomFromArray(suits)],
        [randomFromArray(deck), randomFromArray(suits)]
    ];
    
    const playerScore = calculateScore(player);
    const dealerScore = calculateScore(dealer);
    
    let result = `Player: ${player[0].join('')}${player[1].join('')} = ${playerScore}<br>`;
    result += `Dealer: ${dealer[0].join('')}${dealer[1].join('')} = ${dealerScore}<br>`;
    
    if (playerScore > dealerScore && playerScore <= 21) {
        result += "Player wins!";
    } else if (dealerScore > playerScore && dealerScore <= 21) {
        result += "Dealer wins!";
    } else {
        result += "Push!";
    }
    
    return result;
}

function baccarat() {
    const player = dealBaccarat();
    const banker = dealBaccarat();
    const pScore = player % 10;
    const bScore = banker % 10;
    
    let result = `Player: ${pScore}<br>Banker: ${bScore}<br>`;
    
    if (Math.abs(pScore - bScore) <= 1) {
        result += "Banker wins!";
    } else if (pScore > bScore) {
        result += "Player wins!";
    } else {
        result += "Tie!";
    }
    
    return result;
}

function roulette() {
    const spin = Math.floor(Math.random() * 37);
    const bet = Math.floor(Math.random() * 37);
    const win = (spin === bet) ? 35 : 0;
    
    return `Spin: ${spin}<br>Your bet: ${bet}<br>Winnings: ${win}x`;
}

function slots() {
    const symbols = '🍒🍋🍊🍉🍇'.split('');
    const spin = [
        randomFromArray(symbols),
        randomFromArray(symbols),
        randomFromArray(symbols)
    ];
    
    let payout = 0;
    if (spin[0] === spin[1] && spin[1] === spin[2]) {
        payout = 10;
    } else if (spin[0] === spin[1] || spin[1] === spin[2]) {
        payout = 2;
    }
    
    return `Result: ${spin.join('')}<br>Winnings: ${payout}x`;
}

function hiLo() {
    const base = Math.floor(Math.random() * 13) + 1;
    const answer = Math.floor(Math.random() * 13) + 1;
    const result = (answer > base) ? "Win" : "Lose";
    
    return `Base: ${base}<br>Your number: ${answer}<br>Result: ${result}`;
}

function craps() {
    const roll = () => Math.floor(Math.random() * 6) + 1;
    const firstRoll = roll() + roll();
    let result;
    
    if ([7, 11].includes(firstRoll)) {
        result = "Win!";
    } else if ([2, 3, 12].includes(firstRoll)) {
        result = "Lose";
    } else {
        result = `Point ${firstRoll}`;
    }
    
    return `Roll: ${firstRoll}<br>Result: ${result}`;
}

function dragonTiger() {
    const dragon = Math.random() > 0.5 ? "Dragon" : "Tiger";
    const tiger = Math.random() > 0.5 ? "Tiger" : "Dragon";
    let winner;
    
    if (dragon === tiger) {
        winner = "Tie";
    } else if (dragon === "Dragon") {
        winner = "Dragon";
    } else {
        winner = "Tiger";
    }
    
    return `Dragon: ${dragon}<br>Tiger: ${tiger}<br>Winner: ${winner}`;
}

function videoPoker() {
    const ranks = '23456789TJQKA'.split('');
    const hand = [];
    
    for (let i = 0; i < 5; i++) {
        hand.push(randomFromArray(ranks));
    }
    
    const sortedHand = [...hand].sort();
    const hasPair = new Set(sortedHand).size < 5;
    const result = hasPair ? "Pair" : "High Card";
    
    return `Hand: ${sortedHand.join(' ')}<br>Result: ${result}`;
}

function keno() {
    const draw = new Set();
    while (draw.size < 20) {
        draw.add(Math.floor(Math.random() * 80) + 1);
    }
    
    const spots = [
        Math.floor(Math.random() * 80) + 1,
        Math.floor(Math.random() * 80) + 1,
        Math.floor(Math.random() * 80) + 1
    ];
    
    const hits = spots.filter(spot => draw.has(spot)).length;
    const payout = hits === 3 ? 10 : hits === 2 ? 5 : 0;
    
    return `Hits: ${hits}<br>Winnings: ${payout}x`;
}

function bigSix() {
    const symbols = ['💰','🍒','💎','🐎','🚗','🏆'];
    const spin = randomFromArray(symbols);
    const payout = (spin === '💰') ? 40 : 10;
    
    return `Result: ${spin}<br>Winnings: ${payout}x`;
}

// Helper functions
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function calculateScore(cards) {
    const values = {
        '2': 2, '3': 3, 'J': 10, 'A': 11, 'K': 10, 'Q': 10, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4
    };
    
    let score = cards.reduce((sum, card) => sum + values[card[0]], 0);
    let aces = cards.filter(card => card[0] === 'A').length;
    
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    
    return score;
}

function dealBaccarat() {
    return (Math.floor(Math.random() * 10) + 1) + (Math.floor(Math.random() * 10) + 1);
}
