// Function to update live time and background music
function initMusicAndClock() {
    const musicContainer = document.createElement('div');
    musicContainer.id = 'music-control';
    musicContainer.style = `
        display: inline-flex;
        align-items: center;
        background: rgba(0,0,0,0.7);
        border: 1px solid #d4af37;
        padding: 5px 10px;
        border-radius: 20px;
        cursor: pointer;
        margin-left: 10px;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        color: #d4af37;
        font-family: sans-serif;
    `;
    
    musicContainer.innerHTML = `
        <span id="music-icon">▶️ MUSIC</span>
        <audio id="bg-audio" loop>
            <source src="https://youtu.be/snazTiTFlrA?si=Q06N8xPQ4jYZBwFG" type="audio/mpeg">
        </audio>
    `;
    
    document.body.appendChild(musicContainer);

    const audio = document.getElementById('bg-audio');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false;

    musicContainer.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicIcon.textContent = "▶️ MUSIC";
        } else {
            audio.play();
            musicIcon.textContent = "⏸️ PLAYING";
        }
        isPlaying = !isPlaying;
    });
}

// Call the function to initialize
initMusicAndClock();
