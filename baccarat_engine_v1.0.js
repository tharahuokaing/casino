/**
 * 🃏 BACCARAT ENGINE v2.0 - IMPERIAL EDITION
 * Feature: Advanced Analytics & Transaction Logging
 */

const BaccaratEngine = {
    history: [],
    stats: { totalHands: 0, playerWins: 0, bankerWins: 0, ties: 0, totalVolume: 0 },

    // Card mapping for visual feedback
    getCardName: (val) => {
        if (val === 0) return "10/J/Q/K";
        if (val === 1) return "Ace";
        return val;
    },

    play: function(betAmount, side) {
        if (betAmount > balance) return "❌ Error: Insufficient Funds.";
        
        // Draw Cards
        const pCards = [this.draw(), this.draw()];
        const bCards = [this.draw(), this.draw()];
        
        // Calculate Totals
        const pTotal = pCards.reduce((a, b) => a + b, 0) % 10;
        const bTotal = bCards.reduce((a, b) => a + b, 0) % 10;

        // Determine Winner
        let winner = "tie";
        if (pTotal > bTotal) winner = "player";
        else if (bTotal > pTotal) winner = "banker";

        // Calculate Payouts
        let payout = 0;
        let isWin = (side === winner);

        if (isWin) {
            if (side === 'player') payout = betAmount * 2; // 1:1 + Return bet
            else if (side === 'banker') payout = betAmount * 1.95; // 0.95:1 + Return bet
            else if (side === 'tie') payout = betAmount * 9; // 8:1 + Return bet
            balance += (payout - betAmount); 
        } else {
            balance -= betAmount;
        }

        // Update Imperial Stats
        this.updateStats(winner, betAmount, isWin);

        // Return Visual Result
        return this.formatResponse(pCards, bCards, pTotal, bTotal, winner, side, isWin, payout);
    },

    draw: () => {
        const card = Math.floor(Math.random() * 13) + 1;
        return card >= 10 ? 0 : card;
    },

    updateStats: function(winner, amount, isWin) {
        this.stats.totalHands++;
        this.stats.totalVolume += amount;
        if (winner === 'player') this.stats.playerWins++;
        if (winner === 'banker') this.stats.bankerWins++;
        if (winner === 'tie') this.stats.ties++;
        
        this.history.push({
            time: new Date().toLocaleTimeString(),
            winner: winner.toUpperCase(),
            outcome: isWin ? "WIN" : "LOSS"
        });
        
        // Keep only last 10 for history display
        if (this.history.length > 10) this.history.shift();
    },

    formatResponse: function(pCards, bCards, pT, bT, winner, side, isWin, payout) {
        const color = isWin ? "#2ecc71" : "#e74c3c";
        return `
            <div style="border-left: 4px solid ${color}; padding-left: 10px; background: #111;">
                <b style="color: #5C6AC4;">[ROUND #${this.stats.totalHands}]</b><br>
                👤 Player: ${pT} <small>(${pCards.join('+')})</small><br>
                🏦 Banker: ${bT} <small>(${bCards.join('+')})</small><br>
                🏆 Result: <b style="color: gold;">${winner.toUpperCase()}</b><br>
                -------------------------<br>
                ${isWin ? `✅ WON: $${payout.toFixed(2)}` : `❌ LOST: $${balance.toFixed(2)}`}<br>
                💰 NEW BALANCE: $${balance.toFixed(2)}
            </div>
            <div id="stats-panel" style="display: flex; gap: 20px; color: #888; font-size: 0.8rem; margin: 10px;">
                <span>TOTAL VOLUME: <b id="stat-vol">$0</b></span>
                <span>PLAYER WINS: <b id="stat-p">0</b></span>
                <span>BANKER WINS: <b id="stat-b">0</b></span>
            </div>
        `;
    }
};