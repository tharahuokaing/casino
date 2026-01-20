/**
 * 🌉 IMPERIAL BRIDGE v1.0
 * Feature: Cross-Script Data Sync (Auth + Security + Rank)
 * Author: Huokaing Thara Digital Casino
 */

const ImperialBridge = {
    version: "1.0.0",

    // This is called by ImperialAuth.success()
    syncUserSession: function(username) {
        console.log(`%c [BRIDGE] Syncing data for: ${username} `, "background: #2ecc71; color: #000;");

        // 1. Fetch User Data from LocalStorage
        const rawData = localStorage.getItem(`h_thara_user_${username}`);
        if (!rawData) return;

        const userData = JSON.parse(rawData);

        // 2. Push Balance to ImperialSecurity
        // We use the updateBalance logic to set the starting vault
        ImperialSecurity.init(userData.balance || 1000.00);

        // 3. Push XP to ImperialRank
        if (typeof ImperialRank !== "undefined") {
            ImperialRank.loadData(userData.xp || 0);
        }

        // 4. Update HUD Visuals
        this.refreshHUD();
    },

    // Save everything back to the specific user's slot
    saveAll: function() {
        const user = ImperialAuth.currentUser;
        if (!user) return;

        const currentData = JSON.parse(localStorage.getItem(`h_thara_user_${user}`));
        
        const updatedData = {
            ...currentData,
            balance: ImperialSecurity.getBalance(),
            xp: ImperialRank.getSaveData()
        };

        localStorage.setItem(`h_thara_user_${user}`, JSON.stringify(updatedData));
        console.log("[BRIDGE] Imperial Vault Auto-Saved.");
    },

    refreshHUD: function() {
        const bal = ImperialSecurity.getBalance();
        document.getElementById('balanceDisplay').innerText = `$${bal.toFixed(2)}`;
        ImperialRank.updateHUD();
    }
};

// Auto-Save every 30 seconds as a background process
setInterval(() => ImperialBridge.saveAll(), 30000);