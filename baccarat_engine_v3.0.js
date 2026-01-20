/**
 * 🃏 BACCARAT ENGINE v3.0 - PROFESSIONAL EDITION
 * Feature: Full Third Card Rules (Macau/Vegas Standard)
 * Author: Huokaing Thara Digital Casino
 */

const BaccaratEngineV3 = {
    version: "3.0.0",
    stats: { totalHands: 0, playerWins: 0, bankerWins: 0, ties: 0, totalVolume: 0 },

    drawCard: () => {
        const card = Math.floor(Math.random() * 13) + 1;
        return card >= 10 ? 0 : card; // 10, J, Q, K are 0
    },

    calculate: (cards) => cards.reduce((a, b) => a + b, 0) % 10,

    play: function(betAmount, side) {
        if (betAmount > balance) return "❌ Error: Insufficient Funds.";
        
        // Initial Deal (2 cards each)
        let pHand = [this.drawCard(), this.drawCard()];
        let bHand = [this.drawCard(), this.drawCard()];

        let pTotal = this.calculate(pHand);
        let bTotal = this.calculate(bHand);

        // --- THE THIRD CARD RULES ---
        let pThirdCard = -1;

        // 1. Natural Win Check (8 or 9) - No more cards drawn
        if (pTotal < 8 && bTotal < 8) {
            
            // 2. Player's Rule
            if (pTotal <= 5) {
                pThirdCard = this.drawCard();
                pHand.push(pThirdCard);
                pTotal = this.calculate(pHand);
            }

            // 3. Banker's Rule (Depends on Player's 3rd card)
            let bDraws = false;
            if (pThirdCard === -1) {
                if (bTotal <= 5) bDraws = true; // Player didn't draw, Banker draws on 0-5
            } else {
                // Banker drawing logic based on Player's 3rd card value
                if (bTotal <= 2) bDraws = true;
                else if (bTotal === 3 && pThirdCard !== 8) bDraws = true;
                else if (bTotal === 4 && [2, 3, 4, 5, 6, 7].includes(pThirdCard)) bDraws = true;
                else if (bTotal === 5 && [4, 5, 6, 7].includes(pThirdCard)) bDraws = true;
                else if (bTotal === 6 && [6, 7].includes(pThirdCard)) bDraws = true;
            }

            if (bDraws) {
                bHand.push(this.drawCard());
                bTotal = this.calculate(bHand);
            }
        }

        // Determine Outcome
        let winner = "tie";
        if (pTotal > bTotal) winner = "player";
        else if (bTotal > pTotal) winner = "banker";

        // Handle Money
        let isWin = (side.toLowerCase() === winner);
        let payout = 0;

        if (isWin) {
            if (winner === 'player') payout = betAmount * 2;
            else if (winner === 'banker') payout = betAmount * 1.95;
            else if (winner === 'tie') payout = betAmount * 9;
            balance += (payout - betAmount);
        } else {
            balance -= betAmount;
        }

        this.recordStats(winner, betAmount);
        return this.formatVisual(pHand, bHand, pTotal, bTotal, winner, isWin, payout, betAmount);
    },

    recordStats: function(winner, amount) {
        this.stats.totalHands++;
        this.stats.totalVolume += amount;
        if (winner === 'player') this.stats.playerWins++;
        else if (winner === 'banker') this.stats.bankerWins++;
        else this.stats.ties++;
    },

    formatVisual: function(pCards, bCards, pT, bT, winner, isWin, payout, bet) {
        const themeColor = isWin ? "#2ecc71" : "#e74c3c";
        return `
            <div style="background: #1a1a1a; border-left: 5px solid ${themeColor}; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace;">
                <div style="color: #888; font-size: 0.7rem;">ENGINE V3.0 | ROUND #${this.stats.totalHands}</div>
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                    <div style="text-align: center;">
                        <span style="color: #3498db;">PLAYER</span><br>
                        <span style="font-size: 1.5rem;">${pT}</span><br>
                        <small>[${pCards.join('|')}]</small>
                    </div>
                    <div style="align-self: center; color: #444;">VS</div>
                    <div style="text-align: center;">
                        <span style="color: #e67e22;">BANKER</span><br>
                        <span style="font-size: 1.5rem;">${bT}</span><br>
                        <small>[${bCards.join('|')}]</small>
                    </div>
                </div>
                <div style="text-align: center; border-top: 1px solid #333; padding-top: 10px;">
                    RESULT: <b style="color: gold;">${winner.toUpperCase()}</b><br>
                    ${isWin ? `<span style="color: #2ecc71;">WIN +$${(payout - bet).toFixed(2)}</span>` : `<span style="color: #e74c3c;">LOSS -$${bet.toFixed(2)}</span>`}
                </div>
            </div>
        `;
    }
};