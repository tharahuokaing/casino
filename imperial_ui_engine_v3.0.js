/**
 * 🛠️ IMPERIAL UI ENGINE v3.0
 * Feature: Complete Body Reconstruction & Event Mapping
 * Author: Huokaing Thara Digital Casino
 */

const ImperialUI = {
    version: "3.0.0",

    init: function() {
        // Construct the entire inner body structure
        document.body.innerHTML = `
            <header id="hud">
                <div class="hud-section brand">
                    <div class="brand-name">HUOKAING THARA</div>
                    <div id="rank">STREET HUSTLER</div>
                    <div class="progress-container">
                        <div id="xpProgress"></div>
                    </div>
                </div>

                <div class="hud-section vault">
                    <div class="label">Imperial Vault</div>
                    <div id="balanceDisplay">$0.00</div>
                </div>

                <div class="hud-section system">
                    <div id="currentTime" style="font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2;">
                        </div>
                    <div id="xpDisplay">XP: 0</div>
                    <div class="status">● SECURE PROTOCOL</div>
                </div>
            </header>

            <main id="chat">
                <div class="sys-msg">[SYSTEM]: Imperial Terminal v3.0 Online. Secure line established.</div>
            </main>

            <footer class="control-panel">
                <div class="input-group">
                    <input type="text" id="userInput" 
                           placeholder="Enter Command (e.g., បាការ៉ាត់ 100 player)" 
                           autocomplete="off" />
                    <button id="execBtn">EXECUTE</button>
                </div>
                
                <div class="quick-tactics">
                    <button class="btn-q b-p" data-cmd="បាការ៉ាត់ 50 player">🃏 Bac $50 (P)</button>
                    <button class="btn-q b-b" data-cmd="បាការ៉ាត់ 50 banker">🏦 Bac $50 (B)</button>
                    <button class="btn-q r-r" data-cmd="រ៉ូឡែត 20 color red">🎡 Rou $20 (Red)</button>
                    <button class="btn-q r-blk" data-cmd="រ៉ូឡែត 20 color black">🎱 Rou $20 (Blk)</button>
                </div>
            </footer>
        `;

        this.bindEvents();
    },

    bindEvents: function() {
        // 1. Bind Execute Button
        const execBtn = document.getElementById('execBtn');
        if (execBtn) {
            execBtn.addEventListener('click', () => {
                if (typeof execute === "function") execute();
            });
        }

        // 2. Bind Enter Key on Input
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (typeof execute === "function") execute();
                }
            });
        }

        // 3. Bind Quick Bet Buttons (Smart Listener)
        document.querySelectorAll('.btn-q').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.getAttribute('data-cmd');
                if (userInput && typeof execute === "function") {
                    userInput.value = cmd;
                    execute();
                }
            });
        });
    }
};

// Start UI Engine immediately upon script load
window.addEventListener('DOMContentLoaded', () => ImperialUI.init());