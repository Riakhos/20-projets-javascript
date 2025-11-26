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
        // - Sélectionner les éléments avec background sombre
        const darkShimmerElements = document.querySelectorAll('.pomodoro__header,.pomodoro__info-block,.pomodoro__cycles-container');
        
        // - Sélectionner les éléments avec background doré
        const goldShimmerElements = document.querySelectorAll('.pomodoro,.pomodoro__title,.pomodoro__title--style,.pomodoro__info-text,.pomodoro__description,.pomodoro__worktime,.pomodoro__resttime,.pomodoro__cycles-text,.pomodoro__cycles');
        
        // - Appliquer les styles CSS pour les éléments sombres
        if (darkShimmerElements.length > 0) {
            darkShimmerElements.forEach(el => {
                el.style.background = 'linear-gradient(90deg, rgba(51, 51, 51, 0.9), #222)';
                el.style.backgroundSize = '200% 100%';
                el.style.animation = 'shimmer 3s ease-in-out infinite';
            });
        }
        
        // - Appliquer les styles CSS pour les éléments dorés
        if (goldShimmerElements.length > 0) {
            goldShimmerElements.forEach(el => {
                el.style.background = 'linear-gradient(90deg, #f7df1e, #ffa500, #f7df1e)';
                el.style.backgroundSize = '200% 100%';
                el.style.animation = 'shimmer 3s ease-in-out infinite';
                el.style.webkitBackgroundClip = 'text';
                el.style.backgroundClip = 'text';
                el.style.webkitTextFillColor = 'transparent';
            });
        }
    }
    
    // Animations d'entrée au chargement de la page
    // TODO: Créer fonction initLoadAnimations()
    // - Définir les éléments et leurs délais d'animation
    // - Appliquer opacity: 0 et translateY au début
    // - Animer vers opacity: 1 et translateY: 0 avec setTimeout

    // ===========================
    // VARIABLES GLOBALES POMODORO
    // ===========================
    
    // TODO: Déclarer les variables d'état
    // - currentTime (nombre, temps actuel en secondes)
    // - isRunning (booléen, état du timer)
    // - currentMode (string, 'work' ou 'break')
    // - cycleCount (nombre, cycles terminés)
    // - timerInterval (référence de l'intervalle)
    
    // TODO: Configuration des temps en secondes
    // - WORK_TIME = 30 * 60 (30 minutes)
    // - BREAK_TIME = 5 * 60 (5 minutes)  
    // - LONG_BREAK_TIME = 15 * 60 (15 minutes après 4 cycles)

    // ===========================
    // SÉLECTION DES ÉLÉMENTS DOM
    // ===========================
    
    // TODO: Sélectionner les éléments avec querySelector
    // - toggleBtn (.js-pomodoro-toggle-btn)
    // - resetBtn (.js-reset-btn)
    // - workTimeDisplay (.pomodoro__worktime)
    // - restTimeDisplay (.pomodoro__resttime)
    // - cyclesDisplay (.pomodoro__cycles)
    // - workText (.js-pomodoro-work-text)
    // - restText (.js-pomodoro-rest-text)
    // - toggleImg (image dans toggleBtn)

    // ===========================
    // FONCTIONS UTILITAIRES
    // ===========================
    
    // TODO: Créer fonction formatTime(seconds)
    // - Convertir secondes en format MM:SS
    // - Utiliser Math.floor et padStart
    
    // TODO: Créer fonction updateDisplay()
    // - Mettre à jour l'affichage selon currentMode
    // - Changer le titre de la page dynamiquement
    
    // TODO: Créer fonction updateCyclesDisplay()
    // - Afficher le nombre de cycles terminés

    // ===========================
    // GESTION DU TIMER
    // ===========================
    
    // TODO: Créer fonction startTimer()
    // - Vérifier si pas déjà en cours
    // - Créer setInterval qui décrémente currentTime
    // - Appeler completeTimer() quand temps = 0
    // - Changer icône en pause
    
    // TODO: Créer fonction pauseTimer()
    // - Arrêter le timer avec clearInterval
    // - Changer icône en play
    // - Mettre isRunning à false
    
    // TODO: Créer fonction completeTimer()
    // - Gérer la transition work ↔ break
    // - Incrémenter cycleCount pour work terminé
    // - Déterminer pause courte ou longue (% 4)
    // - Afficher alertes appropriées
    // - Mettre à jour les labels texte

    // ===========================
    // RÉINITIALISATION
    // ===========================
    
    // TODO: Créer fonction resetTimer()
    // - Remettre toutes les variables à zéro
    // - Réinitialiser l'affichage
    // - Remettre les labels par défaut
    // - Réinitialiser le titre de la page

    // ===========================
    // NOTIFICATIONS ET SONS
    // ===========================
    
    // TODO: Créer fonction requestNotificationPermission()
    // - Vérifier support navigateur
    // - Demander permission si 'default'
    
    // TODO: Créer fonction sendNotification(message)
    // - Vérifier permission 'granted'
    // - Créer nouvelle Notification avec titre et icône

    // ===========================
    // ÉVÉNEMENTS ET INITIALISATION
    // ===========================
    
    function initPomodoro() {
        // - Initialiser currentTime avec WORK_TIME
        // - Appeler updateDisplay et updateCyclesDisplay
        // - Demander permissions notifications

        // - Initialiser les animations
        initShimmerAnimations();
        // initLoadAnimations();
    }
    
    // TODO: Ajouter gestionnaires d'événements
    // - toggleBtn: alterner entre start/pause
    // - resetBtn: appeler resetTimer
    // - Espace: raccourci clavier pour play/pause (éviter inputs)

    // Initialiser l'application Pomodoro
    initPomodoro();

});