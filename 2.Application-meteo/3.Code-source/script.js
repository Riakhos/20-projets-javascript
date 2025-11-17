const loader = document.querySelector(".weather-app__loader-container")
const errorInformation = document.querySelector(".weather-app__error-info")

async function getWeatherData(){
  loader.classList.add("js-loader-active")
  let data; 
  try {
    const response = await fetch("./weatherAPI/weatherData.json")
    console.log(response)
    if(!response.ok) {
      throw new Error()
    }
    data = await response.json()
  }
  catch(error) {
    console.log(error.message)
    errorInformation.style.display = "block"
    errorInformation.textContent = "Erreur lors de la récupération des données. 🤖"
    return 
  }
  finally {
    loader.classList.remove("js-loader-active")
  }


  console.log(data)
  populateUI(data)
}
getWeatherData()


const cityName = document.querySelector(".weather-app__city")
const countryName = document.querySelector(".weather-app__country")
const temperature = document.querySelector(".weather-app__temp")
const infoIcon = document.querySelector(".weather-app__info-icon")

function populateUI(data) {
  cityName.textContent = data[0].city 
  countryName.textContent = data[0].country 
  temperature.textContent = `${data[0].temperature}°`
  infoIcon.src = `ressources/icons/${data[0].iconID}.svg`
  infoIcon.style.display = "block"
}