const videoPlayer = document.querySelector('.video__player');
const playbackToggler = document.querySelector('.js-playback-toggler');

videoPlayer.addEventListener('click', togglePlay);
playbackToggler.addEventListener('click', togglePlay);

function togglePlay() {
	videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();

	playbackToggler.setAttribute('aria-pressed', !videoPlayer.paused);
	playbackToggler.setAttribute('aria-label', !videoPlayer.paused ? 'Lancer la vidéo' : 'Mettre la vidéo en pause');

	playbackToggler.querySelector('img').src = !videoPlayer.paused ? 'ressources/play.svg' : 'ressources/pause.svg';
}