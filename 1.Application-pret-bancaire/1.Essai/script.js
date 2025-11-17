// ===========================
// DONNÉES ET FONCTIONS GLOBALES
// ===========================

const loanData = {
    amount: 10000,
    repayment: 42,
    rate: 7
}

// Variables globales pour les éléments (initialisées dans DOMContentLoaded)
let loanAmountLabel, repaymentLabel, totalPaymentTxt, perMonthPaymentTxt, totalInterestTxt;

// Fonction pour mettre à jour la barre de progression
function updateRangeProgress(input) {
    const value = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.background = `linear-gradient(to right, #f7df1e 0%, #f7df1e ${value}%, #555 ${value}%, #555 100%)`;
}

// Fonction pour gérer les changements de valeur des entrées de type range
function handleRangeChange(e) {
    const inputValue = Number(e.target.value)

    // Mettre à jour la barre de progression
    updateRangeProgress(e.target)

    if (e.target.id === "loan-amount") {
        loanAmountLabel.textContent = `${inputValue.toLocaleString()}€`
        loanData.amount = inputValue
    } else if (e.target.id === "repayment") {
        repaymentLabel.textContent = `${inputValue}`
        loanData.repayment = inputValue
    }

    displayLoanInformation()
}

// Fonction pour afficher les informations du prêt
function displayLoanInformation() {
    const totalPayment = loanData.amount + (loanData.amount * loanData.rate / 100)
    const perMonthPayment = totalPayment / loanData.repayment
    const totalInterest = totalPayment - loanData.amount

    totalPaymentTxt.textContent = `${Math.trunc(totalPayment).toLocaleString()}€`
    perMonthPaymentTxt.textContent = `${Math.trunc(perMonthPayment).toLocaleString()}€`
    totalInterestTxt.textContent = `${Math.trunc(totalInterest).toLocaleString()}€`
}

// Fonction d'initialisation pour les barres de progression
function initializeRangeInputs() {
    const rangeInputs = document.querySelectorAll(".loan-app__range-input");
    
    rangeInputs.forEach(input => {
        // Définir les valeurs par défaut
        if (input.id === "loan-amount") {
            input.value = loanData.amount;
        } else if (input.id === "repayment") {
            input.value = loanData.repayment;
        }
        
        // Mettre à jour la barre de progression
        updateRangeProgress(input);
        
        // Ajouter l'événement input
        input.addEventListener("input", handleRangeChange);
    });
}

// JavaScript pour la navigation (fonction utilitaire)
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('open');
}

// ===========================
// INITIALISATION PRINCIPALE
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================
    // INITIALISATION DES ÉLÉMENTS DOM
    // ===========================
    // Sélection des éléments pour afficher les informations du prêt
    loanAmountLabel = document.querySelector(".js-loan-amount");
    repaymentLabel = document.querySelector(".js-repayment-duration");
    totalPaymentTxt = document.querySelector(".js-total-value");
    perMonthPaymentTxt = document.querySelector(".js-monthly-payment");
    totalInterestTxt = document.querySelector(".js-total-interest");
    
    // ===========================
    // INITIALISATION DES SLIDERS
    // ===========================
    initializeRangeInputs();
    displayLoanInformation(); // Calcul initial
    
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
});