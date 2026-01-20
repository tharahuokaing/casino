/**
 * 🛡️ IMPERIAL SECURITY & INTEGRITY v1.0
 * Feature: Secure State Management & Anti-Tamper
 * Author: Huokaing Thara Digital Casino
 */

const ImperialSecurity = (function() {
    const _version = "1.0.0";
    
    // The "Private" Balance - Not accessible via window.balance anymore
    let _vault = {
        credits: 1000.00,
        checksum: ""
    };

    // Generates a simple hash to verify data integrity
    const _generateChecksum = (val) => {
        return btoa("SALT_H_THARA_" + val.toFixed(2));
    };

    return {
        init: function(initialAmount) {
            _vault.credits = initialAmount;
            _vault.checksum = _generateChecksum(initialAmount);
            console.log(`%c [SECURITY] Imperial Vault Shield Activated v${_version} `, "background: #5C6AC4; color: white;");
        },

        // Securely get the balance
        getBalance: function() {
            // Verify integrity before returning
            if (_vault.checksum !== _generateChecksum(_vault.credits)) {
                console.error("🚨 SECURITY ALERT: Unauthorized balance manipulation detected!");
                return 0; // Freeze funds if tampered
            }
            return _vault.credits;
        },

        // Securely update the balance
        updateBalance: function(amount, isAddition) {
            if (isAddition) {
                _vault.credits += amount;
            } else {
                _vault.credits -= amount;
            }
            // Re-seal the vault with a new checksum
            _vault.checksum = _generateChecksum(_vault.credits);
            
            // Sync with visual HUD
            const display = document.getElementById('balanceDisplay');
            if(display) display.innerText = `$${_vault.credits.toFixed(2)}`;
            
            return _vault.credits;
        }
    };
})();

// Initialize the secure vault
ImperialSecurity.init(1000.00);