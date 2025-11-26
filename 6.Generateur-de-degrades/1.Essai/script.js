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
    const colorLabels = document.querySelectorAll(".gradient-app__color-label")
    const colorPickerInputs = [...document.querySelectorAll(".gradient-app__color-input")]
    const gradientApp = document.querySelector(".gradient-app")
    const rangeLabelValue = document.querySelector(".gradient-app__orientation-value")
    
    const gradientData = {
        angle: 90,
        colors: ["#222", "#f7df1e"]
    }

    function updateGradientUI() {
        const color1 = gradientData.colors[0]
        const color2 = gradientData.colors[1]
        const angle = gradientData.angle

        colorLabels[0].textContent = color1
        colorLabels[1].textContent = color2

        colorPickerInputs[0].value = color1
        colorPickerInputs[1].value = color2

        colorLabels[0].style.backgroundColor = color1
        colorLabels[1].style.backgroundColor = color2

        gradientApp.style.backgroundImage = `linear-gradient(${gradientData.angle}deg, ${color1}, ${color2})`
        rangeLabelValue.textContent = `${angle}°`

        adaptInputsColor()
    }
    updateGradientUI()

    function adaptInputsColor() {
        colorLabels.forEach(label => {
            const hexColor = label.textContent.replace("#", "")

            const red = parseInt(hexColor.slice(0,2), 16)
            const green = parseInt(hexColor.slice(2,4), 16)
            const blue = parseInt(hexColor.slice(4,6), 16)

            const yiq = (red * 299 + green * 587 + blue * 144) / 1000

            if(yiq >= 128) {
                label.style.color = "#111"
            } else {
                label.style.color = "#f5f7fa"
            }
        })
    }

    const rangeInput = document.querySelector(".gradient-app__range")

    rangeInput.addEventListener("input", updateGradientAngle)

    function updateGradientAngle() {
        gradientData.angle = rangeInput.value
        updateGradientUI()
    }

    colorPickerInputs.forEach(input => input.addEventListener("input", colorInputModification))

    function colorInputModification(e) {
        const currentColorPickerIndex = colorPickerInputs.indexOf(e.target)
        gradientData.colors[currentColorPickerIndex] = e.target.value.toUpperCase()        
        updateGradientUI()
    }
});