const calculatorData = {
  calculation: "0",
  result: "",
  displayedResult: false
}

const output = document.querySelector(".calculator__output")
output.textContent = calculatorData.calculation

const calculatorBtns = [...document.querySelectorAll("button[data-action]")]
const digitBtns = calculatorBtns.filter(button => /[0-9]/.test(button.getAttribute("data-action")))

const calculationHistory = document.querySelector(".calculator__history")

digitBtns.forEach(btn => btn.addEventListener("click", handleDigits))

function handleDigits(e) {
  const buttonValue = e.currentTarget.getAttribute("data-action")

  if (calculatorData.displayedResult) {
    calculationHistory.textContent = ""
    calculatorData.calculation = ""
    calculatorData.displayedResult = false
  }
  else if (calculatorData.calculation === "0") calculatorData.calculation = ""

  calculatorData.calculation += buttonValue
  output.textContent = calculatorData.calculation.replaceAll(".",",")
}

const operatorBtns = calculatorBtns.filter(button => /[\/+*-]/.test(button.getAttribute("data-action")))

operatorBtns.forEach(btn => btn.addEventListener("click", handleOperators))

function handleOperators(e) {
  const buttonValue = e.currentTarget.getAttribute("data-action")

  // Si le calcul se termine par une virgule
  if (calculatorData.calculation.slice(-1) === ",") return

  if (calculatorData.displayedResult) {
    calculationHistory.textContent = ""
    calculatorData.calculation = calculatorData.result += buttonValue
    output.textContent = calculatorData.calculation.replace(".",",")
    calculatorData.displayedResult = false
  }
  else if (calculatorData.calculation === "0" && buttonValue === "-") {
    calculatorData.calculation = "-"
    output.textContent = calculatorData.calculation
  }
  else if (/[\/+*-]/.test(calculatorData.calculation.slice(-1)) && calculatorData.calculation !== "-") {
    calculatorData.calculation = calculatorData.calculation.slice(0, -1) + buttonValue
    output.textContent = calculatorData.calculation.replaceAll(".",",")
  }
  else {
    calculatorData.calculation += buttonValue
    output.textContent = calculatorData.calculation.replaceAll(".",",")
  }
}

const decimalButton = document.querySelector("button[data-action=',']")

decimalButton.addEventListener("click", createDecimalNumber)

function createDecimalNumber() {

  if (/[\/+*-]/.test(calculatorData.calculation.slice(-1))) return

  if (calculatorData.displayedResult) {
    if (/\./.test(calculatorData.result)) return

    calculationHistory.textContent = ""
    calculatorData.calculation = calculatorData.result += "."
    output.textContent = calculatorData.calculation.replace(".",",")
    calculatorData.displayedResult = false
    return
  }

  let lastNumberString = ""
  for (let i = calculatorData.calculation.length - 1; i >= 0; i--) {
    if (/[\/+*-]/.test(calculatorData.calculation[i])) break
    else {
      lastNumberString += calculatorData.calculation[i]
    }
  }
  console.log(lastNumberString)
  if (!lastNumberString.includes(".")) {
    calculatorData.calculation += "."
    output.textContent = calculatorData.calculation.replaceAll(".",",")
  }
}

const equalBtn = document.querySelector("button[data-action='=']")

equalBtn.addEventListener("click", handleEqualBtn)

function handleEqualBtn() {
  if (/[\/+*-,]/.test(calculatorData.calculation.slice(-1))) {
    calculationHistory.textContent = "Terminez le calcul par un chiffre."
    setTimeout(() => {
      calculationHistory.textContent = ""
    }, 2500)
  }
  else if (!calculatorData.displayedResult) {
    calculatorData.result = customEval(calculatorData.calculation)
    output.textContent = calculatorData.result.replace(".",",")
    calculationHistory.textContent = calculatorData.calculation
    calculatorData.displayedResult = true 
  }
}

// 10+10+10*2
// 10+10+20
// 20+20
// 40


