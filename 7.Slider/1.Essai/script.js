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
    // GESTION DU SLIDER
    // ===========================
    
    // Sélection de tous les éléments slide
    const slides = [...document.querySelectorAll(".slider__slide")]

    // Objet pour gérer l'état et les données du slider
    const sliderData = {
      locked: false,        // Verrouillage pendant les animations
      direction: 0,         // Direction du mouvement (-1 = gauche, 1 = droite)
      slideOutIndex: 0,     // Index du slide qui sort
      slideInIndex: 0       // Index du slide qui entre
    }

    // Sélection des boutons de navigation (précédent/suivant)
    const directionButtons = [...document.querySelectorAll(".slider__direction-btn")]

    // Ajout des écouteurs d'événements sur chaque bouton de direction
    directionButtons.forEach(btn => btn.addEventListener("click", handleSliderDirectionBtn))

    // Fonction principale de gestion du clic sur les boutons de navigation
    function handleSliderDirectionBtn(e) {
      // Empêche les clics multiples pendant une animation en cours
      if (sliderData.locked) return
      // Verrouille le slider pendant l'animation
      sliderData.locked = true

      // Détermine la direction et calcule les indices des slides
      getDirection(e.target)

      // Lance la gestion de l'animation des slides
      slideManagement()
    }

    // Fonction pour déterminer la direction et calculer les indices des slides
    function getDirection(btn) {
      // Récupère la direction depuis l'attribut data-direction du bouton
      sliderData.direction = Number(btn.getAttribute("data-direction"))

      // Trouve l'index du slide actuellement actif
      sliderData.slideOutIndex = slides.findIndex(slide => slide.classList.contains("js-active-slide"))

      // Gestion du bouclage : calcul de l'index du prochain slide
      if (sliderData.slideOutIndex + sliderData.direction > slides.length - 1) {
        // Si on dépasse le dernier slide, revenir au premier
        sliderData.slideInIndex = 0
      }
      else if (sliderData.slideOutIndex + sliderData.direction < 0) {
        // Si on va avant le premier slide, aller au dernier
        sliderData.slideInIndex = slides.length - 1
      }
      else {
        // Cas normal : slide suivant ou précédent
        sliderData.slideInIndex = sliderData.slideOutIndex + sliderData.direction
      }
    }

    // Fonction principale de gestion des animations de slides
    function slideManagement() {
      // Préparation du slide entrant : positionnement hors écran
      updateElementStyle({
        el: slides[sliderData.slideInIndex],
        props: {
          display: "flex",
          // Position de départ selon la direction
          transform: `translateX(${sliderData.direction < 0 ? "100%" : "-100%"})`,
          opacity: 0
        }
      })

      // Écouteur pour déclencher l'animation d'entrée après la sortie
      slides[sliderData.slideOutIndex].addEventListener("transitionend", slideIn)

      // Animation de sortie du slide actuel
      updateElementStyle({
        el: slides[sliderData.slideOutIndex],
        props: {
          // Transition avec courbe de Bézier personnalisée pour un effet naturel
          transition: "transform 0.4s cubic-bezier(0.74, -0.34, 1, 1.19), opacity 0.4s ease-out",
          // Position de sortie selon la direction
          transform: `translateX(${sliderData.direction < 0 ? "-100%" : "100%"})`,
          opacity: 0
        }
      })
    }

    // Fonction utilitaire pour appliquer des styles CSS à un élément
    function updateElementStyle(animationObject) {
      // Parcourt toutes les propriétés et les applique à l'élément
      for (const prop in animationObject.props) {
        animationObject.el.style[prop] = animationObject.props[prop]
      }
    }

    // Fonction d'animation d'entrée du nouveau slide
    function slideIn(e) {
      // Animation d'entrée : ramène le slide au centre avec opacité complète
      updateElementStyle({
        el: slides[sliderData.slideInIndex],
        props: {
          transition: "transform 0.4s ease-out, opacity 0.6s ease-out",
          transform: `translateX(0)`,   // Position finale au centre
          opacity: 1                    // Opacité complète
        }
      })

      // Mise à jour des classes CSS actives
      slides[sliderData.slideInIndex].classList.add("js-active-slide")      // Nouveau slide actif
      slides[sliderData.slideOutIndex].classList.remove("js-active-slide")   // Ancien slide inactif

      // Suppression de l'écouteur d'événement pour éviter les fuites mémoire
      e.target.removeEventListener("transitionend", slideIn)

      // Masquage complet du slide sortant
      slides[sliderData.slideOutIndex].style.display = "none"

      // Écouteur pour déverrouiller le slider après l'animation d'entrée
      slides[sliderData.slideInIndex].addEventListener("transitionend", unlockNewAnimation)

      // Fonction de déverrouillage du slider
      function unlockNewAnimation(){
        // Déverrouille le slider pour permettre de nouveaux clics
        sliderData.locked = false
        // Suppression de l'écouteur pour éviter les fuites mémoire
        slides[sliderData.slideInIndex].removeEventListener("transitionend", unlockNewAnimation)
      }
    }
});