/**
 * 🕰️ IMPERIAL TIME PROTOCOL v1.0
 * Feature: Dual Human/Machine Clock Sync
 * Author: Huokaing Thara Digital Casino
 */

const ImperialTime = {
    version: "1.0.0",

    start: function() {
        const timeDisplay = document.getElementById('currentTime');
        
        const update = () => {
            const now = new Date();
            
            // 1. Human UTC Format
            const humanUTC = now.toUTCString();
            
            // 2. Computer Unix Format (Milliseconds/1000)
            const computerUnix = Math.floor(now.getTime() / 1000);

            if (timeDisplay) {
                timeDisplay.innerHTML = `
                    <div style="color: #5C6AC4; font-weight: bold;">${humanUTC}</div>
                    <div style="color: #444; font-size: 0.6rem; letter-spacing: 2px;">
                        UNIX_MS: <span style="color: #2ecc71;">${computerUnix}</span>
                    </div>
                `;
            }
        };

        // Sync clock every second
        setInterval(update, 1000);
        update(); // Initial call
    }
};

// Initialize clock
window.addEventListener('DOMContentLoaded', () => ImperialTime.start());