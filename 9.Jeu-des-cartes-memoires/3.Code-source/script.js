const fruits = ["brocoli", "cherry", "pepper", "strawberry", "apple", "banana"];
const fruitsList = document.querySelector(".memory-game__grid")

function createNewShuffledCards(fruitsArray){

  const duplicatedFruits = fruitsArray.flatMap(fruit => [fruit, fruit])

  for(let i = duplicatedFruits.length - 1; i > 0; i--){
    const randomIndex = Math.floor(Math.random() * (i + 1))

    const savedTemp = duplicatedFruits[i]
    duplicatedFruits[i] = duplicatedFruits[randomIndex]
    duplicatedFruits[randomIndex] = savedTemp 
  }

  console.log(duplicatedFruits)

  createCards(duplicatedFruits)
}
createNewShuffledCards(fruits)



function createCards(randomFruitsArray){

  const fragment = document.createDocumentFragment()

  randomFruitsArray.forEach(fruit => {
    const li = document.createElement("li")
    li.className = "memory-game__card"
    li.setAttribute("data-fruit", fruit)

    li.innerHTML = `
      <div class="memory-game__double-face">
        <div class="memory-game__face">
          <img src="" alt="" class="memory-game__card-img">
        </div>
        <div class="memory-game__back">
          <img src="ressources/question.svg" alt="" class="memory-game__card-img">
        </div>
      </div>
    `
    const liImg = li.querySelector(".memory-game__card-img")
    liImg.src = `ressources/${fruit}.svg`
    liImg.alt = fruit 
    fragment.appendChild(li)

  })
  fruitsList.textContent = ""
  fruitsList.appendChild(fragment)
}

const advice = document.querySelector(".memory-game__advice")
const score = document.querySelector(".memory-game__score")

let lockedCards = false 
let cardsPicked = []
let numberOfTries = 0

window.addEventListener("keydown", handleReset)

function handleReset(e){
  if(e.code === "Space") {
    e.preventDefault()

    advice.textContent = "Appuyer sur barre d'espace pour reset le jeu."
    score.textContent = "Nombre d'essais : 0"
    numberOfTries = 0
    createNewShuffledCards(fruits)
    lockedCards = false 
    cardsPicked = []
  }
}

// event delegation
fruitsList.addEventListener("click", flipACard)

function flipACard(e){
  if(lockedCards || e.target === fruitsList) return

  const clickedCard = e.target.closest(".memory-game__card")

  clickedCard.classList.add("js-card-locked")

  const doubleFaceContainer = clickedCard.querySelector(".memory-game__double-face")

  doubleFaceContainer.classList.add("js-double-face-active")

  cardsPicked.push({el: clickedCard, value: clickedCard.getAttribute("data-fruit")})

  if(cardsPicked.length === 2) {
    saveNumberOfTries()

    checkCards()
  }
}

function saveNumberOfTries(){
  numberOfTries++
  score.textContent = `Nombre d'essais : ${numberOfTries}`
}

function checkCards(){
  if(cardsPicked[0].value === cardsPicked[1].value){
    cardsPicked = []
    checkGameCompletion()
    return
  }

  lockedCards = true 
  setTimeout(() => {
    cardsPicked.forEach(card => {
      card.el.querySelector(".memory-game__double-face").classList.remove("js-double-face-active")
      card.el.classList.remove("js-card-locked")
    })
    cardsPicked = []
    lockedCards = false
  }, 1000)
}

function checkGameCompletion(){
  const innerDoubleFaceContainers = [...document.querySelectorAll(".memory-game__double-face")]
  const checkForEnd = innerDoubleFaceContainers.filter(card => !card.classList.contains("js-double-face-active"))

  if(!checkForEnd.length) {
    advice.textContent = `Bravo ! Appuie sur "Espace" pour recommencer.`
    score.textContent = `Score final : ${numberOfTries}`
  } 
}