/**
 * Update this within your imperial_auth_v1.0.js
 */
const ImperialAuth = {
    // ... existing code ...

    checkSession: function() {
        const activeUser = sessionStorage.getItem('imperial_active_session');
        if (activeUser) {
            console.log("[SECURITY]: Resuming active session...");
            this.success(activeUser);
            return true;
        }
        return false;
    },

    success: function(user) {
        this.currentUser = user;
        sessionStorage.setItem('imperial_active_session', user); // Persistent for tab
        
        document.getElementById('authOverlay').style.display = 'none';
        ImperialBridge.syncUserSession(user);
        
        this.notify(`Welcome back, Commander ${user}.`, "success");
    },

    notify: function(msg, type = "info") {
        const colors = { success: "#2ecc71", error: "#e74c3c", info: "#5C6AC4" };
        const chat = document.getElementById('chat');
        if (chat) {
            chat.innerHTML += `<div style="color:${colors[type]}; margin: 5px 0;">[SYSTEM]: ${msg}</div>`;
            chat.scrollTop = chat.scrollHeight;
        }
    }
};