const musicsData = [
    { title: "Solar", artist: "Betical", id: 1, duration: "5:38" },
    { title: "Electric-Feel", artist: "TEEMID", id: 2, duration: "3:33" },
    { title: "Aurora", artist: "SLUMB", id: 3, duration: "4:32" },
    { title: "Lost-Colours", artist: "Fakear", id: 4, duration: "3:39" },
];

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

    /* ===============================================
              LECTEUR AUDIO
              Interface basique + contrôles personnalisés
          ================================================ */

    // ===========================
    // SÉLECTIONS DOM
    // ===========================
    const audio = document.querySelector(".js-audio");
    const playBtn = document.querySelector(".js-play");
    const prevBtn = document.querySelector(".js-prev");
    const nextBtn = document.querySelector(".js-next");
    const shuffleBtn = document.querySelector(".js-shuffle");
    const repeatBtn = document.querySelector(".js-repeat");
    const muteBtn = document.querySelector(".js-mute");

    const progressBar = document.querySelector(".js-progress-bar");
    const progressFill = document.querySelector(".js-progress-fill");
    const progressHandle = document.querySelector(".js-progress-handle");
    const volumeSlider = document.querySelector(".js-volume");

    const titleEl = document.querySelector(".js-title");
    const artistEl = document.querySelector(".js-artist");
    const coverEl = document.querySelector(".js-cover");
    const timeCurrent = document.querySelector(".js-time-current");
    const timeTotal = document.querySelector(".js-time-total");

    const playlistUl = document.querySelector(".js-playlist");

    // ===========================
    // ÉTAT DU LECTEUR
    // ===========================
    let currentIndex = 0;
    let isShuffleOn = false;
    let isRepeatOn = false;
    let isDraggingProgress = false;

    // ===========================
    // UTILITAIRES
    // ===========================

    /**
     * Formate un temps en secondes au format mm:ss.
     * @param {number} seconds - Temps en secondes.
     * @returns {string} Temps formaté (ex: "3:45").
     */
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    /**
     * Charge et joue la piste courante (index = currentIndex).
     * Met à jour les infos (titre, artiste, pochette) et la playlist active.
     */
    function loadTrack() {
        const track = musicsData[currentIndex];
        if (!track) return;

        audio.src = `ressources/music/${track.title}.mp3`;
        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = track.artist;
        if (coverEl) coverEl.src = `./ressources/thumbs/${track.title}.png`;

        // Mettre à jour l'item actif dans la playlist
        document.querySelectorAll(".js-track").forEach((item, idx) => {
            item.classList.toggle("active", idx === currentIndex);
        });

        // Réinitialiser la barre de progression à 0%
        if (progressFill) progressFill.style.width = "0%";
        if (progressHandle) progressHandle.style.left = "0%";
        if (timeCurrent) timeCurrent.textContent = "0:00";
        if (timeTotal) timeTotal.textContent = "0:00";

        audio.load();
    }

    /**
     * Génère les items de la playlist (ul.js-playlist) à partir de musicsData.
     * Ajoute les gestionnaires de clic pour chaque piste.
     */
    function renderPlaylist() {
        if (!playlistUl) return;
        playlistUl.textContent = "";

        const fragment = document.createDocumentFragment();
        musicsData.forEach((track, index) => {
            const li = document.createElement("li");
            li.className = "audio-player__item js-track";
            li.tabIndex = 0;
            li.setAttribute("data-index", index);

            li.innerHTML = `
                <span class="audio-player__item-title">${track.title}</span>
                <span class="audio-player__item-artist">${track.artist}</span>
                <span class="audio-player__item-duration">${track.duration}</span>
            `;

            // Clic sur un item -> charger et jouer la piste
            li.addEventListener("click", () => {
                currentIndex = index;
                loadTrack();
                handlePlay();
            });

            fragment.appendChild(li);
        });

        playlistUl.appendChild(fragment);
    }

    // ===========================
    // GESTIONNAIRES LECTURE
    // ===========================

    /**
     * Lance la lecture. Met à jour le SVG du bouton play (affiche pause).
     */
    function handlePlay() {
        const playPromise = audio.play();

        // Gérer la promesse pour éviter les erreurs de timing
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.log("Erreur de lecture:", error);
            });
        }

        // Changer l'icône play → pause (path SVG)
        if (playBtn) {
            const svg = playBtn.querySelector("svg");
            if (svg) {
                svg.innerHTML = `
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
            playBtn.classList.toggle("active", true);
        }
    }

    /**
     * Met en pause la lecture. Restaure l'icône play.
     */
    function handlePause() {
        audio.pause();
        if (playBtn) {
            const svg = playBtn.querySelector("svg");
            if (svg) {
                svg.innerHTML = `
                    <path d="M5 3l14 9-14 9V3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
        }
    }

    /**
     * Toggle play/pause selon l'état de l'audio.
     */
    function handlePlayPause() {
        if (audio.paused) handlePlay();
        else handlePause();
    }

    /**
     * Passe à la piste précédente (boucle en début de liste).
     */
    function handlePrev() {
        const wasPlaying = !audio.paused;
        currentIndex = (currentIndex - 1 + musicsData.length) % musicsData.length;
        loadTrack();
        if (wasPlaying) {
            // Attendre que les métadonnées soient chargées avant de jouer
            audio.addEventListener(
                "loadedmetadata",
                function playAfterLoad() {
                    handlePlay();
                    audio.removeEventListener("loadedmetadata", playAfterLoad);
                },
                { once: true }
            );
        }
    }

    /**
     * Passe à la piste suivante. Gère le mode shuffle et repeat.
     */
    function handleNext() {
        const wasPlaying = !audio.paused;
        if (isShuffleOn) {
            // Mode aléatoire : choisir un index différent
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * musicsData.length);
            } while (newIndex === currentIndex && musicsData.length > 1);
            currentIndex = newIndex;
        } else {
            currentIndex = (currentIndex + 1) % musicsData.length;
        }
        loadTrack();
        if (wasPlaying) {
            // Attendre que les métadonnées soient chargées avant de jouer
            audio.addEventListener(
                "loadedmetadata",
                function playAfterLoad() {
                    handlePlay();
                    audio.removeEventListener("loadedmetadata", playAfterLoad);
                },
                { once: true }
            );
        }
    }

    /**
     * Toggle mode shuffle (lecture aléatoire). Met à jour aria-pressed et le style.
     */
    function handleShuffle() {
        isShuffleOn = !isShuffleOn;
        shuffleBtn.setAttribute("aria-pressed", isShuffleOn);
        shuffleBtn.classList.toggle("active", isShuffleOn);
    }

    /**
     * Toggle mode repeat (répéter la piste). Met à jour aria-pressed et le style.
     */
    function handleRepeat() {
        isRepeatOn = !isRepeatOn;
        repeatBtn.setAttribute("aria-pressed", isRepeatOn);
        repeatBtn.classList.toggle("active", isRepeatOn);
        audio.loop = isRepeatOn;
    }

    /**
     * Toggle mute/unmute. Change le SVG (ondes sonores vs. croix).
     */
    function handleMute() {
        audio.muted = !audio.muted;
        const svg = muteBtn.querySelector("svg");
        if (!svg) return;

        if (audio.muted) {
            // Icône mute : haut-parleur + croix
            svg.innerHTML = `
                <path d="M11 5 L7 9 H4 V15 H7 L11 19 V5 Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 9 L20 15 M20 9 L16 15" stroke-width="2" stroke-linecap="round"/>
            `;
        } else {
            // Icône unmute : haut-parleur + ondes
            svg.innerHTML = `
                <path d="M11 5 L7 9 H4 V15 H7 L11 19 V5 Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 9 C16 11,16 13,14 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 7 C19 10,19 14,16 17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        }
    }

    // ===========================
    // GESTION PROGRESSION
    // ===========================

    /**
     * Met à jour visuellement la barre de progression (fill + handle) et le temps courant.
     */
    function updateProgress() {
        if (isDraggingProgress || !audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressHandle) progressHandle.style.left = `${percent}%`;
        if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
    }

    /**
     * Gère le clic sur la barre de progression pour sauter à un moment précis.
     * @param {MouseEvent} e
     */
    function handleProgressClick(e) {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));
        audio.currentTime = percent * audio.duration;
    }

    /**
     * Démarre le drag du handle de progression.
     */
    function handleProgressDragStart() {
        isDraggingProgress = true;
    }

    /**
     * Termine le drag et met à jour currentTime selon la position finale.
     * @param {MouseEvent} e
     */
    function handleProgressDragEnd(e) {
        if (!isDraggingProgress) return;
        isDraggingProgress = false;
        handleProgressClick(e);
    }

    /**
     * Met à jour la position pendant le drag (déplacement de la souris).
     * @param {MouseEvent} e
     */
    function handleProgressDragMove(e) {
        if (!isDraggingProgress || !audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const moveX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (moveX / rect.width) * 100));
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressHandle) progressHandle.style.left = `${percent}%`;
    }

    // ===========================
    // GESTION VOLUME
    // ===========================

    /**
     * Met à jour le volume de l'audio selon la valeur du slider.
     */
    function handleVolumeChange() {
        if (!volumeSlider) return;
        audio.volume = parseFloat(volumeSlider.value);

        // Mettre à jour la variable CSS pour le remplissage visuel du slider
        const volumePercent = audio.volume * 100;
        volumeSlider.style.setProperty("--volume-percent", `${volumePercent}%`);

        // Si volume > 0 et audio était muted, le démuter automatiquement
        if (audio.muted && audio.volume > 0) {
            audio.muted = false;
            handleMute(); // met à jour l'icône
        }
    }

    // ===========================
    // ÉVÉNEMENTS AUDIO
    // ===========================

    /**
     * Quand les métadonnées sont chargées : affiche la durée totale.
     */
    function handleLoadedMetadata() {
        if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
    }

    /**
     * Quand la piste se termine : passe automatiquement à la suivante (sauf si repeat est actif).
     */
    function handleEnded() {
        if (!isRepeatOn) {
            // Changer de piste en simulant qu'on était en lecture
            if (isShuffleOn) {
                // Mode aléatoire : choisir un index différent
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * musicsData.length);
                } while (newIndex === currentIndex && musicsData.length > 1);
                currentIndex = newIndex;
            } else {
                currentIndex = (currentIndex + 1) % musicsData.length;
            }
            loadTrack();
            // Lancer automatiquement la lecture après le chargement
            audio.addEventListener(
                "loadedmetadata",
                function playAfterLoad() {
                    handlePlay();
                    audio.removeEventListener("loadedmetadata", playAfterLoad);
                },
                { once: true }
            );
        }
    }

    // ===========================
    // RACCOURCIS CLAVIER
    // ===========================

    /**
     * Gère les raccourcis clavier globaux (Space = play/pause, ArrowLeft/Right = prev/next).
     * @param {KeyboardEvent} e
     */
    function handleKeyboard(e) {
        // Éviter d'intercepter si l'utilisateur tape dans un input
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

        switch (e.code) {
            case "Space":
                e.preventDefault();
                handlePlayPause();
                break;
            case "ArrowLeft":
                e.preventDefault();
                handlePrev();
                break;
            case "ArrowRight":
                e.preventDefault();
                handleNext();
                break;
        }
    }

    // ===========================
    // INITIALISATION
    // ===========================

    // Générer la playlist au chargement
    renderPlaylist();
    // Charger la première piste (sans jouer)
    loadTrack();

    // Initialiser l'affichage du volume
    if (volumeSlider) {
        const initialVolume = audio.volume * 80;
        volumeSlider.style.setProperty("--volume-percent", `${initialVolume}%`);
    }

    // Écouteurs — boutons principaux
    if (playBtn) playBtn.addEventListener("click", handlePlayPause);
    if (prevBtn) prevBtn.addEventListener("click", handlePrev);
    if (nextBtn) nextBtn.addEventListener("click", handleNext);
    if (shuffleBtn) shuffleBtn.addEventListener("click", handleShuffle);
    if (repeatBtn) repeatBtn.addEventListener("click", handleRepeat);
    if (muteBtn) muteBtn.addEventListener("click", handleMute);

    // Écouteurs — progression
    if (progressBar) {
        progressBar.addEventListener("click", handleProgressClick);
        progressBar.addEventListener("mousedown", handleProgressDragStart);
    }
    if (progressHandle) {
        progressHandle.addEventListener("mousedown", handleProgressDragStart);
    }
    document.addEventListener("mouseup", handleProgressDragEnd);
    document.addEventListener("mousemove", handleProgressDragMove);

    // Écouteurs — volume
    if (volumeSlider) volumeSlider.addEventListener("input", handleVolumeChange);

    // Écouteurs — audio element
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Raccourcis clavier
    document.addEventListener("keydown", handleKeyboard);
});
