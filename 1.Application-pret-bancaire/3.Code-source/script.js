const loanData = {
  amount: 10000,
  repayment: 42,
  rate: 7
}

const rangeInputs = document.querySelectorAll(".loan-app__range-input")

rangeInputs.forEach(rangeInput => {
  rangeInput.addEventListener("input", handleRangeChange)
})


const loanAmountLabel = document.querySelector(".js-loan-amount")
const repaymentLabel = document.querySelector(".js-repayment-duration")

function handleRangeChange(e) {
  console.log(e)

  const inputValue = Number(e.target.value)

  if (e.target.id === "loan-amount") {
    loanAmountLabel.textContent = `${inputValue.toLocaleString()}€`
    loanData.amount = inputValue
  }
  else if (e.target.id === "repayment") {
    repaymentLabel.textContent = `${inputValue}`
    loanData.repayment = inputValue
  }

  displayLoanInformation()
}

const totalPaymentTxt = document.querySelector(".js-total-value")
const perMonthPaymentTxt = document.querySelector(".js-monthly-payment")
const totalInterestTxt = document.querySelector(".js-total-interest")

function displayLoanInformation(){

  const totalPayment = loanData.amount + (loanData.amount * (loanData.rate / 100))
  const perMonthPayment = totalPayment / loanData.repayment
  const totalInterest = totalPayment - loanData.amount

  totalPaymentTxt.textContent = `${Math.trunc(totalPayment).toLocaleString()}€`
  perMonthPaymentTxt.textContent = `${Math.trunc(perMonthPayment).toLocaleString()}€`
  totalInterestTxt.textContent = `${Math.trunc(totalInterest).toLocaleString()}€`
}

