import phrases from "./data/phrases.js"
console.log(phrases);

const sentenceToWrite = document.querySelector(".typing-game__sentence-to-write")
const textarea = document.querySelector(".typing-game__textarea")

let sentenceSpans
let lastPhraseIndex = null 

function displayNewSentenceToWrite() {

  textarea.value = ""
  sentenceToWrite.textContent = ""

  let randomIndex 
  do {
    randomIndex = Math.floor(Math.random() * phrases.length)
  }
  while(randomIndex === lastPhraseIndex && phrases.length > 1)

  lastPhraseIndex = randomIndex

  const phrase = phrases[randomIndex].text

  phrase.split("").forEach(character => {
    const spanCharacter = document.createElement("span")
    spanCharacter.textContent = character
    sentenceToWrite.appendChild(spanCharacter)
  })

  sentenceSpans = sentenceToWrite.querySelectorAll("span")
  textarea.focus()


}
displayNewSentenceToWrite()

const timeDisplayed = document.querySelector(".js-time-left")
const scoreDisplayed = document.querySelector(".js-score")
const endGameInfo = document.querySelector(".typing-game__end-game-info")

textarea.addEventListener("input", handleTyping)
let passedSentencesCharacters = 0
let time = 60
let score = 0
let timerId = null;

function handleTyping() {
  if (!timerId) startTimer()

  const completedSentence = compareSentences()

  if (completedSentence) {
    passedSentencesCharacters += sentenceSpans.length

    displayNewSentenceToWrite()
  }
}

function startTimer() {
  timeDisplayed.classList.add("js-active-time")
  textarea.classList.add("js-active-textarea")

  timerId = setInterval(handleTime, 100)
}

function handleTime() {
  time = Number((time - 0.1).toFixed(1))

  timeDisplayed.textContent = `Temps : ${time.toFixed(1)}`

  if (time <= 0) {
    console.log("test")
    clearInterval(timerId)
    endGameInfo.textContent = `Bravo 🏆, votre score est : ${score}`
    timeDisplayed.classList.remove("js-active-time")
    textarea.classList.remove("js-active-textarea")
    textarea.disabled = true
  }
}

function compareSentences() {
  const textareaCharactersArray = textarea.value.split("")
  let areSentencesSimilar = true
  let currentGoodLetters = 0

  for (let i = 0; i < sentenceSpans.length; i++) {
    if (textareaCharactersArray[i] === undefined) {
      for (let j = i; j < sentenceSpans.length; j++) {
        sentenceSpans[j].className = ""
      }
      areSentencesSimilar = false;
      break
    }
    else if (textareaCharactersArray[i] === sentenceSpans[i].textContent) {
      sentenceSpans[i].classList.add("js-correct")
      sentenceSpans[i].classList.remove("js-wrong")
      currentGoodLetters++
    } else {
      sentenceSpans[i].classList.add("js-wrong")
      sentenceSpans[i].classList.remove("js-correct")
      areSentencesSimilar = false
    }
  }

  score = passedSentencesCharacters + currentGoodLetters
  scoreDisplayed.textContent = `Score : ${score}`

  return areSentencesSimilar
}

window.addEventListener("keydown", handleGameReset)

function handleGameReset(e) {

  if (e.ctrlKey && e.altKey && e.key === "Enter") {
    e.preventDefault()

    clearInterval(timerId)

    time = 60
    passedSentencesCharacters = 0
    timerId = null

    timeDisplayed.textContent = `Temps : ${time}`
    scoreDisplayed.textContent = "Score : 0"

    timeDisplayed.classList.remove("js-active-time")
    textarea.classList.remove("js-active-textarea")

    endGameInfo.textContent = ""
    textarea.value = ""
    textarea.disabled = false 
    textarea.focus()
    displayNewSentenceToWrite()
  }

}