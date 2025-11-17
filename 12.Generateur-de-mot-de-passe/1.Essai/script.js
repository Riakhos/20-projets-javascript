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
  // GESTION DES ANIMATIONS
  // ===========================

  // Animation shimmer pour les éléments avec dégradés
  function initShimmerAnimations() {
    // - Sélectionner les éléments avec background sombre (containers)
    const darkShimmerElements = document.querySelectorAll(
      ".pwd-generator__header,.pwd-generator"
    );

    // - Sélectionner les éléments avec background doré (texte uniquement)
    const goldShimmerElements = document.querySelectorAll(
      ".pwd-generator__title, .pwd-generator__title--style, .pwd-generator__desc, .pwd-generator__range-label, .pwd-generator__checkbox-label, .pwd-generator__checkboxes-desc"
    );

    // - Sélectionner le conteneur principal pour animation de fond
    const goldDiv = document.querySelector(".pwd-generator-page");

    // - Appliquer les styles CSS pour les éléments sombres
    if (darkShimmerElements.length > 0) {
      darkShimmerElements.forEach((el) => {
        el.style.background = "#222";
        el.style.backgroundSize = "200% 100%";
        el.style.animation = "shimmer 5s ease-in-out infinite";
      });
    }

    // - Appliquer les styles CSS pour les éléments dorés
    if (goldShimmerElements.length > 0) {
      goldShimmerElements.forEach((el) => {
        el.style.background =
          "linear-gradient(90deg, #f7df1e, #ffa500, #f7df1e)";
        el.style.backgroundSize = "200% 100%";
        el.style.animation = "shimmer 5s ease-in-out infinite";
        el.style.webkitBackgroundClip = "text";
        el.style.backgroundClip = "text";
        el.style.webkitTextFillColor = "transparent";
        el.style.color = "transparent"; // Fallback pour les navigateurs qui ne supportent pas background-clip
      });
    }

    // - Appliquer l'animation shimmer au conteneur principal
    if (goldDiv) {
      goldDiv.style.background =
        "linear-gradient(90deg, #f7df1e, #ffa500, #f7df1e)";
      goldDiv.style.backgroundSize = "200% 100%";
    }
  }

  // Styles pour boutons et inputs
  function initButtonAndInputStyles() {
    // - Styliser le bouton principal
    const generateBtn = document.querySelector(
      ".pwd-generator__generate-pwd-btn"
    );
    if (generateBtn) {
      generateBtn.style.background =
        "linear-gradient(135deg, #f7df1e, #ffa500)";
      generateBtn.style.color = "#222";
      generateBtn.style.border = "none";
      generateBtn.style.padding = "1rem 2rem";
      generateBtn.style.fontSize = "1.1rem";
      generateBtn.style.fontWeight = "bold";
      generateBtn.style.borderRadius = "10px";
      generateBtn.style.cursor = "pointer";
      generateBtn.style.transition = "all 0.3s ease";
      generateBtn.style.boxShadow = "0 4px 15px rgba(247, 223, 30, 0.3)";

      // Effets hover
      generateBtn.addEventListener("mouseenter", () => {
        generateBtn.style.transform = "translateY(-2px)";
        generateBtn.style.boxShadow = "0 6px 20px rgba(247, 223, 30, 0.5)";
      });

      generateBtn.addEventListener("mouseleave", () => {
        generateBtn.style.transform = "translateY(0)";
        generateBtn.style.boxShadow = "0 4px 15px rgba(247, 223, 30, 0.3)";
      });
    }

    // - Styliser le bouton de copie
    const copyBtn = document.querySelector(".pwd-generator__copy-btn");
    if (copyBtn) {
      copyBtn.style.background = "#f7df1e";
      copyBtn.style.border = "none";
      copyBtn.style.padding = "0.5rem";
      copyBtn.style.borderRadius = "5px";
      copyBtn.style.cursor = "pointer";
      copyBtn.style.transition = "all 0.3s ease";

      copyBtn.addEventListener("mouseenter", () => {
        copyBtn.style.background = "#ffa500";
        copyBtn.style.transform = "scale(1.1)";
      });

      copyBtn.addEventListener("mouseleave", () => {
        copyBtn.style.background = "#f7df1e";
        copyBtn.style.transform = "scale(1)";
      });
    }

    // - Styliser le slider
    const rangeInput = document.querySelector(".pwd-generator__range-input");
    if (rangeInput) {
      rangeInput.style.width = "100%";
      rangeInput.style.height = "5px";
      rangeInput.style.background = "#333";
      rangeInput.style.borderRadius = "5px";
      rangeInput.style.outline = "none";
      rangeInput.style.webkitAppearance = "none";
      rangeInput.style.appearance = "none";
    }

    // - Styliser les checkboxes
    const checkboxes = document.querySelectorAll(".pwd-generator__checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.style.accentColor = "#f7df1e";
    });

    // - Styliser les labels
    const labels = document.querySelectorAll(
      ".pwd-generator__checkbox-label, .pwd-generator__range-label"
    );
    labels.forEach((label) => {
      label.style.color = "#f5f7fa";
      label.style.cursor = "pointer";
    });

    // - Styliser la description des options
    const checkboxDesc = document.querySelector(
      ".pwd-generator__checkboxes-desc"
    );
    if (checkboxDesc) {
      checkboxDesc.style.fontWeight = "bold";
      checkboxDesc.style.color = "#f7df1e";
      checkboxDesc.style.marginBottom = "1rem";
    }
  }

  // Animations d'entrée au chargement de la page
  function initLoadAnimations() {
    // - Sélectionner les éléments à animer
    const animatedElements = [
      // - Définir les éléments et leurs délais d'animation
      { selector: ".pwd-generator__header", delay: 100 },
      { selector: ".pwd-generator", delay: 400 },
    ];

    // - Appliquer les animations
    animatedElements.forEach(({ selector, delay }) => {
      // - Sélectionner l'élément
      const element = document.querySelector(selector);

      if (element) {
        // - Appliquer opacity: 0 et translateY au début
        element.style.opacity = 0;
        element.style.transform = "translateY(30px)";

        // - Animer vers opacity: 1 et translateY: 0 avec setTimeout
        setTimeout(() => {
          element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          element.style.opacity = 1;
          element.style.transform = "translateY(0)";
        }, delay);
      }
    });
  }

  // ===========================
  // GÉNÉRATEUR DE MOT DE PASSE 🔒
  // ===========================

  // ===========================
  // A. VARIABLES ET CONSTANTES
  // ===========================

  // TODO: Créer des tableaux contenant les caractères pour chaque type
  // - Caractères minuscules (a-z)
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz".split("");
  // - Caractères majuscules (A-Z)
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  // - Nombres (0-9)
  const numberChars = "0123456789".split("");
  // - Symboles spéciaux (!@#$%^&*()_+-=[]{}|;:,.<>?)
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?".split("");
  // - Tableau pour stocker les caractères disponibles
  let availableChars = [];
  // - Taille du mot de passe (par défaut 12)
  let passwordLength = 12;

  // TODO: Sélectionner les éléments du DOM
  // - Input range pour la taille
  const rangeInput = document.querySelector(".pwd-generator__range-input");
  // - Label pour afficher la taille actuelle
  const rangeLabelElement = document.querySelector(
    ".pwd-generator__range-label"
  );
  // - Checkboxes pour les options
  const lowercaseCheckbox = document.querySelector("#lowercaseChars");
  const uppercaseCheckbox = document.querySelector("#uppercaseChars");
  const numberCheckbox = document.querySelector("#numberChars");
  const symbolCheckbox = document.querySelector("#symbolChars");
  // - Zone d'affichage du résultat
  const resultDisplay = document.querySelector(".pwd-generator__generated-pwd");
  // - Bouton de génération
  const generateButton = document.querySelector(
    ".pwd-generator__generate-pwd-btn"
  );
  // - Bouton de copie
  const copyButton = document.querySelector(".pwd-generator__copy-btn");
  // - Zone des messages d'erreur
  const errorMessageElement = document.querySelector(
    ".pwd-generator__error-msg"
  );

  // ===========================
  // B. FONCTIONS UTILITAIRES
  // ===========================

  // TODO: Fonction de génération sécurisée de nombres aléatoires
  // Utiliser window.crypto.getRandomValues() pour plus de sécurité
  // que Math.random()
  function getSecureRandomNumber(max) {
    // - Créer un tableau pour stocker la valeur aléatoire
    const array = new Uint32Array(1);
    // - Générer une valeur cryptographiquement sécurisée
    window.crypto.getRandomValues(array);
    // - Retourner un nombre entre 0 et max-1
    return array[0] % max;
  }

  // TODO: Fonction pour récupérer un caractère aléatoire d'un tableau
  function getRandomCharacter(charactersArray) {
    // TODO: Utiliser getSecureRandomNumber() pour sélectionner un index
    // - Vérifier que le tableau n'est pas vide
    if (charactersArray.length === 0) {
      throw new Error("Le tableau de caractères est vide");
    }
    // - Utiliser getSecureRandomNumber() pour sélectionner un index
    const randomIndex = getSecureRandomNumber(charactersArray.length);
    // - Retourner le caractère à l'index sélectionné
    return charactersArray[randomIndex];
  }

  // TODO: Fonction pour construire le tableau de caractères disponibles
  // en fonction des checkboxes cochées
  function buildCharacterSet() {
    // TODO: Combiner les tableaux de caractères correspondants
    // - Initialiser le tableau des caractères disponibles
    let characterSet = [];

    // - Vérifier quelles checkboxes sont cochées et ajouter les caractères
    if (lowercaseCheckbox && lowercaseCheckbox.checked) {
      characterSet = characterSet.concat(lowercaseChars);
    }
    if (uppercaseCheckbox && uppercaseCheckbox.checked) {
      characterSet = characterSet.concat(uppercaseChars);
    }
    if (numberCheckbox && numberCheckbox.checked) {
      characterSet = characterSet.concat(numberChars);
    }
    if (symbolCheckbox && symbolCheckbox.checked) {
      characterSet = characterSet.concat(symbolChars);
    }

    // - Vérifier qu'au moins une option est cochée
    if (characterSet.length === 0) {
      throw new Error(
        "Veuillez sélectionner au moins une option de génération"
      );
    }
    // - Retourner le tableau final
    return characterSet;
  }

  // ===========================
  // C. GÉNÉRATION DU MOT DE PASSE
  // ===========================

  // TODO: Fonction principale de génération
  function generatePassword() {
    try {
      // - Effacer les messages d'erreur précédents
      clearErrorMessage();

      // - Récupérer la taille désirée depuis l'input range
      const length = parseInt(rangeInput.value);

      // - Construire le set de caractères disponibles
      const characterSet = buildCharacterSet();

      // - Générer le mot de passe caractère par caractère
      let password = "";
      for (let i = 0; i < length; i++) {
        password += getRandomCharacter(characterSet);
      }

      // - Afficher le résultat dans la zone prévue
      if (resultDisplay) {
        resultDisplay.textContent = password;
      }

      // - Activer l'animation loading sur le titre
      const titleElement = document.querySelector(".pwd-generator__title");
      if (titleElement) {
        titleElement.classList.add("js-active-generator");
        // - Retirer l'animation loading après un court délai
        setTimeout(() => {
          titleElement.classList.remove("js-active-generator");
        }, 2000);
      }
    } catch (error) {
      // - Gérer les erreurs (aucune option cochée, etc.)
      displayErrorMessage(error.message);
    }
  }

  // ===========================
  // D. FONCTIONS UTILITAIRES UI
  // ===========================

  // TODO: Fonction pour copier le mot de passe dans le presse-papier
  function copyPasswordToClipboard() {
    // Récupérer le mot de passe affiché
    const pwd = resultDisplay ? resultDisplay.textContent.trim() : "";

    if (!pwd) {
      displayErrorMessage("Aucun mot de passe à copier");
      return;
    }

    // Fonction fallback utilisant un textarea et document.execCommand('copy')
    function fallbackCopy(text) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (successful) {
          displaySuccessMessage("Mot de passe copié");
        } else {
          displayErrorMessage("Impossible de copier le mot de passe");
        }
      } catch (err) {
        displayErrorMessage("Impossible de copier le mot de passe");
      }
    }

    // Utiliser l'API Clipboard moderne si disponible
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(pwd)
        .then(() => {
          displaySuccessMessage("Mot de passe copié dans le presse-papier");
        })
        .catch(() => {
          // En cas d'échec, essayer le fallback
          fallbackCopy(pwd);
        });
    } else {
      // Fallback pour anciens navigateurs
      fallbackCopy(pwd);
    }
  }

  // TODO: Fonction pour mettre à jour l'affichage de la taille
  function updatePasswordLengthDisplay() {
    // - Récupérer la valeur actuelle du range
    const currentLength = rangeInput.value;

    // - Mettre à jour le label avec la valeur actuelle
    if (rangeLabelElement) {
      rangeLabelElement.textContent = `Taille du mot de passe : ${currentLength}`;
    }

    // - Mettre à jour la variable globale
    passwordLength = parseInt(currentLength);
  }

  // TODO: Fonction pour afficher les messages d'erreur
  function displayErrorMessage(message) {
    if (errorMessageElement) {
      // - Afficher le message dans la zone d'erreur
      errorMessageElement.textContent = message;
      errorMessageElement.style.color = "#ff6b6b";
      errorMessageElement.style.fontWeight = "bold";
      errorMessageElement.style.opacity = "1";

      // - Masquer automatiquement après 5 secondes
      setTimeout(() => {
        clearErrorMessage();
      }, 5000);
    }
  }

  // TODO: Fonction pour afficher les messages de succès
  function displaySuccessMessage(message) {
    if (errorMessageElement) {
      // - Afficher le message de succès
      errorMessageElement.textContent = message;
      errorMessageElement.style.color = "#4ecdc4";
      errorMessageElement.style.fontWeight = "bold";
      errorMessageElement.style.opacity = "1";

      // - Masquer automatiquement après 3 secondes
      setTimeout(() => {
        clearErrorMessage();
      }, 3000);
    }
  }

  // TODO: Fonction pour effacer les messages d'erreur
  function clearErrorMessage() {
    if (errorMessageElement) {
      // - Vider la zone des messages d'erreur
      errorMessageElement.textContent = "";
      errorMessageElement.style.opacity = "0";
    }
  }

  // ===========================
  // E. GESTION DES ÉVÉNEMENTS
  // ===========================

  // TODO: Événement pour le bouton de génération
  // Clic sur "Générer" -> appeler generatePassword()
  if (generateButton) {
    generateButton.addEventListener("click", generatePassword);
  }

  // TODO: Événement pour le bouton de copie
  // Clic sur l'icône de copie -> appeler copyPasswordToClipboard()
  if (copyButton) {
    copyButton.addEventListener("click", copyPasswordToClipboard);
  }

  // TODO: Événement pour l'input range
  // Changement de valeur -> appeler updatePasswordLengthDisplay()
  if (rangeInput) {
    rangeInput.addEventListener("input", updatePasswordLengthDisplay);
    rangeInput.addEventListener("change", updatePasswordLengthDisplay);
  }

  // TODO: Événements pour les checkboxes
  // Changement d'état -> effacer les messages d'erreur
  const allCheckboxes = [
    lowercaseCheckbox,
    uppercaseCheckbox,
    numberCheckbox,
    symbolCheckbox,
  ];
  allCheckboxes.forEach((checkbox) => {
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        clearErrorMessage();
      });
    }
  });

  // TODO: Événement optionnel : génération automatique
  // Quand une option change -> régénérer automatiquement
  allCheckboxes.forEach((checkbox) => {
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        // - Régénérer automatiquement si il y a déjà un mot de passe affiché
        if (resultDisplay && resultDisplay.textContent.trim() !== "") {
          generatePassword();
        }
      });
    }
  });

  // ===========================
  // F. INITIALISATION
  // ===========================

  // TODO: Appeler les fonctions d'initialisation
  function initPasswordGenerator() {
    // - Mettre à jour l'affichage initial de la taille
    updatePasswordLengthDisplay();

    // - Générer un premier mot de passe par défaut
    generatePassword();

    // - Effacer les messages d'erreur au démarrage
    clearErrorMessage();

    console.log("Générateur de mot de passe initialisé avec succès");
  }

  // Initialiser les animations
  initShimmerAnimations();
  initLoadAnimations();
  initButtonAndInputStyles();

  // Initialiser le générateur de mot de passe
  initPasswordGenerator();
});
