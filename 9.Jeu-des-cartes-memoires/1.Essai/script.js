const fruits = ["brocoli", "cherry", "pepper", "strawberry", "apple", "banana"];

// ===========================
// GESTION NAVIGATION
// ===========================

document.addEventListener('DOMContentLoaded', function () {

    // ===========================
    // GESTION DU MENU BURGER
    // ===========================
    const burger = document.getElementById('burger-menu');
    const navUl = document.querySelector('#nav-menu');

    if (burger && navUl) {
        // Au clic sur le burger, ouvrir/fermer le menu
        burger.addEventListener('click', () => {
            navUl.classList.toggle('open');
            burger.src = navUl.classList.contains('open')
                ? './assets/close.png'
                : './assets/burger.png';
        });

        // Ferme le menu si on repasse en mode desktop lors d'un redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 820) {
                navUl.classList.remove('open');
                burger.src = './assets/burger.png';
            }
        });

        // Fermer le menu quand on clique sur un lien en mode mobile
        // Sélectionner tous les liens sauf les dropdown-toggle
        const navLinks = navUl.querySelectorAll('a:not(.dropdown-toggle)');
        // Ajouter aussi tous les liens dans les dropdown-menu
        const dropdownLinks = navUl.querySelectorAll('.dropdown-menu a');

        // Combiner tous les liens
        const allLinks = [...navLinks, ...dropdownLinks];

        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 820) {
                    navUl.classList.remove('open');
                    burger.src = './assets/burger.png';
                }
            });
        });
    } else {
        console.error("L'élément burger ou nav n'a pas été trouvé");
    }

    // ===========================
    // GESTION DES DROPDOWNS
    // ===========================
    const dropdowns = document.querySelectorAll('.dropdown');

    // Fonction pour fermer tous les dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    // Gestion des événements pour chaque dropdown
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        // Gestion du clic sur le bouton toggle
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Si ce dropdown est déjà actif, le fermer
            if (dropdown.classList.contains('active')) {
                closeAllDropdowns();
                return;
            }

            // Fermer tous les autres dropdowns
            closeAllDropdowns();

            // Activer ce dropdown
            dropdown.classList.add('active');
        });

        // Empêcher la fermeture quand on clique à l'intérieur du dropdown
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    });

    // Fermer les dropdowns en cliquant ailleurs ou sur l'overlay mobile
    document.addEventListener('click', function (e) {
        // Si on clique sur l'overlay mobile (::before pseudo-element)
        const activeDropdown = document.querySelector('.dropdown.active');
        if (activeDropdown && window.innerWidth <= 820) {
            const dropdownMenu = activeDropdown.querySelector('.dropdown-menu');
            if (dropdownMenu && !dropdownMenu.contains(e.target) && !e.target.closest('.dropdown-toggle')) {
                closeAllDropdowns();
            }
        } else if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });

    // ===========================
    // JEU DES CARTES MÉMOIRE
    // ===========================
    
    // ===========================
    // CONFIGURATION ET VARIABLES GLOBALES
    // ===========================
    const fruits = ["brocoli", "cherry", "pepper", "strawberry", "apple", "banana"];
    const fruitsList = document.querySelector(".memory-game__grid")

    // Variables de jeu
    const advice = document.querySelector(".memory-game__advice")
    const score = document.querySelector(".memory-game__score")

    let lockedCards = false
    let cardsPicked = []
    let numberOfTries = 0

    // ===========================
    // GÉNÉRATION ET MÉLANGE DES CARTES
    // ===========================
    
    /**
     * Crée un nouveau jeu avec des cartes mélangées
     * @param {string[]} fruitsArray - Tableau des noms de fruits
     */
    function createNewShuffledCards(fruitsArray) {
        // Dupliquer chaque fruit pour créer des paires
        const duplicatedFruits = fruitsArray.flatMap(fruit => [fruit, fruit])

        // Algorithme de mélange Fisher-Yates
        for (let i = duplicatedFruits.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1))

            const savedTemp = duplicatedFruits[i]
            duplicatedFruits[i] = duplicatedFruits[randomIndex]
            duplicatedFruits[randomIndex] = savedTemp
        }

        createCards(duplicatedFruits)
    }

    /**
     * Crée et affiche les cartes dans le DOM
     * @param {string[]} randomFruitsArray - Tableau des fruits mélangés
     */
    function createCards(randomFruitsArray) {
        // Utilisation d'un fragment pour optimiser les performances
        const fragment = document.createDocumentFragment()

        randomFruitsArray.forEach(fruit => {
            const li = document.createElement("li")
            li.className = "memory-game__card"
            li.setAttribute("data-fruit", fruit)

            // Structure HTML de la carte avec système 3D
            li.innerHTML = `
                <div class="memory-game__double-face">
                    <div class="memory-game__face">
                        <img src="ressources/${fruit}.svg" alt="${fruit}" class="memory-game__card-img">
                    </div>
                    <div class="memory-game__back">
                        <img src="ressources/question.svg" alt="" class="memory-game__card-img">
                    </div>
                </div>
            `
            fragment.appendChild(li)
        })
        
        // Remplacement du contenu de la grille
        fruitsList.textContent = ""
        fruitsList.appendChild(fragment)
    }

    // ===========================
    // GESTION DES ÉVÉNEMENTS DE JEU
    // ===========================
    
    /**
     * Gère la réinitialisation du jeu avec la barre d'espace
     * @param {KeyboardEvent} e - Événement clavier
     */
    function handleReset(e) {
        if (e.code === "Space") {
            e.preventDefault()

            // Réinitialisation de l'interface
            advice.textContent = "Appuyer sur barre d'espace pour reset le jeu."
            score.textContent = "Nombre d'essais : 0"
            
            // Réinitialisation des variables de jeu
            numberOfTries = 0
            createNewShuffledCards(fruits)
            lockedCards = false
            cardsPicked = []
        }
    }

    /**
     * Gère le retournement d'une carte au clic
     * @param {Event} e - Événement de clic
     */
    function flipACard(e) {
        // Vérifications de sécurité
        if (lockedCards || e.target === fruitsList) return

        const clickedCard = e.target.closest(".memory-game__card")

        // Verrouillage de la carte cliquée
        clickedCard.classList.add("js-card-locked")

        // Activation de l'effet 3D (retournement)
        const doubleFaceContainer = clickedCard.querySelector(".memory-game__double-face")
        doubleFaceContainer.classList.add("js-double-face-active")

        // Ajout de la carte aux cartes sélectionnées
        cardsPicked.push({ el: clickedCard, value: clickedCard.getAttribute("data-fruit") })

        // Vérification si deux cartes sont retournées
        if (cardsPicked.length === 2) {
            saveNumberOfTries()
            checkCards()
        }
    }

    // ===========================
    // LOGIQUE DE JEU
    // ===========================
    
    /**
     * Incrémente et affiche le nombre d'essais
     */
    function saveNumberOfTries() {
        numberOfTries++
        score.textContent = `Nombre d'essais : ${numberOfTries}`
    }

    /**
     * Vérifie si les deux cartes retournées forment une paire
     */
    function checkCards() {
        // Si les cartes correspondent (paire trouvée)
        if (cardsPicked[0].value === cardsPicked[1].value) {
            // 🎉 ANIMATION DE SUCCÈS pour les paires trouvées
            cardsPicked.forEach(card => {
                card.el.classList.add("js-card-success")
            })
            
            // Réinitialisation après l'animation de succès
            setTimeout(() => {
                cardsPicked.forEach(card => {
                    card.el.classList.remove("js-card-success")
                })
                cardsPicked = []
                checkGameCompletion()
            }, 600) // Délai correspondant à la durée de l'animation (0.6s)
            
            return
        }

        // Si les cartes ne correspondent pas
        lockedCards = true
        setTimeout(() => {
            // Retournement des cartes non appariées
            cardsPicked.forEach(card => {
                card.el.querySelector(".memory-game__double-face").classList.remove("js-double-face-active")
                card.el.classList.remove("js-card-locked")
            })
            // Réinitialisation pour le prochain tour
            cardsPicked = []
            lockedCards = false
        }, 1000)
    }

    /**
     * Vérifie si le jeu est terminé (toutes les paires trouvées)
     */
    function checkGameCompletion() {
        const innerDoubleFaceContainers = [...document.querySelectorAll(".memory-game__double-face")]
        const checkForEnd = innerDoubleFaceContainers.filter(card => !card.classList.contains("js-double-face-active"))

        // Si toutes les cartes sont retournées (jeu terminé)
        if (!checkForEnd.length) {
            advice.textContent = `Bravo ! Appuie sur "Espace" pour recommencer.`
            score.textContent = `Score final : ${numberOfTries}`
        }
    }

    // ===========================
    // INITIALISATION DU JEU
    // ===========================
    
    // Création initiale des cartes
    createNewShuffledCards(fruits)

    // Écouteurs d'événements
    window.addEventListener("keydown", handleReset)
    fruitsList.addEventListener("click", flipACard) // Délégation d'événements
});