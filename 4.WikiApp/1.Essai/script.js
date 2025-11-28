// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

// ===========================
// GESTION NAVIGATION
// ===========================

document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // GESTION DU MENU BURGER
    // ===========================
    const burger = document.getElementById("burger-menu");
    const navUl = document.querySelector("#nav-menu");

    if (burger && navUl) {
        // Au clic sur le burger, ouvrir/fermer le menu
        burger.addEventListener("click", () => {
            navUl.classList.toggle("open");
            burger.src = navUl.classList.contains("open")
                ? "./assets/close.png"
                : "./assets/burger.png";
        });

        // Ferme le menu si on repasse en mode desktop lors d'un redimensionnement
        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                navUl.classList.remove("open");
                burger.src = "./assets/burger.png";
            }
        });

        // Fermer le menu quand on clique sur un lien en mode mobile
        // Sélectionner tous les liens sauf les dropdown-toggle
        const navLinks = navUl.querySelectorAll("a:not(.dropdown-toggle)");
        // Ajouter aussi tous les liens dans les dropdown-menu
        const dropdownLinks = navUl.querySelectorAll(".dropdown-menu a");

        // Combiner tous les liens
        const allLinks = [...navLinks, ...dropdownLinks];

        allLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 820) {
                    navUl.classList.remove("open");
                    burger.src = "./assets/burger.png";
                }
            });
        });
    } else {
        console.error("L'élément burger ou nav n'a pas été trouvé");
    }

    // ===========================
    // GESTION DES DROPDOWNS
    // ===========================
    const dropdowns = document.querySelectorAll(".dropdown");

    // Fonction pour fermer tous les dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("active");
        });
    }

    // Gestion des événements pour chaque dropdown
    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        // Gestion du clic sur le bouton toggle
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Si ce dropdown est déjà actif, le fermer
            if (dropdown.classList.contains("active")) {
                closeAllDropdowns();
                return;
            }

            // Fermer tous les autres dropdowns
            closeAllDropdowns();

            // Activer ce dropdown
            dropdown.classList.add("active");
        });

        // Empêcher la fermeture quand on clique à l'intérieur du dropdown
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        if (dropdownMenu) {
            dropdownMenu.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }
    });

    // Fermer les dropdowns en cliquant ailleurs ou sur l'overlay mobile
    document.addEventListener("click", function (e) {
        // Si on clique sur l'overlay mobile (::before pseudo-element)
        const activeDropdown = document.querySelector(".dropdown.active");
        if (activeDropdown && window.innerWidth <= 820) {
            const dropdownMenu = activeDropdown.querySelector(".dropdown-menu");
            if (
                dropdownMenu &&
                !dropdownMenu.contains(e.target) &&
                !e.target.closest(".dropdown-toggle")
            ) {
                closeAllDropdowns();
            }
        } else if (!e.target.closest(".dropdown")) {
            closeAllDropdowns();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });

    // ===========================
    // APPLICATION WIKI - RECHERCHE WIKIPEDIA
    // ===========================

    // Sélection des éléments DOM
    const form = document.querySelector(".wiki-app__form");
    const searchInput = document.querySelector(".wiki-app__form-search-input");
    const errorMsg = document.querySelector(".wiki-app__error-msg");
    const resultsDisplay = document.querySelector(".wiki-app__results");
    const loader = document.querySelector(".wiki-app__loader");

    // Écouteur d'événement pour la soumission du formulaire
    form.addEventListener("submit", handleSubmit);

    /**
     * Gère la soumission du formulaire de recherche
     * @param {Event} e - Événement de soumission
     */
    function handleSubmit(e) {
        e.preventDefault();

        const trimmedInput = searchInput.value.trim();

        if (trimmedInput === "") {
            errorMsg.textContent = "La recherche ne peut pas être vide";
            errorMsg.classList.add("show");
        } else {
            wikiApiCall(trimmedInput);
            errorMsg.classList.remove("show");
        }
    }

    /**
     * Effectue l'appel API vers Wikipedia
     * @param {string} searchInput - Terme de recherche
     */
    async function wikiApiCall(searchInput) {
        // Réinitialiser l'interface
        errorMsg.textContent = "";
        resultsDisplay.textContent = "";
        loader.classList.add("js-active-loader");

        let data;
        try {
            const response = await fetch(
                `https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchInput}&gsrlimit=30&prop=extracts&explaintext&exchars=150&exintro&format=json&origin=*`
            );

            if (!response.ok) {
                throw new Error("Erreur de réseau");
            }

            data = await response.json();
            console.log("📊 Données reçues de Wikipedia:", data);
        } catch (error) {
            console.error("❌ Erreur API Wikipedia:", error);
            errorMsg.textContent = "Erreur lors de l'appel de données.";
            errorMsg.classList.add("show");
            return;
        } finally {
            // Masquer le loader dans tous les cas
            loader.classList.remove("js-active-loader");
            errorMsg.classList.remove("show");
        }

        // Vérifier si des résultats ont été trouvés
        if (!data.query) {
            errorMsg.textContent = "Pas de résultat pour cette requête.";
            errorMsg.classList.add("show");
            return;
        } else {
            createCards(data.query.pages);
            errorMsg.classList.remove("show");
        }
    }

    /**
     * Crée et affiche les cartes de résultats
     * @param {Object} articleData - Données des articles Wikipedia
     */
    function createCards(articleData) {
        console.log("🃏 Création des cartes pour:", Object.values(articleData));

        // Utiliser DocumentFragment pour optimiser les performances
        const fragment = document.createDocumentFragment();

        Object.values(articleData).forEach((article) => {
            // Créer le conteneur de la carte
            const card = document.createElement("div");
            card.className = "wiki-app__result-item";

            // Injecter le HTML de la carte
            card.innerHTML = `
                <p class="wiki-app__result-title">
                    <a 
                    href=""
                    class="wiki-app__result-link-title"
                    target="_blank"
                    ></a>
                </p>
                <p class="wiki-app__result-snippet"></p>
                `;

            // Configurer le lien vers l'article
            const cardLink = card.querySelector(".wiki-app__result-link-title");
            cardLink.textContent = article.title;
            cardLink.href = `https://fr.wikipedia.org/?curid=${article.pageid}`;

            // Ajouter l'extrait de l'article
            card.querySelector(".wiki-app__result-snippet").textContent =
                article.extract ? article.extract : "Aucun extrait disponible";

            fragment.appendChild(card);
        });

        // Insérer toutes les cartes d'un coup
        resultsDisplay.appendChild(fragment);
        console.log(`✅ ${Object.values(articleData).length} résultats affichés`);
    }
});
