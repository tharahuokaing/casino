/**
 * 🚀 IMPERIAL LOADER v1.0
 * Feature: Hot-swapping game engines
 */	

const ImperialLoader = {
    activeEngine: null,

    loadGame: function(gameType) {
        this.notify(`Initializing ${gameType.toUpperCase()} Engine...`);
        
        switch(gameType) {
            case 'baccarat':
                this.activeEngine = BaccaratEngineV3;
                break;
            case 'roulette':
                // this.activeEngine = RouletteEngineV1; (Future expansion)
                break;
            default:
                this.notify("Unknown Engine Protocol.", "error");
        }
    },

    notify: (msg, type) => ImperialAuth.notify(msg, type)
};