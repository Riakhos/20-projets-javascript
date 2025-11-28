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
        // - Sélectionner les éléments avec background sombre
        const darkShimmerElements = document.querySelectorAll(
            ".pomodoro__header,.pomodoro__info-block,.pomodoro__cycles-container"
        );

        // - Sélectionner les éléments avec background doré (texte uniquement)
        const goldShimmerElements = document.querySelectorAll(
            ".pomodoro__title,.pomodoro__title--style,.pomodoro__info-text,.pomodoro__description,.pomodoro__worktime,.pomodoro__resttime,.pomodoro__cycles-text,.pomodoro__cycles"
        );

        // - Sélectionner le conteneur principal pour animation de fond
        const goldDiv = document.querySelector(".pomodoro");

        // - Appliquer les styles CSS pour les éléments sombres
        if (darkShimmerElements.length > 0) {
            darkShimmerElements.forEach((el) => {
                el.style.background =
                    "linear-gradient(90deg, rgba(51, 51, 51, 0.9), #222, rgba(51, 51, 51, 0.9)";
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
            goldDiv.style.animation = "shimmer 5s ease-in-out infinite";
        }
    }

    // Animations d'entrée au chargement de la page
    function initLoadAnimations() {
        // - Sélectionner les éléments à animer
        const animatedElements = [
            // - Définir les éléments et leurs délais d'animation
            { selector: ".pomodoro__header", delay: 100 },
            { selector: ".pomodoro__info", delay: 400 },
            { selector: ".pomodoro__features", delay: 800 },
            { selector: ".pomodoro__cycles-container", delay: 1200 },
        ];

        // - Appliquer les animations
        animatedElements.forEach(({ selector, delay }) => {
            // - Sélectionner l'élément
            const element = document.querySelector(selector);

            // - Appliquer opacity: 0 et translateY au début
            element.style.opacity = 0;
            element.style.transform = "translateY(30px)";

            // - Animer vers opacity: 1 et translateY: 0 avec setTimeout
            setTimeout(() => {
                element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
                element.style.opacity = 1;
                element.style.transform = "translateY(0)";
            }, delay);
        });
    }

    // ===========================
    // VARIABLES GLOBALES POMODORO
    // ===========================

    // Déclarer les variables d'état
    let currentTime = 0; // (nombre, temps actuel en secondes)
    let isRunning = false; // (booléen, état du timer)
    let currentMode = 'work'; // (string, 'work' ou 'break')
    let cycleCount = 0; // (nombre, cycles terminés)
    let timerInterval = null; // (référence de l'intervalle)

    // Configuration des temps en secondes
    const WORK_TIME = 30 * 60; // (30 minutes)
    const BREAK_TIME = 5 * 60; // (5 minutes)
    const LONG_BREAK_TIME = 15 * 60; // (15 minutes après 4 cycles)

    // ===========================
    // SÉLECTION DES ÉLÉMENTS DOM
    // ===========================

    // Sélectionner les éléments avec querySelector
    const toggleBtn = document.querySelector(".js-pomodoro-toggle-btn");
    const resetBtn = document.querySelector(".js-reset-btn");
    const workTimeDisplay = document.querySelector(".pomodoro__worktime");
    const restTimeDisplay = document.querySelector(".pomodoro__resttime");
    const cyclesDisplay = document.querySelector(".pomodoro__cycles");
    const workText = document.querySelector(".js-pomodoro-work-text");
    const restText = document.querySelector(".js-pomodoro-rest-text");
    const toggleImg = toggleBtn.querySelector("img");

    // ===========================
    // FONCTIONS UTILITAIRES
    // ===========================

    // - Convertir secondes en format MM:SS
    function formatTime(seconds) {        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        // Retourner le format MM:SS avec zéros devant si nécessaire
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // - Mettre à jour l'affichage selon currentMode
    function updateDisplay() {
        
        // Mettre à jour le temps affiché selon le mode actuel
        if (currentMode === 'work') {
            workTimeDisplay.textContent = formatTime(currentTime);
        } else {
            restTimeDisplay.textContent = formatTime(currentTime);
        }
        
        // Mettre à jour le titre de la page seulement si le timer est en cours
        if (isRunning) {
            document.title = `${formatTime(currentTime)} - Pomodoro ${currentMode === 'work' ? 'Travail' : 'Repos'}`;
        }
    }

    // - Afficher le nombre de cycles terminés
    function updateCyclesDisplay() {
        cyclesDisplay.textContent = `Cycle(s) effectué(s) : ${cycleCount}`;
    }

    // ===========================
    // GESTION DU TIMER
    // ===========================

    // Démarrer le timer
    function startTimer()
     {
        // - Vérifier si pas déjà en cours
        if (!isRunning) {

            // - Créer setInterval qui décrémente currentTime
            isRunning = true;
            timerInterval = setInterval(() => {
                currentTime--;
                updateDisplay();
    
                // - Appeler completeTimer() quand temps = 0
                if (currentTime <= 0) {
                    completeTimer();
                }
            }, 1000);
    
            // - Changer icône en pause
            if (toggleImg) {
                toggleImg.src = 'ressources/pause.svg';
                toggleBtn.setAttribute('aria-label', 'Mettre en pause le Pomodoro');
                toggleBtn.setAttribute('data-toggle', 'pause');
            }

            // - Activer l'animation loading pour le mode actuel
            if (currentMode === 'work') {
                workText.classList.add('js-active-pomodoro');
                restText.classList.remove('js-active-pomodoro');
            } else {
                restText.classList.add('js-active-pomodoro');
                workText.classList.remove('js-active-pomodoro');
            }
        }
    }

    // - Arrêter le timer avec clearInterval
    function pauseTimer() {

        // Vérifier si le timer est en cours
        if (isRunning) {
            clearInterval(timerInterval);

            // - Mettre isRunning à false
            isRunning = false;

            // - Changer icône en play
            if (toggleImg) {
                toggleImg.src = 'ressources/play.svg';
                toggleBtn.setAttribute('aria-label', 'Démarrer le Pomodoro');
                toggleBtn.setAttribute('data-toggle', 'play');
            }

            // - Désactiver l'animation loading
            workText.classList.remove('js-active-pomodoro');
            restText.classList.remove('js-active-pomodoro');
        }
    }

    // - Terminer le timer actuel
    function completeTimer(){

        // Arrêter le timer
        pauseTimer();

        // Gérer la transition work ↔ break
        if (currentMode === 'work') {

            // - Incrémenter cycleCount pour work terminé
            cycleCount++;
            updateCyclesDisplay();
            
            // - Déterminer pause courte ou longue (% 4)
            if (cycleCount % 4 === 0) {

                // - Gérer les pauses longues après 4 cycles
                currentTime = LONG_BREAK_TIME;                
                
                // - Afficher alertes appropriées
                alert('🎉 Cycle terminé ! Prenez une longue pause de 15 minutes.');
                sendNotification('🎉 Cycle terminé ! Prenez une longue pause de 15 minutes.');

                // - Mettre à jour les labels texte
                restText.textContent = "Pause longue";
                workText.textContent = "Cycle terminé !";
            } else {
                currentTime = BREAK_TIME;
                
                // - Afficher alertes appropriées
                alert('✅ Travail terminé ! Prenez une pause de 5 minutes.');
                sendNotification('✅ Travail terminé ! Prenez une pause de 5 minutes.');
                
                // - Mettre à jour les labels texte
                restText.textContent = "Temps de repos";
                workText.textContent = "Travail terminé !";
            }
            
            // Passer en mode repos
            currentMode = 'break';
            
        } else {
            
            // - Passer en mode travail
            currentMode = 'work';
            currentTime = WORK_TIME;
            
            // - Mettre à jour les labels texte
            workText.textContent = "Temps de travail";
            restText.textContent = "Repos terminé !";

            // - Afficher alertes appropriées
            alert('✅ Pause terminée ! Retour au travail.');
            sendNotification('✅ Pause terminée ! Retour au travail.');            
        }

        // - Mettre à jour l'affichage
        updateDisplay();

        // - Option : redémarrer automatiquement
        startTimer();
    }

    // ===========================
    // RÉINITIALISATION
    // ===========================

    // Réinitialiser le timer et l'état
    function resetTimer() {

        // - Arrêter le timer s'il est en cours
        pauseTimer();

        // - Remettre toutes les variables à zéro
        currentTime = WORK_TIME;
        cycleCount = 0;
        currentMode = 'work';

        // - Réinitialiser l'affichage
        workTimeDisplay.textContent = formatTime(WORK_TIME);
        restTimeDisplay.textContent = formatTime(BREAK_TIME);
        updateDisplay();

        // - Remettre les labels par défaut
        workText.textContent = "Travail";
        restText.textContent = "Repos";

        // - Désactiver l'animation loading
        workText.classList.remove('js-active-pomodoro');
        restText.classList.remove('js-active-pomodoro');

        // - Réinitialiser le titre de la page
        document.title = "Pomodoro App";
    }

    // ===========================
    // NOTIFICATIONS ET SONS
    // ===========================

    // - Demander permissions pour les notifications
    function requestNotificationPermission() {
        
        // - Vérifier support navigateur
        if ('Notification' in window) {

            // - Demander permission si 'default'
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }

    // - Envoyer une notification
    function sendNotification(message) {
        // - Vérifier support navigateur
        if ('Notification' in window) {

            // - Vérifier permission 'granted'
            if (Notification.permission === 'granted') {

                // - Créer nouvelle Notification avec titre et icône
                new Notification('Pomodoro Timer', {
                    body: message,
                    icon: 'assets/Image20241113115512.png' // Icône JavaScript
                });
            }
        }
    }

    // ===========================
    // ÉVÉNEMENTS ET INITIALISATION
    // ===========================

    // - Initialiser l'application Pomodoro
    function initPomodoro() {

        // - Initialiser currentTime avec WORK_TIME
        currentTime = WORK_TIME;

        // - Appeler updateDisplay et updateCyclesDisplay
        updateDisplay();
        updateCyclesDisplay();

        // - Demander permissions notifications
        requestNotificationPermission();

        // - Initialiser les animations
        initShimmerAnimations();
        initLoadAnimations();
    }

    // Gestionnaires d'événements

    // - toggleBtn: alterner entre start/pause
    if (toggleBtn) {

        // - Vérifier l'état du bouton
        toggleBtn.addEventListener('click', () => {

            // - Si le bouton est en pause, appeler pauseTimer
            if (isRunning) {
                pauseTimer();

            // - Sinon, appeler startTimer
            } else {
                startTimer();
            }
        });
    }
    
    // - resetBtn: appeler resetTimer
    if (resetBtn) {

        // Ajouter l'événement click pour réinitialiser
        resetBtn.addEventListener('click', resetTimer);
    }

    // - Espace: raccourci clavier pour play/pause (éviter inputs)
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

    // - Initialiser l'application Pomodoro
    initPomodoro();
});
