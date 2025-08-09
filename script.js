// DOM Elements
const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');
const playButton = document.querySelector('.play-button');
const nextBtn = document.querySelector('.bx-last-page');
const prevBtn = document.querySelector('.bx-first-page');
const songTitle = document.querySelector('.description h3');
const songArtist = document.querySelector('.description h5');
const songImage = document.querySelector('.song-info img');
const activeLine = document.querySelector('.active-line');
const deactiveLine = document.querySelector('.deactive-line');
const volumeIcon = document.querySelector('.player-actions .buttons .bx');
const songItems = document.querySelectorAll('.music-list .items .item');
const searchInput = document.querySelector('.search input');
const listenNowBtn = document.querySelector('.info button');
const heartIcon = document.querySelector('.info .bxs-heart');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const progressActive = document.querySelector('.progress-active');
const progressThumb = document.querySelector('.progress-thumb');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');

// Menu functionality
const menuItems = {
    explore: document.querySelector('.menu:nth-child(2) li:nth-child(1)'),
    artists: document.querySelector('.menu:nth-child(2) li:nth-child(2)'),
    favorites: document.querySelector('.menu:nth-child(3) li'),
    best2025: document.querySelector('.menu:nth-child(4) li:nth-child(1)'),
    best2024: document.querySelector('.menu:nth-child(4) li:nth-child(2)')
};

function filterSongs(criteria) {
    const songItems = document.querySelectorAll('.music-list .items .item');
    songItems.forEach(item => item.style.display = 'flex');

    if (criteria !== 'explore' && criteria !== 'artists') {
        songItems.forEach((item, index) => {
            const song = songs[index];
            let shouldShow = false;

            switch (criteria) {
                case 'favorites':
                    shouldShow = song.name === "Twilight" || song.name === "Voyage";
                    break;
                case 'best2025':
                    shouldShow = song.name === "Sunrise" || song.name === "Voyage";
                    break;
                case 'best2024':
                    shouldShow = song.name === "Twilight" || song.name === "Breeze";
                    break;
                default:
                    shouldShow = true;
            }

            if (!shouldShow) {
                item.style.display = 'none';
            }
        });
    }
}

// Add click event listeners to menu items
Object.entries(menuItems).forEach(([key, item]) => {
    if (item) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            filterSongs(key);
        });
    }
});

// CSS for active menu item
const style = document.createElement('style');
style.textContent = `
    .menu li.active {
        color: #5773ff;
        font-weight: bold;
    }
    .menu li.active i {
        color: #5773ff;
    }
`;
document.head.appendChild(style);

// Initialize active menu
if (menuItems.explore) {
    menuItems.explore.classList.add('active');
}
filterSongs('explore');

// Music Player State
let currentSong = new Audio();
let songs = [
    {
        name: "Sunrise",
        artist: "Lila Rivera",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        img: "assets/song-1.png",
        duration: "03:45"
    },
    {
        name: "Voyage",
        artist: "Tyde Brennnan",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        img: "assets/song-2.png",
        duration: "04:35"
    },
    {
        name: "Breeze",
        artist: "Sola Kim",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        img: "assets/song-3.png",
        duration: "04:22"
    },
    {
        name: "Twilight",
        artist: "Jett Lawsonn",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        img: "assets/song-4.png",
        duration: "03:17"
    },
    {
        name: "Lost Emotions",
        artist: "Rion Clarke",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        img: "assets/trend.png",
        duration: "03:52"
    },
    {
        name: "Ripple Echoes",
        artist: "Kael Fischer",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        img: "assets/player.png",
        duration: "04:15"
    }
];
let currentIndex = 0;
let isPlaying = false;
let isDragging = false;
let volume = 0.7;

// Volume Slider
const volumeSlider = document.createElement('input');
volumeSlider.type = 'range';
volumeSlider.min = '0';
volumeSlider.max = '1';
volumeSlider.step = '0.01';
volumeSlider.value = volume;
volumeSlider.style.width = '80px';
volumeSlider.style.marginLeft = '10px';
volumeSlider.style.accentColor = '#5773ff';
if (volumeIcon) {
    volumeIcon.parentNode.insertBefore(volumeSlider, volumeIcon.nextSibling);
}

