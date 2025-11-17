/**
 * Video player interactions
 * -------------------------
 * Sélecteurs et gestion des interactions principales du lecteur vidéo.
 * Ce fichier gère :
 *  - le clic sur la vidéo pour lancer / mettre en pause,
 *  - le bouton secondaire (toggler) pour contrôler la lecture,
 *  - la mise à jour des attributs ARIA pour l'accessibilité.
 */

// Élément vidéo principal (<video> ou wrapper) et bouton de contrôle
const videoPlayer = document.querySelector(".video__player");
const playbackToggler = document.querySelector(".js-playback-toggler");

// Attacher les écouteurs seulement si les éléments existent pour éviter des erreurs si le script est chargé avant le HTML ou dans une page sans ces composants.
if (videoPlayer) videoPlayer.addEventListener("click", togglePlay);
if (playbackToggler) playbackToggler.addEventListener("click", togglePlay);

/**
 * Toggle play/pause
 * ------------------
 * Basculer l'état de lecture de la vidéo et mettre à jour l'UI associée.
 * Effets secondaires :
 *  - met à jour `aria-pressed` et `aria-label` sur le bouton de contrôle
 *  - met à jour l'icône (<img>) à l'intérieur du bouton si présente
 *
 * Remarques d'accessibilité :
 *  - `aria-pressed` indique l'état binaire du contrôle,
 *  - `aria-label` fournit une description claire pour les lecteurs d'écran.
 */
function togglePlay() {
	if (!videoPlayer) return; // sécurité

	// Basculer la lecture
	videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause(); 

	// Mettre à jour les attributs ARIA et l'icône uniquement si le toggler existe
	playbackToggler.setAttribute('aria-pressed', !videoPlayer.paused);
	playbackToggler.setAttribute('aria-label', !videoPlayer.paused ? 'Lancer la vidéo' : 'Mettre la vidéo en pause');

	playbackToggler.querySelector('img').src = !videoPlayer.paused ? 'ressources/play.svg' : 'ressources/pause.svg';
}

// Élément affichage durée totale de la vidéo (DOM)
const totalTimeDisplay = document.querySelector('.js-total-video-time');
// Élément affichage temps courant de la vidéo (DOM)
const currentTimeDisplay = document.querySelector('.js-current-video-time');

// Valeur courante en secondes (mise à jour lors de la lecture)
let current;
// Durée totale de la vidéo en secondes (remplie après chargement des métadonnées)
let totalDuration;

window.addEventListener('load', fillDurationVariables);

/**
 * Remplit les variables `current` et `totalDuration` à partir de l'élément vidéo
 * puis met à jour les affichages visibles (durée totale et temps actuel).
 * Appelée au chargement de la page (load).
 */
function fillDurationVariables() {
	current = videoPlayer.currentTime;
	totalDuration = videoPlayer.duration;

	displayFormattedValue(totalDuration, totalTimeDisplay);
	displayFormattedValue(current, currentTimeDisplay);
}

/**
 * Convertit une valeur en secondes en une chaîne "MM:SS" et l'affiche dans
 * l'élément DOM passé en paramètre.
 *
 * @param {number} val - durée en secondes.
 * @param {Element} element - élément DOM où afficher le texte formaté.
 */
function displayFormattedValue(val, element) {
	const currentMin = Math.floor(val / 60); // minutes entières
	let currentSec = Math.floor(val % 60); // secondes (réaffectable pour le 0-padding)

	if (currentSec < 10) {
		currentSec = `0${currentSec}`;
	}

	element.textContent = `${currentMin}:${currentSec}`;
}

const progressBar = document.querySelector('.video__progress-bar');

videoPlayer.addEventListener('timeupdate', handleTimeUpdate);

/**
 * Met à jour la barre de progression et l'affichage du temps courant
 * lors de la lecture de la vidéo.
 */
function handleTimeUpdate() {
	const current = videoPlayer.currentTime;

	displayFormattedValue(current, currentTimeDisplay);

	const progressPosition = current / totalDuration;
	progressBar.style.transform = `scaleX(${progressPosition})`;

	if (videoPlayer.ended) {
		playbackToggler.setAttribute('aria-pressed', 'false');
		playbackToggler.setAttribute('aria-label', 'Lancer la vidéo');
		playbackToggler.querySelector('img').src = 'ressources/play.svg';

	}
}

const progressBarContainer = document.querySelector('.video__progress');

progressBarContainer.addEventListener('click', handleProgressNavigation);

/**
 * Gère la navigation dans la vidéo en fonction du clic sur la barre de progression.
 * @param {MouseEvent} event - événement de clic.
 */
function handleProgressNavigation(event) {
	const rect = progressBarContainer.getBoundingClientRect();
	
	// position X du clic dans la barre
	const clickPositionInProgressBar = event.clientX - rect.left;

	const clickProgressRatio = clickPositionInProgressBar / rect.width;

	videoPlayer.currentTime = clickProgressRatio * totalDuration;
}

const muteBtn = document.querySelector('.js-mute-btn');
const volumeSlider = document.querySelector('.video__volume-range');

muteBtn.addEventListener('click', handleMute);

/**
 * Gère le clic sur le bouton de mute/unmute.
 */
function handleMute() {
	if (videoPlayer.volume === 0) {
		videoPlayer.volume = 1;
		volumeSlider.value = 100;
	}

	videoPlayer.muted = !videoPlayer.muted;
	updateMMuteUI();
}

function updateMMuteUI() {
	muteBtn.querySelector('img').src = videoPlayer.muted ? 'ressources/mute.svg' : 'ressources/unmute.svg';
	muteBtn.setAttribute('aria-pressed', videoPlayer.muted);
	muteBtn.setAttribute('aria-label', videoPlayer.muted ? 'Remettre le son en place' : 'Mettre en sourdine');
}

volumeSlider.addEventListener('input', handleVolumeModification);

/**
 * Gère la modification du volume via le slider.
 */
function handleVolumeModification() {
	videoPlayer.volume = volumeSlider.value / 100;
	videoPlayer.muted = videoPlayer.volume === 0;

	updateMMuteUI();
}

const fullscreenToggler = document.querySelector('.js-fullscreen-toggler');
const videoContainer = document.querySelector('.video');

videoPlayer.addEventListener('dblclick', toggleFullScreen);
fullscreenToggler.addEventListener('click', toggleFullScreen);

/**
 * Bascule le mode plein écran pour le lecteur vidéo.
 */
function toggleFullScreen() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		videoContainer.requestFullscreen();
	}
}