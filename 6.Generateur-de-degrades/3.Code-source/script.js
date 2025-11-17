const colorLabels = document.querySelectorAll(".gradient-app__color-label")
const colorPickerInputs = [...document.querySelectorAll(".gradient-app__color-input")]
const gradientApp = document.querySelector(".gradient-app")
const rangeLabelValue =  document.querySelector(".gradient-app__orientation-value")

const gradientData = {
  angle: 90,
  colors: ["#FF5F6D", "#FFC371"]
}

function updateGradientUI(){
  const color1 = gradientData.colors[0]
  const color2 = gradientData.colors[1]
  const angle = gradientData.angle

  colorLabels[0].textContent = color1
  colorLabels[1].textContent = color2

  colorPickerInputs[0].value = color1
  colorPickerInputs[1].value = color2

  colorLabels[0].style.backgroundColor = color1
  colorLabels[1].style.backgroundColor = color2

  gradientApp.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`
  rangeLabelValue.textContent = `${angle}°`

  adaptInputsColor()
}
updateGradientUI()

function adaptInputsColor(){
  colorLabels.forEach(label => {
    const hexColor = label.textContent.replace("#", "")

    const red = parseInt(hexColor.slice(0,2), 16)
    const green = parseInt(hexColor.slice(2,4), 16)
    const blue = parseInt(hexColor.slice(4,6), 16)

    const yiq = (red * 299 + green * 587 + blue * 144) / 1000

    if(yiq >= 128) {
      label.style.color = "#111"
    } else {
      label.style.color = "#f1f1f1"
    }
  })
}


const rangeInput = document.querySelector(".gradient-app__range")

rangeInput.addEventListener("input", updateGradientAngle)

function updateGradientAngle(){
  gradientData.angle = rangeInput.value 
  updateGradientUI()
}

colorPickerInputs.forEach(input => input.addEventListener("input", colorInputModification))

function colorInputModification(e){
  const currentColorPickerIndex = colorPickerInputs.indexOf(e.target)
  gradientData.colors[currentColorPickerIndex] = e.target.value.toUpperCase()
  updateGradientUI()
}

const copyBtn = document.querySelector(".js-copy-button")
copyBtn.addEventListener("click", handleGradientCopy)

let lock = false 
function handleGradientCopy(){
  if(lock) return 
  lock = true

  const gradient = `linear-gradient(${gradientData.angle}deg, ${gradientData.colors[0]}, ${gradientData.colors[1]})`

  navigator.clipboard.writeText(gradient)

  copyBtn.classList.add("js-active-copy-btn")

  setTimeout(() => {
    copyBtn.classList.remove("js-active-copy-btn")
    lock = false
  }, 1000)
}

const randomGradientBtn = document.querySelector(".js-random-btn")
randomGradientBtn.addEventListener("click", createRandomGradient)

function createRandomGradient(){

  for (let i = 0; i < colorLabels.length; i++) {
    // 0 à 16777215
    // 1245.toString(16) → "0004dd" "4dd"
    const randomColor = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6,"0")}`
    gradientData.colors[i] = randomColor.toUpperCase()
  }

  updateGradientUI()
}