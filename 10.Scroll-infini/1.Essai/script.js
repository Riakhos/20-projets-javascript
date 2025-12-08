
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
    // APPLICATION SCROLL INFINI - UNSPLASH API
    // ===========================

    // ===========================
    // ÉTAPE 1 : CONFIGURATION ET VARIABLES GLOBALES
    // ===========================

    // Vérification que la configuration API est chargée
    if (typeof window.API_CONFIG === "undefined") {
        console.error("⚠️ Fichier config.js manquant ou mal configuré !");
        console.log("📋 Instructions :");
        console.log("1. Copiez config.example.js vers config.js");
        console.log("2. Ajoutez votre clé API Unsplash dans config.js");
        console.log(
            "3. Créez un compte gratuit sur https://unsplash.com/developers"
        );
        return;
    }

    // Configuration API depuis le fichier externe
    const {
        API_KEY,
        API_URL,
        PER_PAGE = 30,
        TIMEOUT = 10000,
    } = window.API_CONFIG;

    // Vérification que la clé API est configurée
    if (API_KEY === "YOUR_API_KEY_HERE" || !API_KEY) {
        console.error("🔑 Clé API non configurée !");
        console.log(
            "📋 Veuillez remplacer YOUR_API_KEY_HERE par votre vraie clé API dans config.js"
        );
        return;
    }

    // Variables pour la pagination et l'état de l'application
    let currentPage = 1;
    let currentQuery = "random";
    let isLoading = false;
    let hasMoreImages = true;
    let totalPages;

    // Sélection des éléments DOM
    const imagesList = document.querySelector(".search-imgs__list");
    const searchInput = document.querySelector(".search-imgs__input");
    const searchForm = document.querySelector(".search-imgs__form");
    const errorMsg = document.querySelector(".search-imgs__error-msg");
    const loader = document.querySelector(".loader");
    const marker = document.querySelector(".search-imgs__marker");
    const scrollToTopBtn = document.querySelector(".scroll-to-top-button");

    // ===========================
    // ÉTAPE 2 : FONCTIONS UTILITAIRES
    // ===========================

    // TODO: Fonction pour afficher/masquer le loader
    function toggleLoader(show) {
        // Ajouter ou retirer la classe 'js-active-loader'
        if (show) {
            loader.classList.add("js-active-loader");
        } else {
            loader.classList.remove("js-active-loader");
        }
    }

    // TODO: Fonction pour afficher les messages d'erreur
    function showError(message) {
        // Afficher le message d'erreur à l'utilisateur
        errorMsg.textContent = message;
        errorMsg.classList.add("js-active-error");

        // Optionnel : Retirer le message après un certain temps
        setTimeout(() => {
            errorMsg.classList.remove("js-active-error");
            errorMsg.textContent = "";
        }, 5000);
    }

    // TODO: Fonction pour vider la liste d'images
    function clearImagesList() {
        // Vider le contenu de la galerie d'images
        imagesList.innerHTML = "";
        // Remettre les variables de pagination à zéro
        currentPage = 1;
        hasMoreImages = true;
        totalPages = null; // Réinitialiser le nombre total de pages
        currentQuery = "random"; // Réinitialiser la requête de recherche
    }

    // ===========================
    // ÉTAPE 3 : APPEL API UNSPLASH
    // ===========================

    // Fonction principale pour récupérer les images
    async function fetchImages(query = "random", page = 1) {
        // Construire l'URL avec les paramètres de recherche
        const url = `${API_URL}?query=${encodeURIComponent(
            query
        )}&page=${page}&per_page=${PER_PAGE}&client_id=${API_KEY}`;

        console.log("🔍 Requête API:", {
            query,
            page,
            url: url.replace(API_KEY, "HIDDEN_KEY"),
        });

        try {
            // Faire l'appel fetch vers l'API
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            console.log("📡 Réponse API:", response.status, response.statusText);

            // Gérer les erreurs HTTP avec des messages spécifiques
            if (!response.ok) {
                await handleApiError(response);
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            // Retourner les données JSON
            const data = await response.json();
            console.log("✅ Données reçues:", data.results?.length || 0, "images");

            // Mettre à jour le total des pages si disponible
            if (data.total_pages) {
                totalPages = data.total_pages;
                console.log("📊 Total pages disponibles:", totalPages);
            }

            return data.results || [];
        } catch (error) {
            // Gérer les erreurs de réseau
            console.error("❌ Erreur lors de la récupération des images:", error);
            throw error;
        }
    }

    // ===========================
    // ÉTAPE 4 : CRÉATION DES ÉLÉMENTS DOM
    // ===========================

    // Fonction pour créer un élément image
    function createImageElement(imageData) {
        // Créer les éléments <li> et <img>
        const li = document.createElement("li");
        li.className = "search-imgs__list-item";

        const img = document.createElement("img");
        img.className = "search-imgs__list-item-img";
        img.src = imageData.urls.small;
        img.alt = imageData.alt_description || "Image";
        img.loading = "lazy";

        // Gérer les erreurs de chargement d'images
        img.onerror = () => {
            console.warn(
                "⚠️ Erreur de chargement pour l'image:",
                imageData.urls.small
            );
            img.src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%23f0f0f0"/><text x="150" y="100" text-anchor="middle" fill="%23666">Image non disponible</text></svg>';
        };

        // Ajouter l'image au conteneur li
        li.appendChild(img);

        // Retourner l'élément créé
        return li;
    }

    // Fonction pour afficher les images dans la galerie
    function displayImages(images) {
        if (!images || images.length === 0) {
            console.log("📭 Aucune image à afficher");
            return;
        }

        // Parcourir le tableau d'images
        const fragment = document.createDocumentFragment();
        images.forEach((image) => {
            // Créer les éléments DOM pour chaque image
            const imgElement = createImageElement(image);
            fragment.appendChild(imgElement);
        });

        // Les ajouter à la galerie
        imagesList.appendChild(fragment);
        // console.log('🖼️ Ajouté', images.length, 'images à la galerie');
    }

    // ===========================
    // ÉTAPE 5 : GESTION DU SCROLL INFINI
    // ===========================

    // Configurer l'Intersection Observer
    function setupInfiniteScroll() {
        // Créer un Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                // Vérifier si le marqueur est visible
                if (entries[0].isIntersecting && !isLoading && hasMoreImages) {
                    console.log(
                        "🔄 Scroll infini déclenché - Chargement de plus d'images..."
                    );
                    loadMoreImages();
                }
            },
            {
                // Options de l'observer
                rootMargin: "100px", // Charger 100px avant d'atteindre le marqueur
            }
        );

        // Observer le marqueur
        if (marker) {
            observer.observe(marker);
            console.log("👀 Observation du marqueur de scroll infini activée");
        } else {
            console.error("❌ Marqueur de scroll infini non trouvé");
        }
    }

    // Fonction pour charger plus d'images
    async function loadMoreImages() {
        // Vérifier qu'on n'est pas déjà en train de charger
        if (isLoading || !hasMoreImages) return;

        // Vérifier si on a atteint le nombre total de pages
        if (totalPages && currentPage >= totalPages) {
            hasMoreImages = false;
            console.log("📭 Toutes les pages ont été chargées");
            return;
        }

        isLoading = true;
        currentPage++; // Incrémenter la page

        console.log(
            `📄 Chargement page ${currentPage}${totalPages ? `/${totalPages}` : ""
            } pour "${currentQuery}"`
        );

        try {
            toggleLoader(true); // Afficher le loader
            const images = await fetchImages(currentQuery, currentPage);

            if (images.length === 0 || (totalPages && currentPage >= totalPages)) {
                hasMoreImages = false;
                console.log("📭 Plus d'images disponibles");
            } else {
                displayImages(images); // Afficher les nouvelles images
            }
        } catch (error) {
            console.error("❌ Erreur lors du chargement des images:", error);
            currentPage--; // Revert page increment on error
            showError("Erreur lors du chargement des images");
        } finally {
            isLoading = false;
            toggleLoader(false); // Masquer le loader
        }
    }

    // ===========================
    // ÉTAPE 6 : SYSTÈME DE RECHERCHE
    // ===========================

    // Fonction pour gérer la recherche
    async function handleSearch(query) {
        // Nettoyer la query (trim, validation)
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            showError("Veuillez entrer un terme de recherche");
            return;
        }

        console.log("🔍 Nouvelle recherche:", trimmedQuery);

        // Vider la liste d'images
        clearImagesList();
        // Mettre à jour la query actuelle
        currentQuery = trimmedQuery;

        try {
            // Afficher le loader
            toggleLoader(true);
            // Charger les premières images de la recherche
            const images = await fetchImages(currentQuery, 1);
            // Afficher les images
            displayImages(images);
            // Vérifier s'il y a plus d'images
            hasMoreImages = images.length >= PER_PAGE;
        } catch (error) {
            console.error("❌ Erreur lors de la recherche:", error);
            showError("Erreur lors de la recherche d'images");
        } finally {
            // Masquer le loader
            toggleLoader(false);
        }
    }

    // ===========================
    // ÉTAPE 7 : BOUTON SCROLL TO TOP
    // ===========================

    // Fonction pour faire défiler vers le haut
    function scrollToTop() {
        // Utiliser scrollTo avec un comportement smooth
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // ===========================
    // ÉTAPE 8 : INITIALISATION DE L'APPLICATION
    // ===========================

    // Configuration des event listeners
    function setupEventListeners() {
        // Event listener pour le formulaire de recherche
        if (searchForm) {
            searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                handleSearch(query);
            });
        }

        // Event listener pour le bouton scroll to top
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener("click", scrollToTop);

            // Initialiser le bouton comme caché
            scrollToTopBtn.style.opacity = "0";
            scrollToTopBtn.style.visibility = "hidden";
        }

        // Afficher/masquer le bouton selon la position de scroll
        window.addEventListener("scroll", () => {
            // Afficher le bouton après 300px de scroll
            if (window.scrollY > 300) {
                scrollToTopBtn.style.opacity = "1";
                scrollToTopBtn.style.visibility = "visible";
            } else {
                scrollToTopBtn.style.opacity = "0";
                scrollToTopBtn.style.visibility = "hidden";
            }
        });

        console.log("🎯 Event listeners configurés");
    }

    // Fonction d'initialisation
    async function initApp() {
        console.log("🚀 Initialisation de l'application...");

        try {
            // Supprimer les images de test du HTML
            clearImagesList();

            // Charger les images par défaut (random)
            console.log("📸 Chargement des images par défaut...");
            toggleLoader(true);
            const images = await fetchImages("nature", 1); // Utiliser 'nature' au lieu de 'random'
            displayImages(images);

            // Configurer le scroll infini
            setupInfiniteScroll();

            // Configurer les event listeners
            setupEventListeners();

            console.log("✅ Application initialisée avec succès");
        } catch (error) {
            // Gérer les erreurs d'initialisation
            console.error("❌ Erreur lors de l'initialisation:", error);
            showError(
                "Erreur lors du chargement de l'application. Vérifiez votre clé API."
            );
        } finally {
            toggleLoader(false);
        }
    }

    // Démarrer l'application
    initApp();

    // ===========================
    // ÉTAPE 9 : GESTION DES ERREURS AVANCÉE
    // ===========================

    // Fonction pour gérer les différents types d'erreurs API
    async function handleApiError(response) {
        let errorMessage = "Erreur inconnue";

        try {
            const errorData = await response.json();
            console.error("📋 Détails de l'erreur API:", errorData);
        } catch (e) {
            console.error("❌ Impossible de lire les détails de l'erreur");
        }

        switch (response.status) {
            case 401:
                errorMessage =
                    "🔑 Clé API invalide ou manquante. Vérifiez votre configuration dans config.js";
                console.error("💡 Solutions possibles:");
                console.error("1. Vérifiez que votre clé API est correcte");
                console.error(
                    "2. Créez un nouveau token sur https://unsplash.com/developers"
                );
                console.error("3. Vérifiez que config.js est bien chargé");
                break;
            case 403:
                errorMessage =
                    "⏰ Limite de requêtes atteinte (50/heure en mode démo). Réessayez plus tard.";
                hasMoreImages = false;
                break;
            case 404:
                errorMessage = "🔍 Aucun résultat trouvé pour cette recherche.";
                hasMoreImages = false;
                break;
            case 429:
                errorMessage =
                    "🚦 Trop de requêtes. Veuillez patienter quelques secondes.";
                break;
            case 500:
                errorMessage = "🔧 Erreur serveur Unsplash. Réessayez plus tard.";
                break;
            default:
                errorMessage = `❌ Erreur ${response.status}: ${response.statusText}`;
        }

        showError(errorMessage);
        return errorMessage;
    }

    // ===========================
    // ÉTAPE 10 : OPTIMISATIONS ET AMÉLIORATIONS
    // ===========================

    // TODO: Débounce pour la recherche
    function debounce(func, wait) {
        // Implémenter un débounce pour éviter trop de requêtes API
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // TODO: Cache des images pour éviter les doublons
    const imageCache = new Set();

    // TODO: Lazy loading pour de meilleures performances
    function setupLazyLoading() {
        // Implémenter le lazy loading des images
        const lazyImages = document.querySelectorAll(".search-imgs__list-item-img");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add("loaded");
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach((img) => observer.observe(img));
    }

    // TODO: Gestion du mode hors ligne
    function handleOfflineMode() {
        // Détecter si l'utilisateur est hors ligne
        if (!navigator.onLine) {
            showError(
                "Vous êtes hors ligne. Veuillez vérifier votre connexion Internet."
            );
        }
    }
});