function customEval(calculation) {

  if (!/[\/+*-]/.test(calculation.slice(1))) return calculation

  let operator
  let operatorIndex

  if (/[\/*]/.test(calculation.slice(1))) {
    for (let i = 1; i < calculation.length; i++) {
      if (/[\/*]/.test(calculation[i])) {
        operator = calculation[i]
        operatorIndex = i
        break
      }
    }
  } else if (/[+-]/.test(calculation.slice(1))) {
    for (let i = 1; i < calculation.length; i++) {
      if (/[+-]/.test(calculation[i])) {
        operator = calculation[i]
        operatorIndex = i
        break
      }
    }
  }

  console.log(operator, operatorIndex)

  const operandsInfo = getCalculationLimitsAndOperands(operatorIndex, calculation)
  console.log(operandsInfo)

  const currentCalculationResult = computeResult(operator, operandsInfo)
  console.log(currentCalculationResult)

  const updatedCalculation = calculation.slice(0,operandsInfo.startCharIndex) + currentCalculationResult + calculation.slice(operandsInfo.endCharIndex + 1)
  console.log(updatedCalculation)

  if(/[\/+*-]/.test(updatedCalculation.slice(1))){
    return customEval(updatedCalculation)
  }

  if(updatedCalculation.includes(".")) {
    if(updatedCalculation.split(".")[1].length > 5) {
      return Number(updatedCalculation).toFixed(5).toString()
    }
  }

  return updatedCalculation
}

// 10+10+10*20+500
// 10+10+200+500
// 20+200+500
// 220+500
// 720
function getCalculationLimitsAndOperands(operatorIndex, calculation) {

  let rightOperand = ""
  let endCharIndex = null

  for (let i = operatorIndex + 1; i < calculation.length; i++) {
    if (i === calculation.length - 1) {
      rightOperand += calculation[i]
      endCharIndex = i
    }
    else if (/[\/+*-]/.test(calculation[i])) {
      endCharIndex = i - 1
      break
    }
    else {
      rightOperand += calculation[i]
    }
  }

  let leftOperand = ""
  let startCharIndex = null

  for (let i = operatorIndex - 1; i >= 0; i--) {
    if (i === 0) {
      startCharIndex = 0
      leftOperand += calculation[i]
      break
    }
    else if (/[\/+*-]/.test(calculation[i])) {
      startCharIndex = i + 1
      break
    }
    else {
      leftOperand += calculation[i]
    }
  }

  leftOperand = leftOperand.split("").reverse().join("")

  return {
    leftOperand,
    rightOperand,
    startCharIndex,
    endCharIndex
  }
}

function computeResult(operator, operandsInfo){
  let currentCalculationResult

  switch(operator){
    case "+":
      currentCalculationResult = Number(operandsInfo.leftOperand) + Number(operandsInfo.rightOperand)
      break
    case "-":
      currentCalculationResult = Number(operandsInfo.leftOperand) - Number(operandsInfo.rightOperand)
      break
    case "*":
      currentCalculationResult = Number(operandsInfo.leftOperand) * Number(operandsInfo.rightOperand)
      break
    case "/":
      currentCalculationResult = Number(operandsInfo.leftOperand) / Number(operandsInfo.rightOperand)
      break
  }

  return currentCalculationResult
}


const resetButton = document.querySelector("button[data-action='c']")

resetButton.addEventListener("click", reset)

function reset(){
  calculatorData.calculation = "0"
  calculatorData.displayedResult = false
  calculatorData.result = ""
  output.textContent = calculatorData.calculation
  calculationHistory.textContent = ""
}

const clearEntryButton = document.querySelector("button[data-action='ce']")

clearEntryButton.addEventListener("click", clearEntry)

function clearEntry(){
  if(calculatorData.displayedResult) return

  else if(calculatorData.calculation === "0") return 

  if(output.textContent.length === 1) {
    calculatorData.calculation = "0"
  } else {
    calculatorData.calculation = calculatorData.calculation.slice(0,-1)
  }

  output.textContent = calculatorData.calculation
  
}