import quizData from "./quizData.js"
console.log(quizData)

const form = document.querySelector(".quiz__form")
const formSubmitBtn = document.querySelector(".quiz__submit-button")


function addQuizContent(questions) {

  const fragment = document.createDocumentFragment()

  questions.forEach(currentQuestion => {

    const questionBlock = document.createElement("div")
    questionBlock.className = "quiz__question-block"
    questionBlock.id = currentQuestion.id

    const questionText = document.createElement("p")
    questionText.className = "quiz__question"
    questionText.textContent = currentQuestion.question
    questionBlock.appendChild(questionText)

    currentQuestion.options.forEach((option, index) => {
      const inputGroup = document.createElement("div")
      inputGroup.className = "quiz__input-group"

      const radioInput = document.createElement("input")
      radioInput.type = "radio"
      radioInput.className = "quiz__radio-input"
      radioInput.id = `${currentQuestion.id}-${option.value}`
      radioInput.name = currentQuestion.id
      radioInput.value = option.value
      radioInput.checked = index === 0

      const label = document.createElement("label")
      label.className = "quiz__label"
      label.htmlFor = radioInput.id
      label.textContent = option.label

      inputGroup.appendChild(radioInput)
      inputGroup.appendChild(label)
      questionBlock.appendChild(inputGroup)
    })

    fragment.appendChild(questionBlock)
  })

  form.insertBefore(fragment, formSubmitBtn)
}
addQuizContent(quizData.questions)


form.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
  e.preventDefault()

  getResult()
}

function getResult() {
  const checkedRadioButtons = [...document.querySelectorAll("input[type='radio']:checked")]
  console.log(checkedRadioButtons)

  const results = checkedRadioButtons.map(radioButton => {
    const response = quizData.responses.find(response => response.id === radioButton.name)

    return { id: radioButton.name, correct: response.answer === radioButton.value }
  })
  console.log(results)
  showResults(results)
  addColors(results)
}

const quizResultsBox = document.querySelector(".quiz__results")
const quizDescription = document.querySelector(".quiz__description")

let isResultsBoxShowed = false 
function showResults(results) {
  if(!isResultsBoxShowed) {
    quizResultsBox.style.display = "block"
    isResultsBoxShowed = true;
  }

  const goodResponses = results.filter(response => response.correct === true)
  const hasFinishedQuiz = goodResponses.length === quizData.responses.length 


  if(!hasFinishedQuiz) {
    quizDescription.textContent = `Résultat  : ${goodResponses.length}/${quizData.questions.length}, retentez votre chance.`
  } else {
    quizDescription.textContent = `Bravo  : ${goodResponses.length}/${quizData.questions.length}. 🏆`
    
  }
}

function addColors(results) {
  results.forEach(response => {
    document.getElementById(response.id).style.outline = response.correct ? "3px solid #3da406" : "3px solid #ff6565"
  })
}


form.addEventListener("input", resetQuestionHighlight)

function resetQuestionHighlight(e){
  if(e.target.matches(".quiz__radio-input")) {
    const block = document.getElementById(e.target.name)
    if(block) block.style.outline = "none"
  }
}