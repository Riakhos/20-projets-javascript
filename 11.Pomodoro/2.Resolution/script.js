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
    // GESTION DES ANIMATIONS
    // ===========================
    
    // Animation shimmer pour les éléments avec dégradés
    function initShimmerAnimations() {
        const shimmerElements = document.querySelectorAll([
            '.pomodoro__title',
            '.pomodoro__title--style', 
            '.pomodoro__info-text',
            '.pomodoro__description',
            '.pomodoro__worktime',
            '.pomodoro__resttime',
            '.pomodoro__cycles-text',
            '.pomodoro__cycles'
        ].join(','));
        
        shimmerElements.forEach(element => {
            // Appliquer le style shimmer dynamiquement
            element.style.background = 'linear-gradient(90deg, #f7df1e, #ffa500, #f7df1e)';
            element.style.backgroundSize = '200% 100%';
            element.style.animation = 'shimmer 3s ease-in-out infinite';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.webkitTextFillColor = 'transparent';
        });
    }
    
    // Animations d'entrée au chargement de la page
    function initLoadAnimations() {
        const animatedElements = [
            { selector: '.pomodoro__header', delay: 0 },
            { selector: '.pomodoro__info', delay: 200 },
            { selector: '.pomodoro__features', delay: 400 },
            { selector: '.pomodoro__cycles', delay: 600 }
        ];
        
        animatedElements.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }

    // ===========================
    // VARIABLES GLOBALES POMODORO
    // ===========================
    
    let currentTime = 0; // Temps actuel en secondes
    let isRunning = false; // État du timer
    let currentMode = 'work'; // Mode actuel : 'work' ou 'break'
    let cycleCount = 0; // Nombre de cycles terminés
    let timerInterval = null; // Référence de l'intervalle
    
    // Configuration des temps (en secondes)
    const WORK_TIME = 30 * 60; // 30 minutes
    const BREAK_TIME = 5 * 60; // 5 minutes
    const LONG_BREAK_TIME = 15 * 60; // 15 minutes après 4 cycles

    // ===========================
    // SÉLECTION DES ÉLÉMENTS DOM
    // ===========================
    
    const toggleBtn = document.querySelector('.js-pomodoro-toggle-btn');
    const resetBtn = document.querySelector('.js-reset-btn');
    const workTimeDisplay = document.querySelector('.pomodoro__worktime');
    const restTimeDisplay = document.querySelector('.pomodoro__resttime');
    const cyclesDisplay = document.querySelector('.pomodoro__cycles');
    const workText = document.querySelector('.js-pomodoro-work-text');
    const restText = document.querySelector('.js-pomodoro-rest-text');
    const toggleImg = toggleBtn?.querySelector('.pomodoro__button-img');

    // ===========================
    // FONCTIONS UTILITAIRES
    // ===========================
    
    // Convertir les secondes en format MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Mettre à jour l'affichage du temps
    function updateDisplay() {
        if (currentMode === 'work') {
            workTimeDisplay.textContent = formatTime(currentTime);
        } else {
            restTimeDisplay.textContent = formatTime(currentTime);
        }
        
        // Mettre à jour le titre de la page
        document.title = `${formatTime(currentTime)} - Pomodoro ${currentMode === 'work' ? 'Travail' : 'Repos'}`;
    }
    
    // Mettre à jour l'affichage des cycles
    function updateCyclesDisplay() {
        cyclesDisplay.textContent = `Cycle(s) effectué(s) : ${cycleCount}`;
    }

    // ===========================
    // GESTION DU TIMER
    // ===========================
    
    // Démarrer le timer
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timerInterval = setInterval(() => {
                currentTime--;
                updateDisplay();
                
                if (currentTime <= 0) {
                    completeTimer();
                }
            }, 1000);
            
            // Changer l'icône en pause
            if (toggleImg) {
                toggleImg.src = 'ressources/pause.svg';
                toggleBtn.setAttribute('aria-label', 'Mettre en pause le Pomodoro');
                toggleBtn.setAttribute('data-toggle', 'pause');
            }
        }
    }
    
    // Mettre en pause le timer
    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            clearInterval(timerInterval);
            
            // Changer l'icône en play
            if (toggleImg) {
                toggleImg.src = 'ressources/play.svg';
                toggleBtn.setAttribute('aria-label', 'Reprendre le Pomodoro');
                toggleBtn.setAttribute('data-toggle', 'play');
            }
        }
    }
    
    // Terminer le timer actuel
    function completeTimer() {
        pauseTimer();
        
        if (currentMode === 'work') {
            cycleCount++;
            updateCyclesDisplay();
            
            // Déterminer le type de pause
            if (cycleCount % 4 === 0) {
                currentTime = LONG_BREAK_TIME;
                alert('🎉 Cycle terminé ! Prenez une longue pause de 15 minutes.');
            } else {
                currentTime = BREAK_TIME;
                alert('✅ Travail terminé ! Prenez une pause de 5 minutes.');
            }
            
            currentMode = 'break';
            workText.textContent = 'Travail';
            restText.textContent = 'Repos (En cours)';
        } else {
            currentTime = WORK_TIME;
            currentMode = 'work';
            alert('⏰ Pause terminée ! Retour au travail !');
            
            workText.textContent = 'Travail (En cours)';
            restText.textContent = 'Repos';
        }
        
        updateDisplay();
        
        // Option : redémarrer automatiquement
        startTimer();
    }

    // ===========================
    // RÉINITIALISATION
    // ===========================
    
    // Remettre à zéro le timer
    function resetTimer() {
        pauseTimer();
        currentMode = 'work';
        currentTime = WORK_TIME;
        cycleCount = 0;
        
        // Réinitialiser l'affichage
        workTimeDisplay.textContent = formatTime(WORK_TIME);
        restTimeDisplay.textContent = formatTime(BREAK_TIME);
        updateCyclesDisplay();
        
        // Réinitialiser les labels
        workText.textContent = 'Travail';
        restText.textContent = 'Repos';
        
        // Réinitialiser le titre
        document.title = 'Pomodoro App';
        
        updateDisplay();
    }

    // ===========================
    // NOTIFICATIONS ET SONS
    // ===========================
    
    // Demander la permission pour les notifications
    function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    // Envoyer une notification
    function sendNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: message,
                icon: 'ressources/icon.png' // Si vous avez une icône
            });
        }
    }

    // ===========================
    // ÉVÉNEMENTS ET INITIALISATION
    // ===========================
    
    // Initialiser l'application
    function initPomodoro() {
        // Initialiser les valeurs par défaut
        currentTime = WORK_TIME;
        updateDisplay();
        updateCyclesDisplay();
        
        // Demander les permissions
        requestNotificationPermission();
        
        // Initialiser les animations
        initShimmerAnimations();
        initLoadAnimations();
    }
    
    // Gestionnaires d'événements
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }
    
    // Gestion du raccourci clavier Espace pour play/pause
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        }
    });
    
    // Initialiser l'application Pomodoro
    initPomodoro();

});