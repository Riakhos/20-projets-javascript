// JavaScript pour la navigation et les modals

// Variables globales pour éviter les doublons
let modalOverlay = null;
let currentModal = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
});

// Initialisation de la navigation (burger menu)
function initializeNavigation() {
    const burgerBtn = document.querySelector('.burger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const burgerLines = document.querySelectorAll('.burger-line');
    
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('open');
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Fermer le menu en cliquant sur les liens (mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
    }
    
    function openMenu() {
        navMenu.classList.add('open');
        burgerLines.forEach((line, index) => {
            if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) line.style.opacity = '0';
            if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        });
    }
    
    function closeMenu() {
        navMenu.classList.remove('open');
        burgerLines.forEach(line => {
            line.style.transform = '';
            line.style.opacity = '';
        });
    }
}

// Initialisation des modals
function initializeModals() {
    const groupToggles = document.querySelectorAll('.group-toggle');
    
    groupToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetGroup = this.getAttribute('data-target');
            showModal(targetGroup, this.textContent.trim());
        });
    });
    
    // Fermeture par touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeModal();
        }
    });
}

// Afficher une modal
function showModal(targetGroup, groupTitle) {
    // Créer l'overlay s'il n'existe pas
    if (!modalOverlay) {
        createModalOverlay();
    }
    
    // Créer ou réutiliser la modal
    if (!currentModal) {
        createModal();
    }
    
    // Mettre à jour le contenu de la modal
    updateModalContent(targetGroup, groupTitle);
    
    // Afficher la modal
    modalOverlay.style.display = 'flex';
    currentModal.style.display = 'block';
    
    // Force l'affichage avec un délai pour l'animation
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalOverlay.style.visibility = 'visible';
        currentModal.style.opacity = '1';
        currentModal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

// Créer l'overlay modal
function createModalOverlay() {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    document.body.appendChild(modalOverlay);
}

// Créer la modal
function createModal() {
    currentModal = document.createElement('div');
    currentModal.className = 'modal';
    
    // Ajouter le bouton de fermeture
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeModal);
    currentModal.appendChild(closeBtn);
    
    // Ajouter le titre
    const title = document.createElement('h3');
    title.className = 'modal-title';
    currentModal.appendChild(title);
    
    // Ajouter le contenu
    const content = document.createElement('div');
    content.className = 'modal-content';
    currentModal.appendChild(content);
    
    modalOverlay.appendChild(currentModal);
}

// Mettre à jour le contenu de la modal
function updateModalContent(targetGroup, groupTitle) {
    const title = currentModal.querySelector('.modal-title');
    const content = currentModal.querySelector('.modal-content');
    
    title.textContent = groupTitle;
    
    const groupElement = document.querySelector(`.project-group[data-group="${targetGroup}"]`);
    if (groupElement) {
        content.innerHTML = groupElement.innerHTML;
    }
}

// Fermer la modal
function closeModal() {
    if (modalOverlay && currentModal) {
        modalOverlay.style.opacity = '0';
        modalOverlay.style.visibility = 'hidden';
        currentModal.style.opacity = '0';
        currentModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            currentModal.style.display = 'none';
        }, 300);
    }
}