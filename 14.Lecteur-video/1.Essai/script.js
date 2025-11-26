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

    // Détecte Firefox (desktop ou Android)
    const isFirefox = /firefox/i.test(navigator.userAgent);

    // Récupère éléments
    const video = document.getElementById('video');
    const wrapper = document.querySelector('.video-wrap');

    // Helpers cross-browser pour fullscreen
    function requestFullscreen(el) {
    if (!el) return Promise.reject();
    return (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen).call(el);
    }
    function exitFullscreen() {
    return (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen).call(document);
    }

    if (isFirefox) {
    // Quand l'utilisateur lance la lecture, on tente de mettre le wrapper en "fullscreen" contrôlable
    video.addEventListener('play', async () => {
        try {
        // Fullscreen exige généralement une interaction utilisateur — ici on est dans le handler 'play'
        await requestFullscreen(wrapper);
        // Optionnel : ajouter une classe pour adapter le style quand on est en fullscreen contrôlé
        wrapper.classList.add('vp-fullscreen-controlled');
        } catch (e) {
        // Échec possible sur certains mobiles ; laisser le navigateur gérer la lecture
        console.warn('Impossible d\'entrer en fullscreen controlé :', e);
        }
    });

    // Quitter fullscreen contrôlé à la pause / fin
    ['pause', 'ended'].forEach(evt => {
        video.addEventListener(evt, () => {
        try { exitFullscreen(); } catch (e) { /* ignore */ }
        wrapper.classList.remove('vp-fullscreen-controlled');
        });
    });

    // Synchroniser si utilisateur sort du fullscreen via UI système
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) wrapper.classList.remove('vp-fullscreen-controlled');
    });
    }

    // Élément vidéo principal (<video> ou wrapper) et bouton de contrôle
    const videoPlayer = document.querySelector('.video-element');
    const playbackToggler = document.querySelector('.vp-play');
    const bigPlaybackToggler = document.querySelector('.vp-big-play');

    // Attacher les écouteurs seulement si les éléments existent pour éviter des erreurs si le script est chargé avant le HTML ou dans une page sans ces composants.
    if (videoPlayer) videoPlayer.addEventListener("click", togglePlay);
    if (playbackToggler) playbackToggler.addEventListener("click", togglePlay);
    if (bigPlaybackToggler) bigPlaybackToggler.addEventListener("click", togglePlay);

    /**
     * Toggle play/pause
     * ------------------
     * Basculer l'état de lecture de la vidéo et mettre à jour l'UI associée.
     * Effets secondaires :
     *  - met à jour `aria-pressed` et `aria-label` sur le bouton de contrôle
     *  - met à jour l'icône (<img>) à l'intérieur du bouton si présente
     *
     * Remarques d'accessibilité :
     *  - `aria-pressed` indique l'état binaire du contrôle,
     *  - `aria-label` fournit une description claire pour les lecteurs d'écran.
     */
    function togglePlay() {
        if (!videoPlayer) return; // sécurité

        // Basculer la lecture
        videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause(); videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();

        // Mettre à jour les attributs ARIA et l'icône uniquement si le toggler existe
        playbackToggler.setAttribute('aria-pressed', !videoPlayer.paused);
        bigPlaybackToggler.setAttribute('aria-pressed', !videoPlayer.paused);
        playbackToggler.setAttribute('aria-label', !videoPlayer.paused ? 'Lancer la vidéo' : 'Mettre la vidéo en pause');
        bigPlaybackToggler.setAttribute('aria-label', !videoPlayer.paused ? 'Lancer la vidéo' : 'Mettre la vidéo en pause');

        // playbackToggler.querySelector('img').src = !videoPlayer.paused ? 'ressources/play.svg' : 'ressources/pause.svg';
        // bigPlaybackToggler.querySelector('img').src = !videoPlayer.paused ? 'ressources/play.svg' : 'ressources/pause.svg';
    }
});
