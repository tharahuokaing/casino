/**
 * 🔊 CASINO AUDIO MANAGER v1.0
 * Feature: Synthetic Sound Generation (No external files needed)
 * Author: Huokaing Thara Digital Casino
 */

const CasinoAudio = {
    version: "1.0.0",
    enabled: true,
    ctx: null,

    init: function() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    // Play a short "Card Deal" sound
    playCard: function() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    // Play a "Win Chime"
    playWin: function() {
        if (!this.enabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.1));
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + (i * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i * 0.1) + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (i * 0.1));
            osc.stop(this.ctx.currentTime + (i * 0.1) + 0.3);
        });
    },

    // Play a "Loss" sound
    playLoss: function() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }
};