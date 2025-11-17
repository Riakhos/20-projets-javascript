const imagesList = document.querySelector(".search-imgs__list");
const errorMsg = document.querySelector(".search-imgs__error-msg");
const loader = document.querySelector(".loader");

let searchQuery = "random";
let pageIndex = 1;
let totalPages;

async function fetchData() {
  let data;
  loader.classList.add("js-active-loader");
  errorMsg.textContent = "";

  try {
    const response = await fetch(
      `${API_CONFIG.API_URL}?page=${pageIndex}&per_page=${API_CONFIG.PER_PAGE}&query=${searchQuery}&client_id=${API_CONFIG.API_KEY}`
    );

    if (!response.ok) throw new Error();

    data = await response.json();
    totalPages = data.total_pages;
    console.log(data);
  } catch (error) {
    errorMsg.textContent = "Erreur lors de l'appel de données";
    return;
  } finally {
    loader.classList.remove("js-active-loader");
  }

  if (!data.total) {
    imagesList.textContent = "";
    errorMsg.textContent =
      "Wopsy, rien de tel dans notre base de données ... tentez un mot clé plus précis !";
    return;
  } else {
    createImages(data.results);
  }
}
fetchData();

function createImages(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((img) => {
    const li = document.createElement("li");
    li.className = "search-imgs__list-item";
    const newImg = document.createElement("img");
    newImg.className = "search-imgs__list-item-img";
    newImg.src = img.urls.regular;
    li.appendChild(newImg);
    fragment.appendChild(li);
  });
  imagesList.appendChild(fragment);
}

const observer = new IntersectionObserver(handleIntersect, {
  rootMargin: "50%",
});

observer.observe(document.querySelector(".search-imgs__marker"));

function handleIntersect(entries) {
  if (window.scrollY > window.innerHeight && entries[0].isIntersecting) {
    if (pageIndex + 1 <= totalPages) {
      pageIndex++;
      fetchData();
    }
  }
}

const input = document.querySelector(".search-imgs__input");
const form = document.querySelector(".search-imgs__form");

form.addEventListener("submit", handleImagesSearch);

function handleImagesSearch(e) {
  e.preventDefault();

  imagesList.textContent = "";
  errorMsg.textContent = "";

  if (!input.value.trim()) return;

  searchQuery = input.value;
  pageIndex = 1;
  totalPages = undefined;
  fetchData();
}

const scrollToTop = document.querySelector(".scroll-to-top-button");

scrollToTop.addEventListener("click", pushToTop);

function pushToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
