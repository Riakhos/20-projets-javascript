// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchInput}&gsrlimit=30&prop=extracts&explaintext&exchars=150&exintro&format=json&origin=*`

const form = document.querySelector(".wiki-app__form")
const searchInput = document.querySelector(".wiki-app__form-search-input")
const errorMsg = document.querySelector(".wiki-app__error-msg")
const resultsDisplay = document.querySelector(".wiki-app__results")
const loader = document.querySelector(".wiki-app__loader")

form.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
  e.preventDefault()

  const trimmedInput = searchInput.value.trim()

  if (trimmedInput === "") {
    errorMsg.textContent = "La recherche ne peut pas être vide"
  } else {
    wikiApiCall(trimmedInput)
  }
}

async function wikiApiCall(searchInput) {
  errorMsg.textContent = ""
  resultsDisplay.textContent = ""
  loader.classList.add("js-active-loader")
  let data
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchInput}&gsrlimit=30&prop=extracts&explaintext&exchars=150&exintro&format=json&origin=*`)

    if(!response.ok) {
      throw new Error()
    }

    data = await response.json()
    console.log(data)
  }
  catch (error) {
    errorMsg.textContent = "Erreur lors de l'appel de données."
    return
  }
  finally {
    loader.classList.remove("js-active-loader")
  }

  if(!data.query) {
    errorMsg.textContent = "Pas de résultat pour cette requête."
    return 
  } else {
    createCards(data.query.pages)
  }
}

function createCards(articleData) {
  console.log(Object.values(articleData))

  const fragment = document.createDocumentFragment()

  Object.values(articleData).forEach(article => {
    const card = document.createElement("div")
    card.className = "wiki-app__result-item"

    card.innerHTML = `
    <p class="wiki-app__result-title">
      <a 
      href=""
      class="wiki-app__result-link-title"
      target="_blank"
      ></a>
    </p>
    <p class="wiki-app__result-snippet"></p>
    `
    const cardLink = card.querySelector(".wiki-app__result-link-title")
    cardLink.textContent = article.title
    cardLink.href = `https://en.wikipedia.org/?curid=${article.pageid}`

    card.querySelector(".wiki-app__result-snippet").textContent = article.extract ? article.extract : ""

    fragment.appendChild(card)
  })

  resultsDisplay.appendChild(fragment)
}