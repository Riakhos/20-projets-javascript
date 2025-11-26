// ===========================
// ANIMATIONS SHIMMER
// ===========================

// Fonction pour ajouter l'effet shimmer
function addShimmer(element) {
    element.classList.add('shimmer');
}

// Fonction pour retirer l'effet shimmer
function removeShimmer(element) {
    element.classList.remove('shimmer');
}

// Fonction pour simuler le chargement avec shimmer
function loadWithShimmer(element, callback, delay = 1000) {
    addShimmer(element);
    
    setTimeout(() => {
        removeShimmer(element);
        if (callback) callback();
    }, delay);
}

// ===========================
// APPLICATION DES ANIMATIONS AU CHARGEMENT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    // Appliquer shimmer au titre
    const title = document.querySelector('h1');
    if (title) {
        loadWithShimmer(title, () => {
            title.style.opacity = '1';
        }, 500);
    }
    
    // Appliquer shimmer à la barre de recherche
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        loadWithShimmer(searchContainer, () => {
            searchContainer.style.opacity = '1';
        }, 700);
    }
    
    // Appliquer shimmer aux boutons de filtre
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn, index) => {
        loadWithShimmer(btn, () => {
            btn.style.opacity = '1';
        }, 900 + (index * 100));
    });
    
    // Appliquer shimmer aux éléments de la liste
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item, index) => {
        loadWithShimmer(item, () => {
            item.style.opacity = '1';
        }, 1200 + (index * 100));
    });

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
    const searchInput = document.querySelector('.search-input');
    const clearBtn = document.querySelector('.search-clear');

    function updateClearButton() {
        if (!searchInput || !clearBtn) return;
        clearBtn.style.display = searchInput.value.trim() ? 'inline-flex' : 'none';
    }

    if (searchInput && clearBtn) {
        // initial
        updateClearButton();
        // montrer/masquer au fur et à mesure de la saisie
        searchInput.addEventListener('input', updateClearButton);
        // action du bouton : effacer, masquer, et repositionner le focus
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            updateClearButton();
            searchInput.focus();
            // éventuellement déclencher la logique de recherche/affichage ici
        });
    }
});