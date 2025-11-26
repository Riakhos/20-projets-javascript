import phrases from "./data/phrases.js";

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

    // ================================
    // TYPING GAME — LOGIQUE PRINCIPALE
    // ================================

    // --- État du jeu ---
    const gameState = {
        status: "idle", // 'idle' | 'playing' | 'finished'
        currentPhrase: "",
        // currentIndex is derived from textarea length; keep for compatibility
        currentIndex: 0,
        startTime: null,
        elapsedSeconds: 0,
        timerInterval: null,
        // erreurs cumulées pendant la session (ne pas décrémenter quand on corrige)
        errors: 0,
        // compteur de caractères corrects déjà validés (phrases terminées)
        cumulativeCorrectChars: 0,
        // variable calculée dynamiquement pour l'affichage (cumulative + current)
        correctChars: 0,
        // positions actuellement incorrectes (Set d'indices) pour la phrase en cours
        incorrectPositions: new Set(),
        // historique des erreurs vues pour éviter de compter plusieurs fois la même erreur
        // clé : `${phraseIndex}-${charIndex}`
        seenMistakes: new Set(),
        phrasesQueue: [],
        currentPhraseIndex: 0,
        totalPhrasesPerGame: 5,
    };

    // --- Éléments du DOM ---
    const phraseDisplay = document.getElementById("phrase-display");
    const typingTextarea = document.getElementById("typing-textarea");
    const timerDisplay = document.getElementById("timer-display");
    const wpmDisplay = document.getElementById("wpm-display");
    const accuracyDisplay = document.getElementById("accuracy-display");
    const btnStart = document.getElementById("btn-start");
    const btnReset = document.getElementById("btn-reset");
    const gameArea = document.getElementById("game-area");
    const resultsScreen = document.getElementById("results-screen");
    const btnPlayAgain = document.getElementById("btn-play-again");
    const progressLabel = document.getElementById("progress-label");
    const progressBar = document.getElementById("progress-bar");
    const phraseCountInput = document.getElementById("phrase-count");

    // résultats finaux
    const resultTime = document.getElementById("result-time");
    const resultWpm = document.getElementById("result-wpm");
    const resultAccuracy = document.getElementById("result-accuracy");
    const resultErrors = document.getElementById("result-errors");

    // stats live (élément timer pour animation pulsation)
    const statTimer = document.querySelector(".typing-game__stat:first-child");

    // --- Helpers ---

    /**
     * Retourne un tableau de N phrases aléatoires (texte seulement), sans répétition si possible.
     * @param {number} count
     * @returns {string[]}
     */
    function getRandomPhrases(count) {
        if (!phrases || phrases.length === 0) return ["Aucune phrase disponible."];
        const pool = [...phrases];
        const out = [];
        const n = Math.min(count, pool.length);
        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            out.push(pool[idx].text);
            pool.splice(idx, 1);
        }
        return out;
    }

    /**
     * Affiche la phrase avec mise en surbrillance de la position courante.
     * @param {string} phrase
     * @param {number} index - Position du caractère courant.
     */
    /**
     * Affiche la phrase en se basant sur la valeur courante du textarea.
     * @param {string} phrase
     * @param {string} typedValue - contenu actuel du textarea
     */
    function displayPhrase(phrase, typedValue) {
        if (!phraseDisplay) return;
        phraseDisplay.innerHTML = "";

        const typedLen = typedValue ? typedValue.length : 0;

        for (let i = 0; i < phrase.length; i++) {
            const span = document.createElement("span");
            const char = phrase[i];
            span.innerHTML = char === " " ? "&nbsp;" : char;

            if (i < typedLen) {
                // caractère déjà saisi : afficher correct / incorrect
                if (
                    gameState.incorrectPositions &&
                    gameState.incorrectPositions.has(i)
                ) {
                    span.classList.add("incorrect");
                } else {
                    span.classList.add("typed");
                }
            } else if (i === typedLen) {
                // curseur virtuel
                span.classList.add("current");
            } else {
                span.classList.add("pending");
            }

            phraseDisplay.appendChild(span);
        }
    }

    /**
     * Démarre le timer du jeu (appelé au premier caractère tapé).
     */
    function startTimer() {
        if (gameState.timerInterval) return; // déjà démarré
        gameState.startTime = Date.now();

        // ajouter classe animation sur le timer
        if (statTimer) statTimer.classList.add("js-active-time");

        gameState.timerInterval = setInterval(() => {
            if (gameState.status !== "playing") {
                clearInterval(gameState.timerInterval);
                gameState.timerInterval = null;
                if (statTimer) statTimer.classList.remove("js-active-time");
                return;
            }

            gameState.elapsedSeconds = Math.floor(
                (Date.now() - gameState.startTime) / 1000
            );
            updateStats();
        }, 100); // update rapide pour fluidité
    }

    /**
     * Calcule le WPM (words per minute) en fonction des caractères corrects et du temps écoulé.
     * @param {number} correctChars
     * @param {number} seconds
     * @returns {number}
     */
    function calcWPM(correctChars, seconds) {
        if (seconds === 0) return 0;
        const words = correctChars / 5; // convention : 1 mot = 5 caractères
        const minutes = seconds / 60;
        return Math.round(words / minutes);
    }

    /**
     * Calcule la précision (%) en fonction du nombre de caractères corrects et d'erreurs.
     * @param {number} correctChars
     * @param {number} errors
     * @returns {number}
     */
    function calcAccuracy(correctChars, errors) {
        const total = correctChars + errors;
        if (total === 0) return 100;
        return Math.round((correctChars / total) * 100);
    }

    /**
     * Met à jour l'affichage des statistiques en temps réel (timer, WPM, précision).
     */
    function updateStats() {
        if (timerDisplay) timerDisplay.textContent = `${gameState.elapsedSeconds}s`;

        const wpm = calcWPM(gameState.correctChars, gameState.elapsedSeconds);
        if (wpmDisplay) wpmDisplay.textContent = wpm;

        const accuracy = calcAccuracy(gameState.correctChars, gameState.errors);
        if (accuracyDisplay) accuracyDisplay.textContent = `${accuracy}%`;
    }

    /**
     * Met à jour l'affichage de la progression (X / Y phrases) et la barre de progression
     * en fonction du % de caractères corrects cumulés (phrases terminées + phrase en cours).
     */
    function updateProgressUI() {
        const currentPhraseNum = gameState.currentPhraseIndex + 1;
        const totalPhrases = gameState.totalPhrasesPerGame;

        // Calcul du % de caractères corrects sur l'ensemble des phrases
        // Total de caractères pour toutes les phrases de la queue
        const totalChars = gameState.phrasesQueue.reduce(
            (sum, p) => sum + p.length,
            0
        );
        // Caractères corrects : validés (phrases terminées) + corrects dans la phrase courante
        const typedValue = typingTextarea ? typingTextarea.value || "" : "";
        let currentCorrectCount = 0;
        for (let i = 0; i < typedValue.length; i++) {
            const phrase = gameState.currentPhrase || "";
            if (typedValue[i] === phrase[i]) {
                currentCorrectCount++;
            }
        }
        const totalCorrect =
            (gameState.cumulativeCorrectChars || 0) + currentCorrectCount;
        const percent = totalChars > 0 ? (totalCorrect / totalChars) * 100 : 0;

        if (progressLabel) {
            progressLabel.textContent = `Phrase ${currentPhraseNum} / ${totalPhrases}`;
        }

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressBar.setAttribute("aria-valuenow", Math.round(percent));
            progressBar.setAttribute("aria-valuemax", "100");
        }
    }

    /**
     * Initialise ou réinitialise l'état du jeu.
     */
    function initGame() {
        gameState.status = "idle";

        // Réactiver le sélecteur de nombre de phrases et lire sa valeur AVANT de générer les phrases
        if (phraseCountInput) {
            phraseCountInput.disabled = false;
            // Relire la valeur courante pour que le jeu utilise bien le nombre sélectionné
            const v = Number(phraseCountInput.value);
            if (!isNaN(v) && v > 0) {
                gameState.totalPhrasesPerGame = Math.max(1, Math.min(20, v));
            }
        }

        // Préparer une file de phrases pour le round en utilisant la valeur mise à jour
        gameState.phrasesQueue = getRandomPhrases(gameState.totalPhrasesPerGame);
        gameState.currentPhraseIndex = 0;
        gameState.currentPhrase =
            gameState.phrasesQueue[gameState.currentPhraseIndex] || "";
        gameState.currentIndex = 0;
        gameState.startTime = null;
        gameState.elapsedSeconds = 0;
        gameState.errors = 0;
        gameState.incorrectPositions = new Set();
        gameState.correctChars = 0;
        gameState.cumulativeCorrectChars = 0;
        gameState.seenMistakes = new Set();

        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }

        if (statTimer) statTimer.classList.remove("js-active-time");

        displayPhrase(gameState.currentPhrase, "");

        // Mise à jour de l'UI de progression
        updateProgressUI();

        if (typingTextarea) {
            typingTextarea.value = "";
            typingTextarea.disabled = true;
            // Retirer la classe active pour revenir à l'état initial (shimmer/transparent)
            typingTextarea.classList.remove("typing-game__textarea--active");
        }

        if (gameArea) gameArea.style.display = "block";
        if (resultsScreen) resultsScreen.style.display = "none";

        if (timerDisplay) timerDisplay.textContent = "0s";
        if (wpmDisplay) wpmDisplay.textContent = "0";
        if (accuracyDisplay) accuracyDisplay.textContent = "100%";

        if (btnStart) btnStart.disabled = false;
        if (btnReset) btnReset.disabled = true;
    }

    /**
     * Démarre une nouvelle session de jeu.
     */
    function startGame() {
        // Toujours réinitialiser le jeu avant de démarrer pour prendre en compte
        // les changements du sélecteur de nombre de phrases
        initGame();
        
        // Maintenant démarrer la partie
        gameState.status = "playing";

        if (typingTextarea) {
            typingTextarea.disabled = false;
            typingTextarea.focus();
            // Ajouter la classe pour rendre le texte visible (annule l'effet shimmer/transparent)
            typingTextarea.classList.add("typing-game__textarea--active");
        }

        if (btnStart) btnStart.disabled = true;
        if (btnReset) btnReset.disabled = false;
        // verrouiller la sélection de nombre de phrases pendant la partie
        if (phraseCountInput) phraseCountInput.disabled = true;
    }

    /**
     * Termine la session de jeu et affiche l'écran de résultats.
     */
    function endGame() {
        gameState.status = "finished";

        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }

        if (statTimer) statTimer.classList.remove("js-active-time");

        if (typingTextarea) typingTextarea.disabled = true;

        // calculer les stats finales
        const finalWpm = calcWPM(gameState.correctChars, gameState.elapsedSeconds);
        const finalAccuracy = calcAccuracy(
            gameState.correctChars,
            gameState.errors
        );

        // afficher l'écran de résultats
        if (gameArea) gameArea.style.display = "none";
        if (resultsScreen) resultsScreen.style.display = "block";

        if (resultTime) resultTime.textContent = `${gameState.elapsedSeconds}s`;
        if (resultWpm) resultWpm.textContent = finalWpm;
        if (resultAccuracy) resultAccuracy.textContent = `${finalAccuracy}%`;
        if (resultErrors) resultErrors.textContent = gameState.errors;

        // focus sur le bouton rejouer pour accessibilité
        if (btnPlayAgain) btnPlayAgain.focus();
        if (phraseCountInput) phraseCountInput.disabled = false;
    }

    /**
     * Gère la saisie utilisateur : vérifie le caractère tapé, met à jour l'index,
     * gère les erreurs et termine la partie quand la phrase est complète.
     * @param {TextareaEvent} e
     */
    function handleTextarea(/*TextareaEvent*/ e) {
        if (gameState.status !== "playing") return;
        if (!typingTextarea) return;

        let typedValue = typingTextarea.value || "";
        const phrase = gameState.currentPhrase || "";

        // empêcher de taper au-delà de la phrase (troncature)
        if (typedValue.length > phrase.length) {
            typedValue = typedValue.slice(0, phrase.length);
            typingTextarea.value = typedValue;
        }

        // démarrer le timer au premier caractère
        if (!gameState.startTime && typedValue.length > 0) startTimer();

        // reconstruire l'ensemble des positions incorrectes pour l'affichage courant
        const currentIncorrect = new Set();
        let currentCorrectCount = 0;

        for (let i = 0; i < typedValue.length; i++) {
            const typedChar = typedValue[i];
            const expectedChar = phrase[i];
            if (typedChar !== expectedChar) {
                currentIncorrect.add(i);
                const key = `${gameState.currentPhraseIndex}-${i}`;
                if (!gameState.seenMistakes.has(key)) {
                    gameState.errors++;
                    gameState.seenMistakes.add(key);
                }
            } else {
                currentCorrectCount++;
            }
        }

        // mettre à jour l'état pour l'affichage et les stats
        gameState.incorrectPositions = currentIncorrect;
        gameState.currentIndex = typedValue.length;
        gameState.correctChars =
            (gameState.cumulativeCorrectChars || 0) + currentCorrectCount;

        // Si la saisie correspond exactement à la phrase → phrase terminée
        if (typedValue === phrase) {
            // on ajoute les caractères validés au cumul
            gameState.cumulativeCorrectChars += phrase.length;

            // préparer la phrase suivante
            if (gameState.currentPhraseIndex < gameState.phrasesQueue.length - 1) {
                gameState.currentPhraseIndex++;
                gameState.currentPhrase =
                    gameState.phrasesQueue[gameState.currentPhraseIndex];
                typingTextarea.value = "";
                gameState.incorrectPositions = new Set();
                gameState.currentIndex = 0;
                displayPhrase(gameState.currentPhrase, "");
                updateStats();
                // Mise à jour de la progression
                updateProgressUI();
                return;
            } else {
                // dernière phrase validée → mettre à jour la progression à 100% avant de terminer
                updateStats();
                updateProgressUI();
                endGame();
                return;
            }
        }

        // sinon mise à jour de l'affichage courant
        displayPhrase(gameState.currentPhrase, typedValue);
        updateStats();
        // Mise à jour de la progression en temps réel pendant la frappe
        updateProgressUI();
    }

    // --- Event Listeners ---

    if (btnStart) {
        btnStart.addEventListener("click", startGame);
    }

    if (btnReset) {
        btnReset.addEventListener("click", initGame);
    }

    if (btnPlayAgain) {
        btnPlayAgain.addEventListener("click", initGame);
    }

    if (typingTextarea) {
        // utiliser 'input' pour capturer chaque caractère tapé
        typingTextarea.addEventListener("input", handleTextarea);

        // empêcher copier/coller pour préserver l'intégrité du jeu
        typingTextarea.addEventListener("paste", (e) => e.preventDefault());
    }

    // Écouter les changements du sélecteur de nombre de phrases
    if (phraseCountInput) {
        phraseCountInput.addEventListener("input", () => {
            // lire la valeur saisie et la borner
            const v = Number(phraseCountInput.value) || gameState.totalPhrasesPerGame;
            gameState.totalPhrasesPerGame = Math.max(1, Math.min(20, v));
            // mettre à jour l'UI de progression immédiatement
            updateProgressUI();
        });
    }

    // --- Initialisation ---
    initGame();
});
