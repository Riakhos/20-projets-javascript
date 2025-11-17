const videoPlayer = document.querySelector(".video__player")
const playbackToggler = document.querySelector(".js-playback-toggler")


videoPlayer.addEventListener("click", togglePlay)
playbackToggler.addEventListener("click", togglePlay)

function togglePlay() {
  videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause()

  playbackToggler.setAttribute("aria-pressed", !videoPlayer.paused)
  playbackToggler.setAttribute("aria-label", videoPlayer.paused ? "Lancer la vidéo" : "Mettre la vidéo sur pause")

  playbackToggler.querySelector("img").src = videoPlayer.paused ? "ressources/play.svg" : "ressources/pause.svg"
}

const totalTimeDisplay = document.querySelector(".js-total-video-time")
const currentTimeDisplay = document.querySelector(".js-current-video-time")

window.addEventListener("load", fillDurationVariables)

let current
let totalDuration

function fillDurationVariables() {
  current = videoPlayer.currentTime
  totalDuration = videoPlayer.duration

  displayFormattedValue(totalDuration, totalTimeDisplay)
  displayFormattedValue(current, currentTimeDisplay)
}

function displayFormattedValue(val, element) {
  const currentMin = Math.floor(val / 60) // 150 / 60 = 2.5 = 2
  let currentSec = Math.floor(val % 60) // 150 % 60 = 30

  if (currentSec < 10) {
    currentSec = `0${currentSec}`
  }

  element.textContent = `${currentMin}:${currentSec}`
}

const progressBar = document.querySelector(".video__progress-bar")

videoPlayer.addEventListener("timeupdate", handleTimeUpdate)

function handleTimeUpdate() {
  const current = videoPlayer.currentTime

  displayFormattedValue(current, currentTimeDisplay)

  const progressPosition = current / totalDuration
  progressBar.style.transform = `scaleX(${progressPosition})`

  if (videoPlayer.ended) {
    playbackToggler.setAttribute("aria-pressed", false)
    playbackToggler.setAttribute("aria-label", "Lancer la vidéo")
    playbackToggler.querySelector("img").src = "ressources/play.svg"
  }
}

const progressBarContainer = document.querySelector(".video__progress")

progressBarContainer.addEventListener("click", handleProgressNavigation)

function handleProgressNavigation(e) {
  const rect = progressBarContainer.getBoundingClientRect()
  console.log(rect)

  const clickPositionInProgressBar = e.clientX - rect.left
  console.log(clickPositionInProgressBar)

  const clickProgressRatio = clickPositionInProgressBar / rect.width
  console.log(clickProgressRatio)

  videoPlayer.currentTime = videoPlayer.duration * clickProgressRatio
}


const muteBtn = document.querySelector(".js-mute-btn")
const volumeSlider = document.querySelector(".video__volume-range")

muteBtn.addEventListener("click", handleMute)

function handleMute(){
  if(videoPlayer.volume === 0){
    videoPlayer.volume = 1
    volumeSlider.value = 100
  }

  videoPlayer.muted = !videoPlayer.muted 
  updateMuteUI()
}

function updateMuteUI(){
  muteBtn.querySelector("img").src = videoPlayer.muted ? "ressources/mute.svg" : "ressources/unmute.svg"
  muteBtn.setAttribute("aria-pressed", videoPlayer.muted)
  muteBtn.setAttribute("aria-label", videoPlayer.muted ? "Remettre le son en place" : "Mettre en sourdine")

}


volumeSlider.addEventListener("input", handleVolumeModification)

function handleVolumeModification(){
  videoPlayer.volume = volumeSlider.value / 100

  videoPlayer.muted = videoPlayer.volume === 0
  updateMuteUI()
}

const fullScreenToggler = document.querySelector(".js-fullscreen-toggler")
const videoContainer = document.querySelector(".video")

videoPlayer.addEventListener("dblclick", toggleFullScreen)
fullScreenToggler.addEventListener("click", toggleFullScreen)

function toggleFullScreen(){
  if(document.fullscreenElement){
    document.exitFullscreen()
  } else {
    videoContainer.requestFullscreen()
  }
}