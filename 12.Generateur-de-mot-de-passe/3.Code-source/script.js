const charactersSets = {
  lowercaseChars: "abcdefghijklmnopqrstuvwxyz",
  uppercaseChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
}

const generatePwdBtn = document.querySelector(".pwd-generator__generate-pwd-btn")
const generatedPassword = document.querySelector(".pwd-generator__generated-pwd")
const checkboxes = document.querySelectorAll(".pwd-generator__checkbox")
const errorMsg = document.querySelector(".pwd-generator__error-msg")

const range = document.querySelector(".pwd-generator__range-input")
let passwordLength = range.value

generatePwdBtn.addEventListener("click", createPassword)

function createPassword() {
  const checkedDataSets = getCheckedDataSets()
  console.log(checkedDataSets)

  errorMsg.textContent = ""
  if (!checkedDataSets.length) {
    errorMsg.textContent = "Au moins une case doit être cochée !"
    return
  }

  const requiredCharacters = []

  for (let i = 0; i < checkedDataSets.length; i++) {
    requiredCharacters.push(checkedDataSets[i][getRandomIndex(0, checkedDataSets[i].length - 1)])
  }
  console.log(requiredCharacters)
  const concatenatedDataSets = checkedDataSets.reduce((acc, cur) => acc + cur)
  let password = ""
  for(let i = requiredCharacters.length; i < passwordLength; i++){
    password += concatenatedDataSets[getRandomIndex(0, concatenatedDataSets.length - 1)]
  }
  console.log(password)

  requiredCharacters.forEach((item, index) => {
    const randomIndex = getRandomIndex(0, password.length)

    password = password.slice(0, randomIndex) + requiredCharacters[index] + password.slice(randomIndex)
  })

  generatedPassword.textContent = password
}
createPassword()

function getCheckedDataSets() {
  const checkedSets = []

  checkboxes.forEach(checkbox => checkbox.checked && checkedSets.push(charactersSets[checkbox.id]))

  return checkedSets
}


function getRandomIndex(min, max) {
  /* 
  Si on veut créer un chiffre au hasard entre 0 et 3

  [0, 0.25[ → retourne 0

  [0.25, 0.5[ → retourne 1

  [0.5, 0.75[ → retourne 2

  [0.75, 1[ → retourne 3
  
  */
  const randomNumber = crypto.getRandomValues(new Uint32Array(1))[0]
  // console.log(randomNumber)
  // 4294967295 + 1
  const randomFloatingNumber = randomNumber / 4294967296
  // console.log(randomFloatingNumber, Math.random())

  return Math.trunc(randomFloatingNumber * (max + 1))
}