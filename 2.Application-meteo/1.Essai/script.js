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
    // APPLICATION MÉTÉO
    // ===========================
    
    // ===========================
    // ÉLÉMENTS DOM
    // ===========================
    const loader = document.querySelector('.weather-app__loader-container')
    const errorInformation = document.querySelector('.weather-app__error-info')
    const cityName = document.querySelector('.weather-app__city')
    const countryName = document.querySelector('.weather-app__country')
    const temperature = document.querySelector('.weather-app__temp')
    const infoIcon = document.querySelector('.weather-app__info-icon')

    // ===========================
    // RÉCUPÉRATION DES DONNÉES MÉTÉO
    // ===========================
    async function getWeatherData() {
        // Afficher le loader pendant le chargement
        loader.classList.add('js-loader-active');
        
        let data;
        try {
            // Appel API pour récupérer les données météo
            const response = await fetch('./weatherAPI/weatherData.json')
            
            // Vérifier si la réponse est OK
            if (!response.ok) {
                throw new Error()
            }
            
            // Parser les données JSON
            data = await response.json()
            
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la récupération des données météo:', error)
            
            // Afficher le message d'erreur à l'utilisateur
            errorInformation.style.display = 'block'
            errorInformation.textContent = "Erreur lors de la récupération des données météo. 🌧️"
            return
            
        } finally {
            // Toujours masquer le loader à la fin (succès ou erreur)
            loader.classList.remove('js-loader-active')
        }
        
        // Afficher les données récupérées dans la console
        console.log('Données météo récupérées:', data)
        
        // Mettre à jour l'interface utilisateur
        populateUI(data)
    }

    // ===========================
    // MISE À JOUR DE L'INTERFACE
    // ===========================
    function populateUI(data) {
        // Vérifier que nous avons des données valides
        if (!data || !data[0]) {
            console.error('Données météo invalides:', data)
            errorInformation.textContent = "Données météo non disponibles. ❌"
            errorInformation.style.display = 'block'
            return;
        }

        const weatherData = data[0]
        
        // Mise à jour des éléments textuels
        cityName.textContent = weatherData.city
        countryName.textContent = weatherData.country
        temperature.textContent = `${weatherData.temperature}°C`
        
        // Mise à jour de l'icône météo
        if (weatherData.iconID) {
            infoIcon.src = `./assets/icons/${weatherData.iconID}.svg`
            infoIcon.alt = `Icône météo pour ${weatherData.city}`
            infoIcon.style.display = 'block'
        }
        
        console.log('Interface mise à jour avec succès')
    }

    // ===========================
    // INITIALISATION DE L'APPLICATION
    // ===========================
    // Lancer la récupération des données au chargement de la page
    getWeatherData()
});