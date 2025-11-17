const togglePlayBtn = document.querySelector(".js-pomodoro-toggle-btn")
togglePlayBtn.addEventListener("click", togglePomodoro)

let isRunning = false
function togglePomodoro() {
  if (!isRunning) {
    startPomodoro()
  }
  else {
    pausePomodoro()
  }
}

let isWorking = true
let workTimeMs = 30 * 60 * 1000
let restTimeMs = 5 * 60 * 1000
let timerID = null
let lastDisplayedSec = null
let endTimeMs = null

function startPomodoro() {
  isRunning = true
  updatePlayPauseUI(true)

  const timeLeftMs = isWorking ? workTimeMs : restTimeMs

  endTimeMs = Date.now() + timeLeftMs

  timerID = setInterval(handleTicks, 10)
}

function updatePlayPauseUI(isPlaying) {
  togglePlayBtn.querySelector("img").src = isPlaying ? "ressources/pause.svg" : "ressources/play.svg"
  togglePlayBtn.setAttribute("data-toggle", isPlaying ? "pause" : "play")
  togglePlayBtn.setAttribute("aria-label", isPlaying ? "Mettre en pause le Pomodoro" : "Démarrer le pomodoro")
  togglePlayBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false")

  handleUnderlineAnimation(isPlaying ? 
    {work: isWorking, rest: !isWorking} :
    {work: false, rest: false}
  )

}

function handleUnderlineAnimation(itemState) {
  for(const item in itemState){
    const el = document.querySelector(`.js-pomodoro-${item}-text`)

    if(itemState[item]) {
      el.classList.add("js-active-pomodoro")
    } else {
      el.classList.remove("js-active-pomodoro")
    }
  }
}

function handleTicks(){
  const remainingMs = Math.max(0, endTimeMs - Date.now())

  if(remainingMs === 0){
    switchPeriod()
    return
  }
  // 5000 - 2000 = 3000


  const currentRemainingSeconds = Math.floor(remainingMs / 1000)
  // 59,99
  // 59,40
  // 59,17
  // 58,78

  if(currentRemainingSeconds !== lastDisplayedSec) {

    lastDisplayedSec = currentRemainingSeconds
    updatePomodoro(currentRemainingSeconds)

  }
}

const displayWork = document.querySelector(".pomodoro__worktime")
const displayPause = document.querySelector(".pomodoro__resttime")

function updatePomodoro(secondsLeft){
  const display = isWorking ? displayWork : displayPause

  display.textContent = formattedTime(secondsLeft)
}

function formattedTime(seconds){
  return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}`
}

const cycles = document.querySelector(".pomodoro__cycles")
let cyclesNumber = 0

function switchPeriod(){
  lastDisplayedSec = null 

  if(isWorking) {
    isWorking = false 
    endTimeMs = Date.now() + restTimeMs
  } else {
    isWorking = true 
    workTimeMs = 30 * 60 * 1000
    restTimeMs = 5 * 60 * 1000
    displayWork.textContent = formattedTime(workTimeMs / 1000)
    displayPause.textContent = formattedTime(restTimeMs / 1000)
    endTimeMs = Date.now() + workTimeMs
    cyclesNumber++
    cycles.textContent = `Cycle(s) : ${cyclesNumber}`
  }

  handleUnderlineAnimation({work: isWorking, rest: !isWorking})
}

function pausePomodoro(){
  isRunning = false 
  clearInterval(timerID)
  timerID = null 

  const remainingMs = Math.max(0, endTimeMs - Date.now())
  if(isWorking) {
    workTimeMs = remainingMs
  } else {
    restTimeMs = remainingMs
  }

  updatePlayPauseUI(false)
}

const resetBtn = document.querySelector(".js-reset-btn")
resetBtn.addEventListener("click", reset)

function reset(){
  clearInterval(timerID)
  timerID = null 
  isRunning = false 
  isWorking = true 
  lastDisplayedSec = null 

  workTimeMs = 30 * 60 * 1000
  restTimeMs = 5 * 60 * 1000
  displayWork.textContent = formattedTime(workTimeMs / 1000)
  displayPause.textContent = formattedTime(restTimeMs / 1000)

  cyclesNumber = 0
  cycles.textContent = "Cycle(s) : 0"

  updatePlayPauseUI(false)

  handleUnderlineAnimation({work: false, rest: false})
}