// Utility
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Progress Update
function updateProgress() {
    if (!isDragging && !isNaN(currentSong.duration)) {
        const progressPercent = (currentSong.currentTime / currentSong.duration) * 100;
        progressActive.style.width = `${progressPercent}%`;
        progressThumb.style.left = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentSong.currentTime);
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const progressPercent = (clickX / width) * 100;
    progressActive.style.width = `${progressPercent}%`;
    progressThumb.style.left = `${progressPercent}%`;
    currentSong.currentTime = (progressPercent / 100) * currentSong.duration;
}

function dragProgress(e) {
    if (isDragging) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        let progressPercent = (clickX / width) * 100;
        progressPercent = Math.max(0, Math.min(100, progressPercent));
        progressActive.style.width = `${progressPercent}%`;
        progressThumb.style.left = `${progressPercent}%`;
        currentSong.currentTime = (progressPercent / 100) * currentSong.duration;
        currentTimeEl.textContent = formatTime(currentSong.currentTime);
    }
}

function loadSong(index) {
    currentIndex = index;
    currentSong.src = songs[index].file;
    songTitle.textContent = songs[index].name;
    songArtist.textContent = songs[index].artist;
    songImage.src = songs[index].img;
    progressActive.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = songs[index].duration;
}

function playSong() {
    isPlaying = true;
    currentSong.play().then(() => {
        playButton.classList.replace('bxs-right-arrow', 'bx-pause');
    }).catch(error => {
        console.error('Playback failed:', error);
        isPlaying = false;
    });
}

function pauseSong() {
    isPlaying = false;
    currentSong.pause();
    playButton.classList.replace('bx-pause', 'bxs-right-arrow');
}

function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
}

function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
}

function updateVolume() {
    currentSong.volume = volumeSlider.value;
    volume = currentSong.volume;

    if (volume == 0) {
        volumeIcon.classList.replace('bxs-volume-full', 'bxs-volume-mute');
    } else if (volume < 0.5) {
        volumeIcon.classList.replace('bxs-volume-full', 'bxs-volume-low');
    } else {
        volumeIcon.classList.replace('bxs-volume-mute', 'bxs-volume-full');
    }
}

function toggleMute() {
    if (currentSong.volume > 0) {
        currentSong.volume = 0;
        volumeSlider.value = 0;
    } else {
        currentSong.volume = volume;
        volumeSlider.value = volume;
    }
    updateVolume();
}

// Events
if (playButton) {
    playButton.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
}
if (nextBtn) nextBtn.addEventListener('click', nextSong);
if (prevBtn) prevBtn.addEventListener('click', prevSong);

currentSong.addEventListener('timeupdate', updateProgress);
currentSong.addEventListener('ended', nextSong);
currentSong.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(currentSong.duration);
});

if (progressContainer) {
    progressContainer.addEventListener('click', setProgress);
    progressContainer.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (isDragging && progressContainer) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            currentSong.currentTime = (clickX / width) * currentSong.duration;
        }
    });
}

if (progressBar) {
    progressBar.addEventListener('click', setProgress);
    progressBar.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', dragProgress);
}

if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
if (volumeIcon) volumeIcon.addEventListener('click', toggleMute);

songItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.actions')) {
            loadSong(index);
            playSong();
        }
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        songItems.forEach((item, index) => {
            const songName = songs[index].name.toLowerCase();
            const artistName = songs[index].artist.toLowerCase();
            item.style.display = (songName.includes(searchTerm) || artistName.includes(searchTerm)) ? 'flex' : 'none';
        });
    });
}

if (listenNowBtn) {
    listenNowBtn.addEventListener('click', () => {
        const trendingSongIndex = songs.findIndex(song => song.name === "Lost Emotions");
        if (trendingSongIndex !== -1) {
            loadSong(trendingSongIndex);
            playSong();
        }
    });
}

if (heartIcon) {
    heartIcon.addEventListener('click', () => {
        heartIcon.classList.toggle('bxs-heart');
        heartIcon.classList.toggle('bx-heart');
    });
}

// Init
currentSong.volume = volume;
updateVolume();
loadSong(currentIndex);
