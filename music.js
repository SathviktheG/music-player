document.addEventListener('DOMContentLoaded', () => {
    const trackData = [
        {id: 'track1',songName: "Kompa",filePath: "resource/songs/kompa.mp3",coverPath: "resource/songcover/kompa.webp",artist: "Sathvik"},
        {id: 'track2',songName: "Don't copy my flow",filePath: "resource/songs/dontcopymyflow.mp3",coverPath: "resource/songcover/dontcopymyflow.webp",artist: "Oota"},
        {id: 'track3',songName: "islands",filePath: "resource/songs/islands.mp3",coverPath: "resource/songcover/islandskompa.jpg",artist: "Sathvik"},
        {id: 'track4',songName: "Rarin - kompa",filePath: "resource/songs/kompararin.mp3",coverPath: "resource/songcover/kompararin.jpg",artist: "Rarin"},
        {id: 'track5',songName: "call me girl",filePath: "resource/songs/callmegirl.mp3",coverPath: "resource/songcover/rarincallmegirl.jpg",artist: "Rarin"},
        {id: 'track6',songName: "Her love",filePath: "resource/songs/herlove.mp3",coverPath: "resource/songcover/rarinherlove.jpg",artist: "Rarin"},
        {id: 'track7',songName: "Mamacita",filePath: "resource/songs/mamacita.mp3",coverPath: "resource/songcover/mamacita.jpg",artist: "Rarin"},
        {id: 'track8',songName: "get away",filePath: "resource/songs/getaway.mp3",coverPath: "resource/songcover/0.jpg",artist: "G-eazy"},
        {id: 'track9',songName: "show you the world",filePath: "resource/songs/showyoutheworld.mp3",coverPath: "resource/songcover/1.jpg",artist: "G-eazy, kelhani"},
        {id: 'track10',songName: "Been on",filePath: "resource/songs/beenon.mp3",coverPath: "resource/songcover/2.jpg",artist: "G-eazy"},
        {id: 'track11',songName: "last night",filePath: "resource/songs/lastnight.mp3",coverPath: "resource/songcover/3.jpg",artist: "G-eazy"},
        {id: 'track12',songName: "Almost famous",filePath: "resource/songs/almostfamous.mp3",coverPath: "resource/songcover/4.jpg",artist: "G-eazy"},
    ];

    const audioPlayer = new Audio();  // Create an Audio object
    const progressRange = document.getElementById('progressRange');
    const playPauseButton = document.getElementById('play');
    const backwardButton = document.getElementById('back');
    const forwardButton = document.getElementById('next');
    const currentCover = document.getElementById('currentCover');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationTimeDisplay = document.getElementById('durationTime');
    const songNameElement = document.getElementById('currentSongName');
    const artistElement = document.getElementById('currentArtist');
    const nowPlayingInfo = document.getElementById('nowPlayingInfo');
    let isPlaying = false;
    let currentTrackIndex = 0;

    function loadTrack(trackIndex) {
        if (trackIndex >= trackData.length || trackIndex < 0) return; // Exit if index is out of range

        const data = trackData[trackIndex];
        audioPlayer.src = data.filePath;
        currentCover.src = data.coverPath;
        songNameElement.textContent = data.songName;
        artistElement.textContent = data.artist;
        applyScrollEffect(); // reapply scroll effect on track change
        audioPlayer.play(); // automatically start playing the selected track
        isPlaying = true; // set play state to true
        updatePlayPauseButton(); // update play/pause button to show the correct state
    }

    // load track data into .musc elements and add click event listeners
    trackData.forEach((data, index) => {
        const muscElements = document.querySelectorAll(`.musc[data-id="${data.id}"]`);

        muscElements.forEach(muscElement => {
            const songCover = muscElement.querySelector('.thumbnail img');
            const songNameElement = muscElement.querySelector('.songname');
            const artistElement = muscElement.querySelector('.artist');

            songCover.src = data.coverPath;
            songNameElement.textContent = data.songName;
            artistElement.textContent = data.artist;

            muscElement.addEventListener('click', () => {
                currentTrackIndex = index; // update current track index
                loadTrack(currentTrackIndex);
            });
        });
    });
    // for the menu to support further nav options
    const menuItems = document.querySelectorAll('#menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            alert(`this feather is still in development`);
        });
    });

    // play/pause functionality
    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        playPauseButton.querySelector('img').src = isPlaying ? 'resource/pause.svg' : 'resource/play.svg';
    }

    playPauseButton.addEventListener('click', togglePlayPause);

    // event listener for audioPlayer play event
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseButton();
    });

    // event listener for audioPlayer pause event
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseButton();
    });

    // backward and forward
    backwardButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + trackData.length) % trackData.length;
        loadTrack(currentTrackIndex);
    });

    forwardButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % trackData.length;
        loadTrack(currentTrackIndex);
    });

    //change in rnage slider with change in song time
    audioPlayer.addEventListener('timeupdate', () => {
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        progressRange.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    });

    // update duration display when metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });

    // seek functionality
    progressRange.addEventListener('input', () => {
        const newTime = (progressRange.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // if name exceeds container
    function applyScrollEffect() {
        if (songNameElement.scrollWidth > nowPlayingInfo.clientWidth) {
            songNameElement.style.animation = 'scrollText 10s linear infinite';
        } else {
            songNameElement.style.animation = 'none';
        }

        if (artistElement.scrollWidth > nowPlayingInfo.clientWidth) {
            artistElement.style.animation = 'scrollText 10s linear infinite';
        } else {
            artistElement.style.animation = 'none';
        }
    }

    applyScrollEffect();
    window.addEventListener('resize', applyScrollEffect); // Re-check on window resize

    // first song loaded
    loadTrack(currentTrackIndex);

    //play next song 
    audioPlayer.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % trackData.length;
        loadTrack(currentTrackIndex);
    });
});
// working version 7