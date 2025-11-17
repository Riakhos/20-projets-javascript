// ===========================
// IMPORTATION DES DONNÉES
// ===========================
import quizData from "./quizData.js";
console.log("Données du quiz chargées:", quizData);

// ===========================
// INITIALISATION DE L'APPLICATION
// ===========================
document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // ÉLÉMENTS DOM - NAVIGATION
    // ===========================
    const burger = document.getElementById("burger-menu");
    const navUl = document.querySelector("#nav-menu");
    const dropdowns = document.querySelectorAll(".dropdown");

    // ===========================
    // ÉLÉMENTS DOM - QUIZ
    // ===========================
    const form = document.querySelector(".quiz__form");
    const formSubmitBtn = document.querySelector(".quiz__submit-button");
    const quizResultsBox = document.querySelector(".quiz__results");
    const quizDescription = document.querySelector(".quiz__description");

    // ===========================
    // VARIABLES D'ÉTAT
    // ===========================
    let isResultsBoxShowed = false;

    // ===========================
    // GESTION DU MENU BURGER
    // ===========================
    if (burger && navUl) {
        // Basculer l'ouverture/fermeture du menu au clic sur le burger
        burger.addEventListener("click", () => {
            navUl.classList.toggle("open");
            // Changer l'icône selon l'état du menu
            burger.src = navUl.classList.contains("open")
                ? "./assets/close.png"
                : "./assets/burger.png";
        });

        // Fermer le menu lors du redimensionnement vers desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                navUl.classList.remove("open");
                burger.src = "./assets/burger.png";
            }
        });

        // Configuration de la fermeture automatique en mode mobile
        setupMobileMenuAutoClose();
    } else {
        console.error("❌ L'élément burger ou nav n'a pas été trouvé");
    }

    // ===========================
    // FONCTIONS UTILITAIRES - NAVIGATION
    // ===========================

    /**
        * Configure la fermeture automatique du menu mobile
    * lors du clic sur un lien de navigation
    */
    function setupMobileMenuAutoClose() {
        // Sélectionner tous les liens de navigation
        const navLinks = navUl.querySelectorAll("a:not(.dropdown-toggle)");
        const dropdownLinks = navUl.querySelectorAll(".dropdown-menu a");
        const allLinks = [...navLinks, ...dropdownLinks];

        // Ajouter l'événement de fermeture à chaque lien
        allLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 820) {
                    navUl.classList.remove("open");
                    burger.src = "./assets/burger.png";
                }
            });
        });
    }

    /**
        * Ferme tous les dropdowns actifs
    */
    function closeAllDropdowns() {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("active");
        });
    }

    // ===========================
    // GESTION DES DROPDOWNS
    // ===========================

    // Configuration des événements pour chaque dropdown
    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        // Gestion du clic sur le bouton toggle
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Basculer l'état du dropdown actuel
            if (dropdown.classList.contains("active")) {
                closeAllDropdowns();
                return;
            }

            // Fermer les autres dropdowns et activer celui-ci
            closeAllDropdowns();
            dropdown.classList.add("active");
        });

        // Empêcher la fermeture lors du clic à l'intérieur du dropdown
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        if (dropdownMenu) {
            dropdownMenu.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }
    });

    // ===========================
    // GESTION DES ÉVÉNEMENTS GLOBAUX - DROPDOWNS
    // ===========================

    // Fermer les dropdowns lors du clic à l'extérieur
    document.addEventListener("click", function (e) {
        const activeDropdown = document.querySelector(".dropdown.active");

        if (activeDropdown && window.innerWidth <= 820) {
            // Gestion spéciale pour mobile avec overlay
            const dropdownMenu = activeDropdown.querySelector(".dropdown-menu");
            if (
                dropdownMenu &&
                !dropdownMenu.contains(e.target) &&
                !e.target.closest(".dropdown-toggle")
            ) {
                closeAllDropdowns();
            }
        } else if (!e.target.closest(".dropdown")) {
            // Fermeture standard pour desktop
            closeAllDropdowns();
        }
    });

    // Fermer les dropdowns avec la touche Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });

    // ===========================
    // CONSTRUCTION DYNAMIQUE DU QUIZ
    // ===========================

    /**
        * Génère dynamiquement le contenu du quiz à partir des données
        * @param {Array} questions - Tableau des questions du quiz
    */
    function addQuizContent(questions) {
        // Utiliser DocumentFragment pour optimiser les performances DOM
        const fragment = document.createDocumentFragment();

        questions.forEach((currentQuestion) => {
            // Créer le conteneur principal de la question
            const questionBlock = createQuestionBlock(currentQuestion);

            // Ajouter le texte de la question
            const questionText = createQuestionText(currentQuestion.question);
            questionBlock.appendChild(questionText);

            // Créer et ajouter toutes les options de réponse
            currentQuestion.options.forEach((option, index) => {
                const inputGroup = createOptionGroup(currentQuestion, option, index);
                questionBlock.appendChild(inputGroup);
            });

            fragment.appendChild(questionBlock);
        });

        // Insérer le contenu généré dans le formulaire
        form.insertBefore(fragment, formSubmitBtn);
    }

    /**
        * Crée le conteneur principal d'une question
        * @param {Object} question - Objet question
        * @returns {HTMLElement} - Élément div de la question
    */
    function createQuestionBlock(question) {
        const questionBlock = document.createElement("div");
        questionBlock.className = "quiz__question-block";
        questionBlock.id = question.id;
        return questionBlock;
    }

    /**
        * Crée l'élément texte de la question
        * @param {string} questionText - Texte de la question
        * @returns {HTMLElement} - Élément p de la question
    */
    function createQuestionText(questionText) {
        const questionElement = document.createElement("p");
        questionElement.className = "quiz__question";
        questionElement.textContent = questionText;
        return questionElement;
    }

    /**
        * Crée un groupe d'option (radio + label)
        * @param {Object} question - Objet question
        * @param {Object} option - Objet option
        * @param {number} index - Index de l'option
        * @returns {HTMLElement} - Groupe d'input
    */
    function createOptionGroup(question, option, index) {
        const inputGroup = document.createElement("div");
        inputGroup.className = "quiz__input-group";

        // Créer l'input radio
        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.className = "quiz__radio-input";
        radioInput.id = `${question.id}-${option.value}`;
        radioInput.name = question.id;
        radioInput.value = option.value;
        radioInput.checked = index === 0; // Première option sélectionnée par défaut

        // Créer le label associé
        const label = document.createElement("label");
        label.className = "quiz__label";
        label.htmlFor = radioInput.id;
        label.textContent = option.label;

        // Assembler le groupe
        inputGroup.appendChild(radioInput);
        inputGroup.appendChild(label);

        return inputGroup;
    }

    // ===========================
    // GESTION DE LA SOUMISSION DU QUIZ
    // ===========================

    /**
        * Gère la soumission du formulaire quiz
        * @param {Event} e - Événement de soumission
    */
    function handleSubmit(e) {
        e.preventDefault();
        console.log("🎯 Soumission du quiz...");
        getResult();
    }

    /**
        * Analyse les résultats du quiz et met à jour l'interface
    */
    function getResult() {
        // Récupérer toutes les réponses sélectionnées
        const checkedRadioButtons = [
            ...document.querySelectorAll('input[type="radio"]:checked'),
        ];
        console.log("📝 Réponses sélectionnées:", checkedRadioButtons);

        // Analyser chaque réponse pour déterminer si elle est correcte
        const results = checkedRadioButtons.map((radioButton) => {
            const response = quizData.responses.find(
                (response) => response.id === radioButton.name
            );

            return {
                id: radioButton.name,
                correct: response ? response.answer === radioButton.value : false,
            };
        });

        console.log("📊 Analyse des résultats:", results);

        // Mettre à jour l'interface avec les résultats
        showResults(results);
        addColors(results);
    }

    // ===========================
    // AFFICHAGE DES RÉSULTATS
    // ===========================

    /**
        * Affiche les résultats du quiz et calcule le score
        * @param {Array} results - Tableau des résultats analysés
    */
    function showResults(results) {
        // Afficher la boîte de résultats si ce n'est pas déjà fait
        if (!isResultsBoxShowed) {
            quizResultsBox.style.display = "block";
            isResultsBoxShowed = true;
            console.log("📋 Affichage de la boîte de résultats");
        }

        // Calculer le score final
        const goodResponses = results.filter(
            (response) => response.correct === true
        );
        const totalQuestions = quizData.questions.length;
        const score = goodResponses.length;
        const hasFinishedQuiz = score === quizData.responses.length;

        // Mettre à jour le message selon le score
        if (!hasFinishedQuiz) {
            quizDescription.textContent = `📊 Résultat : ${score}/${totalQuestions}, retentez votre chance !`;
            console.log(`❌ Score partiel : ${score}/${totalQuestions}`);
        } else {
            quizDescription.textContent = `🏆 Bravo : ${score}/${totalQuestions}. Parfait !`;
            console.log(`✅ Quiz réussi : ${score}/${totalQuestions}`);
        }
    }

    // ===========================
    // INDICATION VISUELLE DES RÉPONSES
    // ===========================
    /**
        * Applique une coloration visuelle aux questions selon les résultats
        * @param {Array} results - Tableau des résultats
    */
    function addColors(results) {
        results.forEach((response) => {
            const questionBlock = document.getElementById(response.id);
            if (questionBlock) {
                const questionText = questionBlock.querySelector(".quiz__question")
                const inputGroups = questionBlock.querySelectorAll(".quiz__input-group")

                if (response.correct) {
                    // Style pour les réponses correctes (vert)
                    questionBlock.style.outline = "3px solid #3da406"
                    questionBlock.style.boxShadow = "0 0 20px rgba(61, 164, 6, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2)"

                    // Changer la couleur du texte de la question en vert
                    if (questionText) {
                        questionText.style.color = "#3da406"
                        questionText.style.textShadow = "0 0 10px rgba(61, 164, 6, 0.3)"
                    }

                    // Appliquer le style vert aux groupes d'options
                    inputGroups.forEach((group) => {
                        const label = group.querySelector(".quiz__label")
                        if (label) {
                            label.style.color = "#3da406"
                            label.style.textShadow = "0 0 8px rgba(61, 164, 6, 0.2)"
                        }
                    })
                } else {
                    // Style pour les réponses incorrectes (rouge)
                    questionBlock.style.outline = "3px solid #ff6565"
                    questionBlock.style.boxShadow = "0 0 20px rgba(255, 101, 101, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2)"

                    // Changer la couleur du texte de la question en rouge
                    if (questionText) {
                        questionText.style.color = "#ff6565"
                        questionText.style.textShadow = "0 0 10px rgba(255, 101, 101, 0.3)"
                    }

                    // Appliquer le style rouge aux groupes d'options
                    inputGroups.forEach((group) => {
                        const label = group.querySelector(".quiz__label")
                        if (label) {
                            label.style.color = "#ff6565"
                            label.style.textShadow = "0 0 8px rgba(255, 101, 101, 0.2)"
                        }
                    })
                }
            }
        })
        console.log("🎨 Coloration des questions, textes et options appliquée avec ombres")
    }

    /**
        * Réinitialise la surbrillance d'une question lors du changement de réponse
        * @param {Event} e - Événement input
    */
    function resetQuestionHighlight(e) {
        if (e.target.matches(".quiz__radio-input")) {
            const block = document.getElementById(e.target.name)
            if (block) {
                // Réinitialiser le style du bloc principal
                block.style.outline = "none"
                block.style.boxShadow = ""

                // Réinitialiser le style du texte de la question
                const questionText = block.querySelector(".quiz__question")
                if (questionText) {
                    questionText.style.color = ""
                    questionText.style.textShadow = ""
                }

                // Réinitialiser le style des groupes d'options
                const inputGroups = block.querySelectorAll(".quiz__input-group")
                inputGroups.forEach((group) => {
                    const label = group.querySelector(".quiz__label")
                    if (label) {
                        label.style.color = ""
                        label.style.textShadow = ""
                    }
                })

                console.log(`🔄 Reset complet des styles pour la question: ${e.target.name}`)
            }
        }
    }

    // ===========================
    // INITIALISATION DU QUIZ
    // ===========================

    console.log("🚀 Initialisation du quiz...");

    // Construire le contenu du quiz à partir des données
    addQuizContent(quizData.questions);
    console.log(`📚 ${quizData.questions.length} questions générées`);

    // Configurer les événements du formulaire
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("input", resetQuestionHighlight);

    console.log("✅ Quiz prêt à être utilisé !");
});
