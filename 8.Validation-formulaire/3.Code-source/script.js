const inputsValidity = {
  username: false,
  email: false,
  password: false,
  repeatPassword: false
}

const form = document.querySelector(".sign-up__form")
const signUpContainer = document.querySelector(".sign-up")
signUpContainer.addEventListener("animationend", handleSignUpFailAnimationEnd)

let isAnimating = false
function handleSignUpFailAnimationEnd() {
  signUpContainer.classList.remove("js-shake-animation")
  isAnimating = false
}

form.addEventListener("submit", handleSignUpSubmit)

function handleSignUpSubmit(e) {
  e.preventDefault()

  const failedInputs = Object.values(inputsValidity).filter(value => !value)

  if (failedInputs.length && !isAnimating) {
    isAnimating = true
    signUpContainer.classList.add("js-shake-animation")

    showValidation(Object.keys(inputsValidity).slice(0, -1))
  } else if (!failedInputs.length) {
    alert("Données envoyées avec succès.")
  }
}


function showValidation(inputGroupNames) {
  inputGroupNames.forEach(inputGroupName => {
    const inputGroup = document.querySelector(`[data-inputGroupName="${inputGroupName}"]`)
    const inputGroupIcon = inputGroup.querySelector(".sign-up__check-icon")
    const inputGroupValidationText = inputGroup.querySelector(".sign-up__error-msg")

    if (inputsValidity[inputGroupName]) {
      inputGroupIcon.style.display = "inline"
      inputGroupIcon.src = "ressources/check.svg"
      inputGroupValidationText.style.display = "none"
    }
    else {
      inputGroupIcon.style.display = "inline"
      inputGroupIcon.src = "ressources/error.svg"
      inputGroupValidationText.style.display = "block"
    }
  })
}


const userInput = document.querySelector(".js-username-input")
userInput.addEventListener("blur", usernameValidation)
userInput.addEventListener("input", usernameValidation)


function usernameValidation() {
  if (userInput.value.trim().length >= 3) {
    inputsValidity.username = true;
    showValidation(["username"])
  } else {
    inputsValidity.username = false;
    showValidation(["username"])
  }
}




const emailInput = document.querySelector(".js-email-input")
emailInput.addEventListener("blur", emailValidation)
emailInput.addEventListener("input", emailValidation)

// jean-dupont@orange.fr
// .co.uk

const regexEmail = /^[a-zA-ZÀ-ÿ0-9_]+([.-]?[a-zA-ZÀ-ÿ0-9_]+)*@[a-zA-ZÀ-ÿ0-9_]+([.-]?[a-zA-ZÀ-ÿ0-9_]+)*(\.[a-zA-ZÀ-ÿ]{2,})+$/

function emailValidation() {
  if (regexEmail.test(emailInput.value)) {
    inputsValidity.email = true
    showValidation(["email"])
  } else {
    inputsValidity.email = false
    showValidation(["email"])
  }
}




const pswInput = document.querySelector(".js-password-input")
pswInput.addEventListener("blur", passwordValidation)
pswInput.addEventListener("input", passwordValidation)

const passwordVerification = {
  length: false,
  symbol: false,
  number: false
}

const regexList = {
  symbol: /[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
  number: /[0-9]/
}

for (const regexValidation in regexList) {
  console.log(regexValidation)
  console.log(regexList[regexValidation])
}

const confirmPasswordIcon = document.querySelector(".js-repeat-psw-check-icon")

let passwordValue

function passwordValidation() {

  passwordValue = pswInput.value.trim()

  if (passwordValue.length < 6) {
    passwordVerification.length = false
  } else {
    passwordVerification.length = true
  }

  for (const regexValidation in regexList) {
    if (regexList[regexValidation].test(passwordValue)) {
      passwordVerification[regexValidation] = true
    }
    else {
      passwordVerification[regexValidation] = false
    }
  }

  if (Object.values(passwordVerification).filter(val => !val).length) {
    inputsValidity.password = false
    showValidation(["password"])
  } else {
    inputsValidity.password = true
    showValidation(["password"])
  }

  if (confirmPasswordIcon.style.display === "inline") {
    confirmPassword()
  }
}


const confirmInput = document.querySelector(".js-password-confirmation")
confirmInput.addEventListener("blur", confirmPassword)
confirmInput.addEventListener("input", confirmPassword)

function confirmPassword() {

  const confirmedValue = confirmInput.value

  if (!confirmedValue && !passwordValue) {
    const confirmPasswordGroup = document.querySelector('[data-inputGroupName="repeatPassword"]')
    confirmPasswordGroup.querySelector(".sign-up__check-icon").style.display = "none"
    confirmPasswordGroup.querySelector(".sign-up__error-msg").style.display = "none"
    return
  }

  if (confirmedValue !== passwordValue) {
    inputsValidity.repeatPassword = false
    showValidation(["repeatPassword"])
  } else {
    inputsValidity.repeatPassword = true
    showValidation(["repeatPassword"])
  }
}


