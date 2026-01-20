/**
 * 🔔 IMPERIAL NOTIFICATIONS v1.0
 */

const ImperialNotify = {
    send: function(title, message) {
        const id = 'toast-' + Date.now();
        const toast = `
            <div id="${id}" style="background:#1a1a1a; border-right:4px solid #5C6AC4; padding:15px; margin-bottom:10px; border-radius:4px; box-shadow:0 4px 10px rgba(0,0,0,0.5); animation: slideIn 0.3s forwards;">
                <div style="color:#5C6AC4; font-weight:bold; font-size:0.8rem;">${title}</div>
                <div style="color:#eee; font-size:0.75rem;">${message}</div>
            </div>
        `;
        
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style = "position:fixed; bottom:20px; right:20px; z-index:10000; width:250px;";
            document.body.appendChild(container);
        }
        
        container.innerHTML += toast;
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.style.opacity = '0';
            setTimeout(() => el?.remove(), 500);
        }, 4000);
    }
};