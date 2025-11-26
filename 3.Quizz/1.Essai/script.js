import quizData from "./quizData.js";
console.log(quizData)

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

    // Ajout du contenu du quiz
    const form = document.querySelector('.quiz__form')
    const formSubmitBtn = document.querySelector('.quiz__submit-button')
    
    function addQuizContent(questions) {

        const fragment = document.createDocumentFragment()
    
        questions.forEach(currentQuestion => {

            const questionBlock = document.createElement("div")
            questionBlock.className = "quiz__question-block"
            questionBlock.id = currentQuestion.id
    
            const questionText = document.createElement("p")
            questionText.className = "quiz__question"
            questionText.textContent = currentQuestion.question
            questionBlock.appendChild(questionText)
    
            currentQuestion.options.forEach((option, index) => {
                const inputGroup = document.createElement("div")
                inputGroup.className = "quiz__input-group"
    
                const radioInput = document.createElement("input")
                radioInput.type = "radio"
                radioInput.className = "quiz__radio-input"
                radioInput.id = `${currentQuestion.id}-${option.value}`
                radioInput.name = currentQuestion.id
                radioInput.value = option.value
                radioInput.checked = index === 0
    
                const label = document.createElement("label")
                label.className = "quiz__label"
                label.htmlFor = radioInput.id
                label.textContent = option.label
    
                inputGroup.appendChild(radioInput)
                inputGroup.appendChild(label)
                questionBlock.appendChild(inputGroup)
            })
    
            fragment.appendChild(questionBlock)
        })
    
        form.insertBefore(fragment, formSubmitBtn)        
    }
    addQuizContent(quizData.questions)

    form.addEventListener('submit', handleSubmit)

    function handleSubmit(e) {
        e.preventDefault()
        getResult()
    }

    function getResult() {
        const checkedRadioButtons = [...document.querySelectorAll('input[type="radio"]:checked')]
        console.log(checkedRadioButtons)

        const results = checkedRadioButtons.map(radioButton => {
            const response = quizData.responses.find(response => response.id === radioButton.name)

            return { id: radioButton.name, correct: response.answer === radioButton.value }
        })
        console.log(results)
        showResults(results)
        addColors(results)
    }

    const quizResultsBox = document.querySelector('.quiz__results')
    const quizDescription = document.querySelector('.quiz__description')

    let isResultsBoxShowed = false
    function showResults(results) {
        if (isResultsBoxShowed) {
            quizResultsBox.style.display = 'block'
            isResultsBoxShowed = true;
        }

        const goodResponses = results.filter(response => response.correct === true)
        const hasFinishedQuiz = goodResponses.length === quizData.responses.length
        
        if(!hasFinishedQuiz) {
            quizDescription.textContent = `Résultat  : ${goodResponses.length}/${quizData.questions.length}, retentez votre chance.`
        } else {
            quizDescription.textContent = `Bravo  : ${goodResponses.length}/${quizData.questions.length}. 🏆`
            
        }
    }
    
    function addColors(results) {
        results.forEach(response => {
            document.getElementById(response.id).style.outline = response.correct ? "3px solid #3da406" : "3px solid #ff6565"
        })
    }


    form.addEventListener("input", resetQuestionHighlight)

    function resetQuestionHighlight(e){
        if(e.target.matches(".quiz__radio-input")) {
            const block = document.getElementById(e.target.name)
            if(block) block.style.outline = "none"
        }
    }
})