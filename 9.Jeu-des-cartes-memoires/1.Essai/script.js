const fruits = ["brocoli", "cherry", "pepper", "strawberry", "apple", "banana"];

// ===========================
// GESTION NAVIGATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
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
        toggle.addEventListener('click', function(e) {
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
            dropdownMenu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    // Fermer les dropdowns en cliquant ailleurs ou sur l'overlay mobile
    document.addEventListener('click', function(e) {
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
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
    
    // ===========================
    // ICI VOUS POUVEZ AJOUTER LE CODE SPÉCIFIQUE
    // ===========================
    const fruits = ["brocoli", "cherry", "pepper", "strawberry", "apple", "banana"];
    const fruitsList = document.querySelector(".memory-game__grid");    

    function createNewShuffledCards(fruitsArray){

        const duplicatedFruits = fruitsArray.flatMap(fruit => [fruit, fruit])

        for(let i = duplicatedFruits.length - 1; i > 0; i--){
            const randomIndex = Math.floor(Math.random() * (i + 1))

            const savedTemp = duplicatedFruits[i]
            duplicatedFruits[i] = duplicatedFruits[randomIndex]
            duplicatedFruits[randomIndex] = savedTemp 
        }

        console.log(duplicatedFruits)

        createCards(duplicatedFruits)
    }
    createNewShuffledCards(fruits)

    function createCards(randomFruitsArray){

        const fragment = document.createDocumentFragment()

        randomFruitsArray.forEach(fruit => {
            const li = document.createElement("li")
            li.className = "memory-game__card"
            li.setAttribute("data-fruit", fruit)

            li.innerHTML = `
            <div class="memory-game__double-face">
                <div class="memory-game__face">
                <img src="" alt="" class="memory-game__card-img">
                </div>
                <div class="memory-game__back">
                <img src="ressources/question.svg" alt="" class="memory-game__card-img">
                </div>
            </div>
            `
            const liImg = li.querySelector(".memory-game__card-img")
            liImg.src = `ressources/${fruit}.svg`
            liImg.alt = fruit 
            fragment.appendChild(li)

        })
        fruitsList.textContent = ""
        fruitsList.appendChild(fragment)
    }

    const advice = document.querySelector(".memory-game__advice");
    const score = document.querySelector(".memory-game__score");

    let lockedCards = false;
    let cardsPicked = [];
    let numberOfTries = 0;

    window.addEventListener("keydown", handleReset);

    function handleReset(e){
        if(e.code === "Space") {
            e.preventDefault()

            advice.textContent = "Appuyer sur barre d'espace pour reset le jeu."
            score.textContent = "Nombre d'essais : 0"
            numberOfTries = 0
            createNewShuffledCards(fruits)
            lockedCards = false 
            cardsPicked = []
        }
    }

    // event delegation
    fruitsList.addEventListener("click", flipACard)

    function flipACard(e){
        if(lockedCards || e.target === fruitsList) return

        const clickedCard = e.target.closest(".memory-game__card")

        clickedCard.classList.add("js-card-locked")

        const doubleFaceContainer = clickedCard.querySelector(".memory-game__double-face")

        doubleFaceContainer.classList.add("js-double-face-active")

        cardsPicked.push({el: clickedCard, value: clickedCard.getAttribute("data-fruit")})

        if(cardsPicked.length === 2) {
            saveNumberOfTries()

            checkCards()
        }
    }

    function saveNumberOfTries(){
        numberOfTries++
        score.textContent = `Nombre d'essais : ${numberOfTries}`
    }

    function checkCards(){
        if(cardsPicked[0].value === cardsPicked[1].value){
            cardsPicked = []
            checkGameCompletion()
            return
        }

        lockedCards = true 
        setTimeout(() => {
            cardsPicked.forEach(card => {
            card.el.querySelector(".memory-game__double-face").classList.remove("js-double-face-active")
            card.el.classList.remove("js-card-locked")
            })
            cardsPicked = []
            lockedCards = false
        }, 1000)
    }

    function checkGameCompletion(){
        const innerDoubleFaceContainers = [...document.querySelectorAll(".memory-game__double-face")]
        const checkForEnd = innerDoubleFaceContainers.filter(card => !card.classList.contains("js-double-face-active"))

        if(!checkForEnd.length) {
            advice.textContent = `Bravo ! Appuie sur "Espace" pour recommencer.`
            score.textContent = `Score final : ${numberOfTries}`
        } 
    }
});