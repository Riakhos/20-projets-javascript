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
    
    // =====================================================
    // ICI NOUS AJOUTONS LE CODE POUR :
    // - curseur personnalisé
    // - effet machine à écrire
    // - apparitions au scroll (Intersection Observer)
    // =====================================================

    /* ----------------------------------------------------------------
        CURSEUR PERSONNALISÉ
        - utilise #custom-cursor
        - s'active uniquement sur dispositifs pointeur (pas sur touch)
    ---------------------------------------------------------------- */
    (function customCursor() {
        const cursor = document.getElementById('custom-cursor');
        const cursorOuterCircle = cursor.querySelector('.custom-cursor__outer-circle');
        const cursorInnerDot = cursor.querySelector('.custom-cursor__inner-dot');

        let mouseX = 0, mouseY = 0;
        let posOuterX = 0, posOuterY = 0;
        let posInnerX = 0, posInnerY = 0;

        const outerCursorSpeed = 0.1;
        const innerDotCursorSpeed = 0.25;

        let isRafIdle = null;

        window.addEventListener('mousemove', onMove);

        function onMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if(!isRafIdle) {
                animateCursor();
            }
        }

        function animateCursor() {
            // Suivi lissé de la position de la souris
            posOuterX += (mouseX - posOuterX) * outerCursorSpeed;
            posOuterY += (mouseY - posOuterY) * outerCursorSpeed;

            posInnerX += (mouseX - posInnerX) * innerDotCursorSpeed;
            posInnerY += (mouseY - posInnerY) * innerDotCursorSpeed;

            cursorOuterCircle.style.translate = `calc(${posOuterX}px - 50%) calc(${posOuterY}px - 50%)`;
            cursorInnerDot.style.translate = `calc(${posInnerX}px - 50%) calc(${posInnerY}px - 50%)`;

            if (Math.abs(posOuterX - mouseX) < 0.1 && Math.abs( posOuterY - mouseY) < 0.1) {
                cancelAnimationFrame(isRafIdle);
                isRafIdle = null;
                return
            }

            isRafIdle = requestAnimationFrame(animateCursor);

            const hoveredElement = document.elementFromPoint(mouseX, mouseY);
            
            // Ajoute des états quand on survole des éléments interactifs
            if (hoveredElement && hoveredElement.closest('a,button,input,textarea,select,[role="button"],.showcase-models__model-link')) {
                cursorOuterCircle.style.opacity = '0';
                cursorInnerDot.style.opacity = '0';
            } else {
                cursorOuterCircle.style.opacity = '1';
                cursorInnerDot.style.opacity = '1';
            }
        }
    })();

    /* ----------------------------------------------------------------
    TYPEWRITER (machine à écrire)
    - lit l'attribut data-text ou le texte initial
    - affiche lettre par lettre
    ---------------------------------------------------------------- */
    (function typewriter() {
        const targets = document.querySelectorAll('.typewriter-target');
        if (!targets || targets.length === 0) return;

        targets.forEach((el) => {
            const full = el.dataset.text ? el.dataset.text : el.textContent.trim();
            el.textContent = '';
            el.setAttribute('aria-live', 'polite');
            let i = 0;
            const baseDelay = 100; // ms

            function tick() {
                if (i <= full.length) {
                    el.textContent = full.slice(0, i);
                    i++;
                    // petite variation aléatoire pour un effet de frappe plus naturel
                    const jitter = Math.floor(Math.random() * 40);
                    setTimeout(tick, baseDelay + jitter);
                }
            }

            // petite pause avant de démarrer
            setTimeout(tick, 350);
        });
    })();

    /* ----------------------------------------------
    REVEAL AU SCROLL (IntersectionObserver)
    - ajoute la classe .revealed sur les .showcase-models__car-example
    ---------------------------------------------- */
    (function scrollReveal() {
        const items = document.querySelectorAll('.showcase-models__car-example');
        if (!items || items.length === 0) return;

        // Si le navigateur prend en charge l'API IntersectionObserver,
        // on crée un observer pour surveiller l'apparition des éléments dans la fenêtre.
        // - `entries` contient les informations de visibilité pour chaque élément observé.
        // - `entry.isIntersecting` est true quand l'élément croise le seuil (ici threshold: 0.15).
        // - Quand un élément devient visible, on lui ajoute la classe `revealed` (déclenche l'animation CSS)
        //   puis on appelle `obs.unobserve(entry.target)` pour arrêter d'observer cet élément (optimisation).
        // - Si l'API n'est pas disponible (anciens navigateurs), le bloc `else` est un repli simple
        //   qui applique immédiatement la classe `revealed` à tous les éléments (aucune animation liée à l'intersection).
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            items.forEach(el => io.observe(el));
        } else {
            // repli : révéler tous les éléments immédiatement si l'API n'est pas supportée
            items.forEach(el => el.classList.add('revealed'));
        }
    })();
});