// ===========================
// ANIMATIONS SHIMMER
// ===========================

/**
 * Ajoute l'effet "shimmer" (classe CSS) sur un élément donné.
 * @param {Element} element - L'élément DOM auquel appliquer l'animation shimmer.
 */
function addShimmer(element) {
  element.classList.add("shimmer");
}

/**
 * Retire l'effet "shimmer" d'un élément.
 * @param {Element} element - L'élément DOM dont on retire l'animation shimmer.
 */
function removeShimmer(element) {
  element.classList.remove("shimmer");
}

/**
 * Simule un chargement visuel en appliquant l'effet shimmer pendant un délai,
 * puis retire l'effet et appelle un callback optionnel.
 * @param {Element} element - Élément DOM à animer.
 * @param {Function} [callback] - Fonction appelée après la fin du délai.
 * @param {number} [delay=1000] - Durée du shimmer en millisecondes.
 */
function loadWithShimmer(element, callback, delay = 1000) {
  addShimmer(element);

  setTimeout(() => {
    removeShimmer(element);
    if (callback) callback();
  }, delay);
}

// ==========================================
// APPLICATION DES ANIMATIONS AU CHARGEMENT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // Appliquer shimmer au titre
  const title = document.querySelector("h1");
  if (title) {
    loadWithShimmer(
      title,
      () => {
        title.style.opacity = "1";
      },
      500
    );
  }

  // Appliquer shimmer à la barre de recherche
  const searchContainer = document.querySelector(".search-container");
  if (searchContainer) {
    loadWithShimmer(
      searchContainer,
      () => {
        searchContainer.style.opacity = "1";
      },
      700
    );
  }

  // Appliquer shimmer aux boutons de filtre
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn, index) => {
    loadWithShimmer(
      btn,
      () => {
        btn.style.opacity = "1";
      },
      900 + index * 100
    );
  });

  // Appliquer shimmer aux éléments de la liste
  const listItems = document.querySelectorAll(".list-item");
  listItems.forEach((item, index) => {
    loadWithShimmer(
      item,
      () => {
        item.style.opacity = "1";
      },
      1200 + index * 100
    );
  });

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

  /**
   * Ferme tous les dropdowns de navigation.
   * Utilisé pour centraliser la logique de fermeture (clic extérieur, Escape, etc.).
   */
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

  // ===================================================
  // SECTION RECHERCHE — Bouton effacer & interactions
  // ===================================================
  const searchInput = document.querySelector(".search-input");
  const clearBtn = document.querySelector(".search-clear");
  const searchStatus = document.querySelector(".search-status");
  const resultsCount = document.querySelector(".results-count");
  const tableResults = document.querySelector(".table__results");
  const tableWrapper = document.querySelector(".table-wrapper");
  const loaderContainer = document.getElementById("loader");
  const errorContainer = document.getElementById("error-message");
  const retryBtn = document.getElementById("retry-btn");
  const noResultsContainer = document.getElementById("no-results");

  let dataArray = [];

  // Durée minimale d'affichage du loader en ms
  const LOADER_MIN_VISIBLE = 800;
  let loaderShownAt = 0;
  // Dernier état d'erreur : utile pour décider d'afficher l'erreur
  let lastFetchFailed = false;
  let lastErrorMessage = "";
  // Message d'erreur en attente si showError est appelé pendant que le loader est visible
  let pendingErrorMessage = null;
  // Drapeau explicite indiquant si le loader est considéré visible (plus robuste
  // que la lecture du style calculé pour éviter des effets de bord lors du rendu)
  let loaderVisible = false;

  // Initialisation : s'assurer que les overlays sont masqués au chargement
  // (lorsque le HTML peut avoir un affichage par défaut visible)
  if (errorContainer) errorContainer.style.display = "none";
  if (loaderContainer) loaderContainer.style.display = "none";
  pendingErrorMessage = null;
  lastFetchFailed = false;
  lastErrorMessage = "";

  // Helpers pour afficher / masquer loader et erreurs
  /**
   * Affiche le loader principal et masque les autres overlays (erreur / no-results).
   * Met le tableau en arrière-plan (opacité réduite) pour indiquer l'opération.
   */
  function showLoader() {
    if (!loaderContainer) return;
    loaderContainer.style.display = "flex";
    loaderVisible = true;
    // hide other overlays — utilise la fonction existante pour cohérence
    hideError();
    if (noResultsContainer) noResultsContainer.style.display = "none";
    if (tableWrapper) tableWrapper.style.opacity = "0.6";
  }
  /**
   * Masque le loader et restaure l'opacité du tableau.
   */
  function hideLoader() {
    if (!loaderContainer) return;
    loaderContainer.style.display = "none";
    // Marquer le loader comme non visible avant d'afficher une éventuelle erreur
    loaderVisible = false;
    if (tableWrapper) tableWrapper.style.opacity = "1";

    // Si un message d'erreur a été mis en attente pendant que le loader était visible,
    // l'afficher maintenant.
    if (pendingErrorMessage) {
      const msg = pendingErrorMessage;
      pendingErrorMessage = null;
      // Appeler showError maintenant que loaderVisible est false -> affichage immédiat
      showError(msg);
      return;
    }

    // Sinon, si la dernière requête a échoué ou si aucune donnée n'est chargée,
    // afficher l'erreur (utilise lastErrorMessage si disponible).
    const noData = !dataArray || dataArray.length === 0;
    if (lastFetchFailed || noData) {
      showError(
        lastErrorMessage ||
          "Impossible de charger les utilisateurs. Veuillez réessayer."
      );
    }
  }
  /**
   * Affiche le conteneur d'erreur avec un message personnalisé.
   * @param {string} [message]
   */
  function showError(message = "Une erreur est survenue") {
    if (!errorContainer) return;
    // Si le loader est visible (drapeau JS), ne pas afficher l'erreur immédiatement :
    // l'enregistrer pour l'afficher après hideLoader().
    if (loaderVisible) {
      pendingErrorMessage = message;
      lastFetchFailed = true;
      lastErrorMessage = message;
      return;
    }

    // mettre à jour le texte si nécessaire
    const textEl = errorContainer.querySelector(".error-text");
    if (textEl) textEl.textContent = message;
    errorContainer.style.display = "flex";
    if (loaderContainer) loaderContainer.style.display = "none";
    if (tableWrapper) tableWrapper.style.opacity = "0.6";
    // focus sur le bouton retry pour accessibilité
    const btn = errorContainer.querySelector(".error-retry-btn");
    if (btn) btn.focus();
  }
  /**
   * Masque le conteneur d'erreur et restaure l'état visuel du tableau.
   */
  function hideError() {
    if (!errorContainer) return;
    errorContainer.style.display = "none";
    if (tableWrapper) tableWrapper.style.opacity = "1";
  }

  // retry handler
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      hideError();
      getUsers();
    });
  }

  /**
   * Récupère les utilisateurs depuis l'API RandomUser, met à jour
   * la source `dataArray`, affiche les résultats et gère les erreurs.
   * Utilise les helpers showLoader / hideLoader / showError.
   */
  // Charge les utilisateurs depuis l'API et affiche le tableau
  async function getUsers() {
    // Affiche immédiatement le loader et mémorise l'instant
    showLoader();
    loaderShownAt = Date.now();

    try {
      const response = await fetch(
        "https://randomuser.me/api/?nat=fr&results=50"
      );

      if (!response.ok) throw new Error("Réponse réseau non ok");

      const { results } = await response.json();
      dataArray = results.sort((a, b) =>
        a.name.last.localeCompare(b.name.last)
      );
      // requête réussie
      lastFetchFailed = false;
      lastErrorMessage = "";
      renderUsers(dataArray);
      updateResults(dataArray.length);
    } catch (error) {
      console.error("Erreur getUsers:", error);
      // marquer l'erreur et stocker le message — l'affichage se fera après hideLoader()
      lastFetchFailed = true;
      lastErrorMessage =
        "Impossible de charger les utilisateurs. Vérifiez votre connexion et réessayez.";
      // Demander l'affichage de l'erreur (sera mis en attente si le loader est visible)
      showError(lastErrorMessage);
    } finally {
      // S'assurer que le loader reste visible au moins LOADER_MIN_VISIBLE ms
      const elapsed = loaderShownAt
        ? Date.now() - loaderShownAt
        : LOADER_MIN_VISIBLE;
      if (elapsed < LOADER_MIN_VISIBLE) {
        setTimeout(() => {
          hideLoader();
          loaderShownAt = 0;
        }, LOADER_MIN_VISIBLE - elapsed);
      } else {
        hideLoader();
        loaderShownAt = 0;
      }
    }

    renderUsers(dataArray);
  }
  // initial load
  getUsers();

  /**
   * Rend une liste d'utilisateurs dans le tbody du tableau.
   * @param {Array} array - Liste d'objets utilisateur provenant de l'API.
   */
  // Petite fonction pour afficher les utilisateurs dans le tableau
  function renderUsers(array) {
    if (!tableResults) return;
    // vider l'ancien contenu
    tableResults.textContent = "";

    if (!array || array.length === 0) {
      // masquer le tableau
      if (tableWrapper) tableWrapper.style.display = "none";
      if (noResultsContainer) noResultsContainer.style.display = "flex";
      return;
    }

    if (tableWrapper) tableWrapper.style.display = "block";
    if (noResultsContainer) noResultsContainer.style.display = "none";

    const fragment = document.createDocumentFragment();

    array.forEach((user) => {
      const tr = document.createElement("tr");
      tr.className = "table__content-row";

      tr.innerHTML = `
                <td class="table__data table__data-info">
                    <div class="table__data-content-wrapper">
                        <img src="" alt="" class="table__data-img">
                        <span class="js-td-name"></span>
                    </div>
                </td>
                <td class="table__data table__data-email">
                    <span class="js-td-email"></span>
                </td>
                <td class="table__data table__data-phone">
                    <span class="js-td-phone-number"></span>
                </td>
            `;

      tr.querySelector(".table__data-img").src = user.picture.thumbnail;
      tr.querySelector(
        ".js-td-name"
      ).textContent = `${user.name.last} ${user.name.first}`;
      tr.querySelector(".js-td-email").textContent = user.email;
      tr.querySelector(".js-td-phone-number").textContent = user.phone;
      fragment.appendChild(tr);
    });

    tableResults.appendChild(fragment);
  }

  // rendre accessible le span pour les lecteurs d'écran
  if (searchStatus) searchStatus.setAttribute("aria-live", "polite");

  /**
   * Met à jour le texte et les classes de la zone de statut de recherche.
   * @param {string} text - Texte à afficher dans la zone de statut.
   * @param {string} state - Modificateur d'état ("searching", "ready", "no-results").
   */
  // Fonction utilitaire pour basculer le statut et les classes d'état
  function setStatus(text = "", state = "") {
    if (!searchStatus) return;
    // enlever toutes les classes d'état
    searchStatus.classList.remove(
      "search-status--searching",
      "search-status--ready",
      "search-status--no-results"
    );
    if (state) searchStatus.classList.add(`search-status--${state}`);
    searchStatus.textContent = text;
  }

  /**
   * Met à jour la zone de résultats (nombre) en fonction du nombre d'items trouvés.
   * @param {number} count - Nombre d'éléments trouvés.
   */
  // Fonction appelée par la logique de recherche quand on a les résultats
  function updateResults(count) {
    if (typeof count !== "number") return;
    // Met à jour le compteur visible des résultats
    if (resultsCount) {
      if (count === 0) {
        resultsCount.textContent = "0 utilisateur(s) trouvé(s)";
      } else if (count === 1) {
        resultsCount.textContent = "1 utilisateur trouvé";
      } else {
        resultsCount.textContent = `${count} utilisateurs trouvés`;
      }
    }

    // Met à jour la zone de statut (couleurs / messages)
    if (count === 0) setStatus("Aucun résultat", "no-results");
    else setStatus(`${count} résultat(s)`, "ready");
  }

  /**
   * Retourne une version debounce d'une fonction pour limiter les appels rapides.
   * @param {Function} fn - Fonction à débouncer.
   * @param {number} [wait=600] - Délai en ms.
   * @returns {Function}
   */
  // Petit debounce utilitaire pour éviter les changements trop rapides
  function debounce(fn, wait = 600) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Placeholder : fonction appelée après le délai de frappe
  // Remplacez son contenu par l'appel réel à votre fonction de recherche
  /**
   * Fonction debounced appelée après la frappe utilisateur dans le champ de recherche.
   * @param {string} query - Chaîne de recherche saisie par l'utilisateur.
   */
  const onSearchDebounced = debounce((query) => {
    // Ici on attend la réponse de la recherche et on appellera updateResults(count)
    // Exemple : const results = performSearch(query); updateResults(results.length);
    // Pour l'instant, on ne fait rien — la logique de recherche doit appeler updateResults()
    // console.log('Recherche déclenchée pour:', query);
  }, 600);

  /**
   * Affiche ou masque le bouton "effacer" en fonction du contenu du champ de recherche.
   */
  function updateClearButton() {
    if (!searchInput || !clearBtn) return;
    clearBtn.style.display = searchInput.value.trim() ? "inline-flex" : "none";
  }

  if (searchInput && clearBtn) {
    // état initial
    updateClearButton();
    setStatus("Prêt", "ready");

    // montrer/masquer et filtrer au fur et à mesure de la saisie
    searchInput.addEventListener("input", (e) => {
      updateClearButton();
      const value = e.target.value.trim();

      if (!value) {
        // champ vide -> état prêt et affichage complet
        setStatus("Prêt", "ready");
        renderUsers(dataArray);
        updateResults(dataArray.length);
      } else {
        // champ non vide -> état recherche et filtrage local immédiat
        setStatus("Recherche en cours...", "searching");
        filterData(e);
        // déclencher aussi le debounce pour actions côté serveur si nécessaire
        onSearchDebounced(value);
      }
    });

    // action du bouton : effacer, masquer, repositionner le focus et restaurer la liste complète
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      updateClearButton();
      searchInput.focus();
      setStatus("Prêt", "ready");
      renderUsers(dataArray);
      updateResults(dataArray.length);
    });
  }

  /**
   * Filtre la liste locale `dataArray` en fonction de la saisie utilisateur.
   * Peut recevoir soit l'événement `input` (e.target.value) soit directement une chaîne.
   *
   * Comportement :
   * - si la recherche est vide : restaure la liste complète et met à jour le compteur.
   * - sinon : utilise `searchForOccurences` pour tester chaque utilisateur.
   * - si aucun utilisateur ne correspond : affiche `noResultsContainer`, masque `tableWrapper`
   *   et vide les résultats (`tableResults`).
   *
   * @param {Event|string} e - Événement input ou chaîne de recherche.
   */
  function filterData(e) {
    const value = typeof e === "string" ? e : (e && e.target && e.target.value) || "";
    const searchedString = value.trim().toLowerCase();

    if (!Array.isArray(dataArray)) return;

    if (!searchedString) {
      // Champ vide -> afficher tout
      if (tableWrapper) tableWrapper.style.display = "block";
      if (noResultsContainer) noResultsContainer.style.display = "none";
      renderUsers(dataArray);
      updateResults(dataArray.length);
      return;
    }

    const filteredUsersArray = dataArray.filter((userData) =>
      searchForOccurences(userData, searchedString)
    );

    if (!filteredUsersArray.length) {
      // Aucun résultat : afficher le panneau "no results", masquer le tableau
      if (tableWrapper) tableWrapper.style.display = "none";
      if (noResultsContainer) noResultsContainer.style.display = "flex";
      if (tableResults) tableResults.textContent = "";
      updateResults(0);
    } else {
      // Résultats trouvés : afficher le tableau et masquer le panneau "no results"
      if (tableWrapper) tableWrapper.style.display = "block";
      if (noResultsContainer) noResultsContainer.style.display = "none";
      renderUsers(filteredUsersArray);
      updateResults(filteredUsersArray.length);
    }
  }

  /**
   * Teste si un utilisateur correspond à une chaîne de recherche.
   *
   * Règles :
   * - La recherche est découpée en mots (séparés par espaces).
   * - 1 mot  : vrai si le prénom OU le nom commence par ce mot (startsWith).
   * - 2 mots : vrai si (prénom startsWith mot1 ET nom startsWith mot2) ou l'inverse.
   * - >2 mots: plus permissif — chaque mot doit apparaître soit au début du prénom,
   *            soit au début du nom, soit quelque part dans le nom complet.
   *
   * Robustesse :
   * - gère l'absence des champs `name.first` / `name.last` (retourne false si manquants).
   * - normalize les valeurs en minuscules avant comparaison.
   *
   * NOTE : cette fonction est pure — elle renvoie uniquement true/false.
   * L'affichage de `noResultsContainer` est géré par filterData qui appelle cette fonction.
   *
   * @param {Object} userData - Objet utilisateur (structure RandomUser).
   * @param {string} searchedString - Chaîne de recherche normalisée (minuscule).
   * @returns {boolean} true si l'utilisateur correspond à la recherche, false sinon.
   */
  function searchForOccurences(userData, searchedString) {
    if (!userData || typeof searchedString !== "string" || searchedString.trim() === "") return false;

    const searchedWords = searchedString.split(/\s+/).filter(Boolean);

    const firstName = (userData.name && userData.name.first ? userData.name.first : "").toLowerCase();
    const lastName = (userData.name && userData.name.last ? userData.name.last : "").toLowerCase();

    // si pas de nom/prénom disponibles on ne matche pas
    if (!firstName && !lastName) return false;

    if (searchedWords.length === 1) {
      return (
        firstName.startsWith(searchedWords[0]) ||
        lastName.startsWith(searchedWords[0])
      );
    }

    if (searchedWords.length === 2) {
      return (
        (firstName.startsWith(searchedWords[0]) && lastName.startsWith(searchedWords[1])) ||
        (lastName.startsWith(searchedWords[0]) && firstName.startsWith(searchedWords[1]))
      );
    }

    // >2 mots : chaque mot doit correspondre au début du prénom, au début du nom,
    // ou être présent quelque part dans le nom complet.
    const fullName = `${firstName} ${lastName}`.trim();
    return searchedWords.every(
      (w) =>
        firstName.startsWith(w) ||
        lastName.startsWith(w) ||
        fullName.includes(w)
    );
  }

});
