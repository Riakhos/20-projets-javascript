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
    // GÉNÉRATEUR DE DÉGRADÉS - LOGIQUE PRINCIPALE
    // ===========================

    // Sélection des éléments DOM
    const colorLabels = document.querySelectorAll(".gradient-app__color-label");
    const colorPickerInputs = [
        ...document.querySelectorAll(".gradient-app__color-input"),
    ];
    const gradientApp = document.querySelector(".gradient-app");
    const rangeLabelValue = document.querySelector(
        ".gradient-app__orientation-value"
    );

    // Données du dégradé avec valeurs par défaut JavaScript
    const gradientData = {
        angle: 90, // Angle en degrés
        colors: ["#222", "#f7df1e"], // Palette JavaScript
    };

    /**
     * Met à jour l'interface utilisateur avec les données du dégradé
     */
    function updateGradientUI() {
        const color1 = gradientData.colors[0];
        const color2 = gradientData.colors[1];
        const angle = gradientData.angle;

        // Mettre à jour le texte des labels de couleur
        colorLabels[0].textContent = color1;
        colorLabels[1].textContent = color2;

        // Synchroniser les inputs color picker
        colorPickerInputs[0].value = color1;
        colorPickerInputs[1].value = color2;

        // Appliquer les couleurs de fond aux labels
        colorLabels[0].style.backgroundColor = color1;
        colorLabels[1].style.backgroundColor = color2;

        // Générer et appliquer le dégradé CSS
        gradientApp.style.backgroundImage = `linear-gradient(${gradientData.angle}deg, ${color1}, ${color2})`;

        // Afficher l'angle actuel
        rangeLabelValue.textContent = `${angle}°`;

        // Adapter les couleurs des éléments d'interface
        adaptInputsColor();
    }

    // Initialiser l'interface au chargement
    updateGradientUI();

    /**
     * Adapte les couleurs des labels et bordures selon la luminosité
     * Utilise l'algorithme YIQ pour déterminer la luminosité perçue
     */
    function adaptInputsColor() {
        colorLabels.forEach((label, index) => {
            // Extraire la valeur hexadécimale sans le #
            const hexColor = label.textContent.replace("#", "");

            // Convertir hex en RGB
            const red = parseInt(hexColor.slice(0, 2), 16);
            const green = parseInt(hexColor.slice(2, 4), 16);
            const blue = parseInt(hexColor.slice(4, 6), 16);

            // Calculer la luminosité perçue (YIQ)
            const yiq = (red * 299 + green * 587 + blue * 144) / 1000;

            // Adapter la couleur du texte pour la lisibilité
            if (yiq >= 128) {
                // Couleur claire → texte sombre
                label.style.color = "#111";
            } else {
                // Couleur sombre → texte clair
                label.style.color = "#f5f7fa";
            }

            // Adapter la bordure de l'input-group pour le contraste
            const inputGroup = label.closest(".gradient-app__input-group");
            if (inputGroup) {
                // Réinitialiser les classes de couleur
                inputGroup.classList.remove("dark-color", "light-color");

                // Appliquer la classe appropriée pour la bordure
                if (yiq >= 128) {
                    // Couleur claire → bordure sombre pour contraste
                    inputGroup.classList.add("light-color");
                } else {
                    // Couleur sombre → bordure claire pour contraste
                    inputGroup.classList.add("dark-color");
                }
            }
        });
    }

    // ===========================
    // GESTION DE L'ANGLE DU DÉGRADÉ
    // ===========================

    const rangeInput = document.querySelector(".gradient-app__range");

    // Écouteur pour le changement d'angle
    rangeInput.addEventListener("input", updateGradientAngle);

    /**
     * Met à jour l'angle du dégradé depuis le range input
     */
    function updateGradientAngle() {
        // Mettre à jour les données
        gradientData.angle = rangeInput.value;

        // Rafraîchir l'interface
        updateGradientUI();
    }

    // ===========================
    // GESTION DES COULEURS
    // ===========================

    // Ajouter les écouteurs aux color pickers
    colorPickerInputs.forEach((input) =>
        input.addEventListener("input", colorInputModification)
    );

    /**
     * Gère la modification des couleurs via les color pickers
     * @param {Event} e - Événement input du color picker
     */
    function colorInputModification(e) {
        // Déterminer quel color picker a été modifié
        const currentColorPickerIndex = colorPickerInputs.indexOf(e.target);

        // Mettre à jour la couleur correspondante (en majuscules)
        gradientData.colors[currentColorPickerIndex] = e.target.value.toUpperCase();

        // Rafraîchir l'interface avec la nouvelle couleur
        updateGradientUI();
    }

    // ===========================
    // GESTION DE LA COPIE DU DÉGRADÉ
    // ===========================

    // Sélectionner le bouton de copie et ajouter l'écouteur
    const copyBtn = document.querySelector(".js-copy-button");
    const cssDisplay = document.querySelector(".gradient-app__css-display");
    const cssOutput = document.getElementById("css-output");

    copyBtn.addEventListener("click", handleGradientCopy);

    // Verrou pour empêcher les clics multiples pendant l'animation
    let lock = false;

    /**
     * Gère la copie du dégradé CSS dans le presse-papiers
     * Génère la chaîne CSS complète et déclenche l'animation de confirmation
     */
    function handleGradientCopy() {
        // Protection contre les clics multiples
        if (lock) return;
        lock = true;

        // Construire la chaîne de dégradé CSS complète
        const gradient = `linear-gradient(${gradientData.angle}deg, ${gradientData.colors[0]}, ${gradientData.colors[1]})`;
        const fullCSSRule = `background: ${gradient};`;

        // Copier dans le presse-papiers (API moderne)
        navigator.clipboard
            .writeText(gradient)
            .then(() => {
                console.log("📋 Dégradé copié:", gradient);
            })
            .catch((err) => {
                console.error("❌ Erreur lors de la copie:", err);
            });

        // Afficher le code CSS généré
        cssOutput.textContent = fullCSSRule;
        cssDisplay.classList.add("show");

        // Déclencher l'animation de confirmation "Copié !"
        copyBtn.classList.add("js-active-copy-btn");

        // Réinitialiser après l'animation (1 seconde)
        setTimeout(() => {
            copyBtn.classList.remove("js-active-copy-btn");
            lock = false; // Libérer le verrou pour permettre une nouvelle copie
        }, 1000);
    }

    // ===========================
    // GÉNÉRATION DE DÉGRADÉ ALÉATOIRE
    // ===========================

    // Sélectionner le bouton aléatoire et ajouter l'écouteur
    const randomGradientBtn = document.querySelector(".js-random-btn");
    randomGradientBtn.addEventListener("click", createRandomGradient);

    /**
     * Génère un dégradé aléatoire avec deux couleurs hexadécimales complètement aléatoires
     * Utilise l'algorithme Math.random() pour créer des combinaisons de couleurs uniques
     */
    function createRandomGradient() {
        console.log("🎲 Génération d'un dégradé aléatoire...");

        // Boucle pour générer autant de couleurs que d'inputs disponibles
        for (let i = 0; i < colorLabels.length; i++) {
            // Générer un nombre aléatoire entre 0 et 16777215 (0xFFFFFF en décimal)
            // 16777216 = 256³ représente toutes les combinaisons RGB possibles
            const randomDecimal = Math.floor(Math.random() * 16777216);

            // Convertir en hexadécimal et assurer 6 caractères avec padStart
            const hexString = randomDecimal.toString(16).padStart(6, "0");

            // Construire la couleur hexadécimale complète avec #
            const randomColor = `#${hexString}`;

            // Stocker en majuscules pour la cohérence
            gradientData.colors[i] = randomColor.toUpperCase();

            console.log(`🎨 Couleur ${i + 1} générée: ${randomColor.toUpperCase()}`);
        }

        // Rafraîchir l'interface avec les nouvelles couleurs aléatoires
        updateGradientUI();

        console.log("✅ Dégradé aléatoire appliqué:", gradientData.colors);
    }
});
