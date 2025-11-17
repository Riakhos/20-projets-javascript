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
    // ZONE : CODE SPÉCIFIQUE AU LECTEUR VIDÉO
    // Ici, ajoutez les comportements personnalisés du lecteur vidéo :
    // - gestion play/pause, big-play temporaire,
    // - mise à jour de la barre de progression et du seek-handle,
    // - gestion du volume / mute / slider,
    // - navigation (clic sur la barre) et fullscreen,
    // - écouteurs loadedmetadata/timeupdate, etc.
    // Conserver la logique commune en dehors de cette section.
    // ===========================

    // Détecte Firefox (desktop ou Android)
    const isFirefox = /firefox/i.test(navigator.userAgent);

    // Récupère éléments
    const video = document.getElementById("video");
    const wrapper = document.querySelector(".video-wrap");

    // Helpers cross-browser pour fullscreen
    function requestFullscreen(el) {
        if (!el) return Promise.reject();
        return (
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen
        ).call(el);
    }
    function exitFullscreen() {
        return (
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen
        ).call(document);
    }

    if (isFirefox) {
        // Quand l'utilisateur lance la lecture, on tente de mettre le wrapper en "fullscreen" contrôlable
        video.addEventListener("play", async () => {
            try {
                // Fullscreen exige généralement une interaction utilisateur — ici on est dans le handler 'play'
                await requestFullscreen(wrapper);
                // Optionnel : ajouter une classe pour adapter le style quand on est en fullscreen contrôlé
                wrapper.classList.add("vp-fullscreen-controlled");
            } catch (e) {
                // Échec possible sur certains mobiles ; laisser le navigateur gérer la lecture
                console.warn("Impossible d'entrer en fullscreen contrôlé :", e);
            }
        });

        // Quitter fullscreen contrôlé à la pause / fin
        ["pause", "ended"].forEach((evt) => {
            video.addEventListener(evt, () => {
                try {
                    exitFullscreen();
                } catch (e) {
                    /* ignore */
                }
                wrapper.classList.remove("vp-fullscreen-controlled");
            });
        });

        // Synchroniser si utilisateur sort du fullscreen via UI système
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement)
                wrapper.classList.remove("vp-fullscreen-controlled");
        });
    }

    // Élément vidéo principal (<video> ou wrapper) et bouton de contrôle
    const videoPlayer = document.querySelector(".video-element");
    const playbackToggler = document.querySelector(".vp-play");
    const bigPlaybackToggler = document.querySelector(".vp-big-play");

    // timeout pour la visibilité temporaire du big play
    let bigPlayTimeout = null;

    // Attacher les écouteurs seulement si les éléments existent pour éviter des erreurs si le script est chargé avant le HTML ou dans une page sans ces composants.
    if (videoPlayer) videoPlayer.addEventListener("click", togglePlay);
    if (playbackToggler) playbackToggler.addEventListener("click", togglePlay);
    if (bigPlaybackToggler) bigPlaybackToggler.addEventListener("click", togglePlay);

    /**
     * togglePlay
     *
     * Basculer la lecture / pause de la vidéo et mettre à jour l'interface associée.
     *
     * Comportement :
     * - lance ou met en pause la lecture sur l'élément vidéo.
     * - met à jour les attributs ARIA (aria-pressed, aria-label) des contrôles concernés.
     * - remplace le contenu texte des boutons de contrôle (petit bouton et big-play) pour
     *   refléter l'état (ex. "▶" -> "❚❚").
     * - pour le bouton big-play : l'afficher brièvement (classe CSS `vp-visible-temp`) après
     *   l'action, puis le masquer de nouveau — il restera visible au hover grâce au CSS.
     *
     * Accessibilité :
     * - conserve des labels clairs pour les lecteurs d'écran ;
     * - évite de modifier le DOM de façon imprévisible (mise à jour contrôlée des textes/attributs).
     *
     * Remarques d'implémentation :
     * - la fonction n'a pas de paramètre ; elle utilise les références aux éléments déjà capturés
     *   (videoPlayer, playbackToggler, bigPlaybackToggler).
     * - la logique d'affichage temporaire du big-play est réalisée via un timeout stocké dans
     *   `bigPlayTimeout` (annulation si une nouvelle action survient).
     */
    function togglePlay() {
        if (!videoPlayer) return; // sécurité

        // Basculer la lecture (faire une seule action)
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }

        // Déterminer l'état après l'action
        const isPlaying = !videoPlayer.paused;

        // Mettre à jour les attributs ARIA et l'icône uniquement si les togglers existent
        if (playbackToggler) {
            playbackToggler.setAttribute("aria-pressed", String(isPlaying));
            playbackToggler.setAttribute(
                "aria-label",
                isPlaying ? "Mettre la vidéo en pause" : "Lancer la vidéo"
            );

            // Remplace le contenu texte du bouton (▶ / ❚❚ ou ❚❚ / ▶)
            playbackToggler.textContent = isPlaying ? "❚❚ / ▶" : "▶ / ❚❚";
        }

        if (bigPlaybackToggler) {
            // ARIA
            bigPlaybackToggler.setAttribute("aria-pressed", String(isPlaying));
            bigPlaybackToggler.setAttribute(
                "aria-label",
                isPlaying ? "Mettre la vidéo en pause" : "Lancer la vidéo"
            );

            // Remplace le contenu texte du bouton (▶ ou ❚❚)
            bigPlaybackToggler.textContent = isPlaying ? "❚❚" : "▶";

            // Affiche le bouton un court instant (même sans hover), puis le cacher de nouveau
            bigPlaybackToggler.classList.add("vp-visible-temp");
            if (bigPlayTimeout) clearTimeout(bigPlayTimeout);
            bigPlayTimeout = setTimeout(() => {
                bigPlaybackToggler.classList.remove("vp-visible-temp");
                // restaurer l'icône par défaut (play) pour l'affichage au hover
                bigPlaybackToggler.textContent = isPlaying ? "❚❚" : "▶";
            }, 900); // visible 900ms
        }
    }

    // Élément affichage durée totale de la vidéo (DOM)
    const vpDuration = document.querySelector('.vp-duration');
    // Élément affichage temps courant de la vidéo (DOM)
    const vpCurrent = document.querySelector('.vp-current');

    // Valeur courante en secondes (mise à jour lors de la lecture)
    let current;
    // Durée totale de la vidéo en secondes (remplie après chargement des métadonnées)
    let totalDuration;

    window.addEventListener('load', fillDurationVariables);

    /**
     * Remplit les variables `current` et `totalDuration` à partir de l'élément vidéo
     * puis met à jour les affichages visibles (durée totale et temps actuel).
     * Appelée au chargement de la page (load).
    */    
    function fillDurationVariables() {
        current = videoPlayer.currentTime;
        totalDuration = videoPlayer.duration;

        displayFormattedValue(totalDuration, vpDuration);
        displayFormattedValue(current, vpCurrent);
    }

    /**
     * Convertit une valeur en secondes en une chaîne "MM:SS" et l'affiche dans
     * l'élément DOM passé en paramètre.
     *
     * @param {number} val - durée en secondes.
     * @param {Element} element - élément DOM où afficher le texte formaté.
    */
    function displayFormattedValue(val, element) {
        if (!element) return;

        const minutes = Math.floor(val / 60); // minutes entières
        let seconds = Math.floor(val % 60); // secondes (réaffectable pour le 0-padding)

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        element.textContent = `${minutes}:${seconds}`;
    }

    const progressBar = document.querySelector('.vp-progress__bar');
    const seekHandle = document.querySelector('.vp-progress__seek-handle');

    // s'assurer que la durée totale est initialisée (écouteur loadedmetadata ailleurs)
    if (videoPlayer) {
      videoPlayer.addEventListener('timeupdate', handleTimeUpdate);
      // si les metadata sont déjà prêtes, forcer une initialisation de la position
      videoPlayer.addEventListener('loadedmetadata', handleTimeUpdate);
    }

    /**
     * Met à jour la barre de progression et l'affichage du temps courant
     * lors de la lecture de la vidéo.
     */
    function handleTimeUpdate() {
        if (!videoPlayer || !progressBar) return;

        // temps courant
        const currentTime = videoPlayer.currentTime || 0;
        displayFormattedValue(currentTime, vpCurrent);

        // utiliser totalDuration connu ou video.duration en fallback
        const denom = totalDuration || (isFinite(videoPlayer.duration) ? videoPlayer.duration : 0);
        let progressPosition = 0;
        if (denom > 0) progressPosition = currentTime / denom;

        // clamp entre 0 et 1 pour éviter NaN / overflow
        const clamped = Math.max(0, Math.min(1, progressPosition));

        // appliquer la transformation; CSS doit définir transform-origin: left;
        progressBar.style.transform = `scaleX(${clamped})`;

        // positionner la pastille de seek : left en pourcentage (translate centré en CSS)
        if (seekHandle) {
          seekHandle.style.left = `${clamped * 100}%`;
        }

        if (videoPlayer.ended) {
            playbackToggler.textContent = "▶ / ❚❚";
            playbackToggler.setAttribute("aria-pressed", "false");
            playbackToggler.setAttribute("aria-label", "Lancer la vidéo");

            bigPlaybackToggler.textContent = "▶";
            bigPlaybackToggler.setAttribute("aria-pressed", "false");
            bigPlaybackToggler.setAttribute("aria-label", "Lancer la vidéo");
        }
    }

    const progressBarContainer = document.querySelector('.vp-progress');

    progressBarContainer.addEventListener('click', handleProgressNavigation);

    /**
     * Gère la navigation dans la vidéo en fonction du clic sur la barre de progression.
     *
     * @param {MouseEvent} e - L'événement de clic.
     */
    function handleProgressNavigation(e) {
        if (!videoPlayer || !totalDuration) return;

        const rect = progressBarContainer.getBoundingClientRect();
        const clickPositionInProgressBar = e.clientX - rect.left;
        const clickProgressRatio = clickPositionInProgressBar / rect.width;

        videoPlayer.currentTime = clickProgressRatio * totalDuration;
    }

    const muteBtn = document.querySelector('.vp-mute');
    const volumeSlider = document.querySelector('.vp-volume');

    muteBtn.addEventListener('click', handleMute);

    /**
     * Gère le clic sur le bouton de mute/unmute.
     */
    function handleMute() {
        if (!videoPlayer) return;

        if (videoPlayer.volume === 0) {
            videoPlayer.volume = 1;
            volumeSlider.value = 100;
        }
        videoPlayer.muted = !videoPlayer.muted;
        updateMuteUI();
    }

    function updateMuteUI() {
        if (!videoPlayer) return;

        muteBtn.textContent = videoPlayer.muted ? "🔇" : "🔊";
        muteBtn.setAttribute('aria-pressed', videoPlayer.muted);
        muteBtn.setAttribute('aria-label', videoPlayer.muted ? 'Remettre le son en place' : 'Mettre en sourdine');
        muteBtn.setAttribute('title', videoPlayer.muted ? 'Activer le son' : 'Couper le son');
    }

    volumeSlider.addEventListener('input', handleVolumeModification);

    /**
     * Gère la modification du volume via le slider.
     */
    function handleVolumeModification() {
        if (!videoPlayer) return;

        videoPlayer.volume = volumeSlider.value / 100;
        videoPlayer.muted = videoPlayer.volume === 0;

        updateMuteUI();
    }

    const fullscreenToggler = document.querySelector('.vp-fullscreen');

    const videoContainer = document.querySelector('.video-player');

    videoPlayer.addEventListener('dblclick', toggleFullscreen);
    fullscreenToggler.addEventListener('click', toggleFullscreen);

    /**
     * Bascule le mode plein écran pour le conteneur vidéo.
     */
    function toggleFullscreen() {
        if (!videoContainer) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoContainer.requestFullscreen();
        }
    }
});
