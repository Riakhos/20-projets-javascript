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
    // VALIDATION DU FORMULAIRE D'INSCRIPTION
    // ===========================
    
    // État de validation de chaque champ
    const inputsValidity = {
        username: false,
        email: false,
        password: false,
        repeatPassword: false
    };

    // Éléments DOM principaux
    const form = document.querySelector(".sign-up__form");
    const signUpContainer = document.querySelector(".sign-up");
    
    if (!form || !signUpContainer) {
        console.error("Éléments DOM non trouvés!");
        return;
    }
    
    // Écoute de la fin de l'animation pour nettoyer les classes CSS
    signUpContainer.addEventListener("animationend", handleSignUpFailAnimationEnd);
    
    // Variable pour éviter les animations multiples simultanées
    let isAnimating = false;
    
    /**
     * Fonction appelée à la fin de l'animation de secousse
     * Nettoie la classe CSS et réinitialise le flag d'animation
     */
    function handleSignUpFailAnimationEnd() {
        signUpContainer.classList.remove("js-shake-animation");
        isAnimating = false;
    }

    // Écoute de l'événement de soumission du formulaire
    form.addEventListener("submit", handleSignUpSubmit);

    /**
     * Fonction principale de gestion de la soumission du formulaire
     * Vérifie la validité de tous les champs et déclenche les actions appropriées
     * @param {Event} e - L'événement de soumission du formulaire
     */
    function handleSignUpSubmit(e) {
        e.preventDefault();

        const failedInputs = Object.values(inputsValidity).filter(value => !value);

        if (failedInputs.length && !isAnimating) {
            isAnimating = true;
            signUpContainer.classList.add("js-shake-animation");
            showValidation(Object.keys(inputsValidity).slice(0, -1));
        } else if (!failedInputs.length) {
            alert("Données envoyées avec succès.");
        }
    }

    
    /**
     * Fonction pour afficher la validation des champs
     * @param {Array} inputGroupNames - Noms des groupes d'inputs à valider
     */
    function showValidation(inputGroupNames) {
        inputGroupNames.forEach(inputGroupName => {
            const inputGroup = document.querySelector(`[data-inputGroupName="${inputGroupName}"]`);
            
            if (!inputGroup) {
                console.error(`Groupe ${inputGroupName} non trouvé!`);
                return;
            }
            
            const inputGroupIcon = inputGroup.querySelector(".sign-up__check-icon");
            const inputGroupValidationText = inputGroup.querySelector(".sign-up__error-msg");

            if (inputsValidity[inputGroupName]) {
                inputGroupIcon.style.display = "inline";
                inputGroupIcon.src = "ressources/check.svg";
                inputGroupValidationText.style.display = "none";
            } else {
                inputGroupIcon.style.display = "inline";
                inputGroupIcon.src = "ressources/error.svg";
                inputGroupValidationText.style.display = "block";
            }
        });
    }

    // ===========================
    // VALIDATION CHAMPS INDIVIDUELS
    // ===========================

    // USERNAME - minimum 3 caractères
    const userInput = document.querySelector(".js-username-input");
    // Ajout des écouteurs d'événements pour la validation du nom d'utilisateur
    userInput.addEventListener("blur", usernameValidation);
    userInput.addEventListener("input", usernameValidation);

    /**
     * Fonction de validation du nom d'utilisateur
     */
    function usernameValidation() {
        if (userInput.value.trim().length >= 3) {
            inputsValidity.username = true;
            showValidation(["username"])
        } else {
            inputsValidity.username = false;
            showValidation(["username"])
        }
    }

    // EMAIL - format valide
    const emailInput = document.querySelector(".js-email-input");
    // Ajout des écouteurs d'événements pour la validation de l'email
    emailInput.addEventListener("blur", emailValidation);
    emailInput.addEventListener("input", emailValidation);
    
    // Expression régulière pour valider le format de l'email
    const regexEmail = /^[a-zA-ZÀ-ÿ0-9_]+([.-]?[a-zA-ZÀ-ÿ0-9_]+)*@[a-zA-ZÀ-ÿ0-9_]+([.-]?[a-zA-ZÀ-ÿ0-9_]+)*(\.[a-zA-ZÀ-ÿ]{2,})+$/

    /**
     * Fonction de validation de l'email
     * Vérifie si l'email est au format valide
     */
    function emailValidation() {
        if (regexEmail.test(emailInput.value)) {
            inputsValidity.email = true;
            showValidation(["email"])
        } else {
            inputsValidity.email = false;
            showValidation(["email"])
        }
    }

    // PASSWORD - 6 caractères min + symbole + chiffre
    const pswInput = document.querySelector(".js-password-input");

    // Ajout des écouteurs d'événements pour la validation du mot de passe
    pswInput.addEventListener("blur", passwordValidation)
    pswInput.addEventListener("input", passwordValidation)
    
    // Objet pour stocker les critères de validation du mot de passe
    const passwordVerification = {
        length: false,
        symbol: false,
        number: false,
        uppercase: false,
        lowercase: false
    }

    // Liste des expressions régulières pour les critères de sécurité
    const regexList = {
        symbol: /[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
        number: /[0-9]/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/
    }

    // Icône de confirmation du mot de passe
    const confirmPasswordIcon = document.querySelector(".js-repeat-psw-check-icon")

    // Variable pour stocker la valeur du mot de passe
    let passwordValue

    /**
     * Fonction de validation du mot de passe
     */
    function passwordValidation() {

        // Récupère la valeur du mot de passe et supprime les espaces
        passwordValue = pswInput.value.trim()

        // Vérifie la longueur du mot de passe
        if (passwordValue.length < 6) {
            passwordVerification.length = false
        } else {
            passwordVerification.length = true
        }

        // Vérifie les critères de sécurité du mot de passe
        for (const regexValidation in regexList) {

            // Vérifie si le mot de passe contient un symbole
            if (regexList[regexValidation].test(passwordValue)) {
                passwordVerification[regexValidation] = true
            } else {
                passwordVerification[regexValidation] = false
            }
        }

        // Si un des critères de sécurité n'est pas respecté
        if (Object.values(passwordVerification).filter(val => !val).length) {
            inputsValidity.password = false
            showValidation(["password"])
        } else {
            inputsValidity.password = true
            showValidation(["password"])
        }

        // Si l'icône de confirmation est visible, on valide la confirmation du mot de passe
        if (confirmPasswordIcon.style.display === "inline") {
            confirmPassword()
        }
    }

    // CONFIRMATION DU MOT DE PASSE
    const confirmInput = document.querySelector(".js-password-confirmation");
    // Sélection du champ de saisie pour la confirmation du mot de passe
    confirmInput.addEventListener("blur", confirmPassword);
    confirmInput.addEventListener("input", confirmPassword);

    /**
     * Fonction de validation de la confirmation du mot de passe
     * Vérifie si le mot de passe confirmé correspond au mot de passe principal
     */
    function confirmPassword() {
        const confirmedValue = confirmInput.value;

        // Si le champ de confirmation est vide et que le mot de passe principal est vide
        if (!confirmedValue && !passwordValue) {
            const confirmPasswordGroup = document.querySelector('[data-inputGroupName="repeatPassword"]')
            confirmPasswordGroup.querySelector(".sign-up__check-icon").style.display = "none"
            confirmPasswordGroup.querySelector(".sign-up__error-msg").style.display = "none"
            return
        }

        // Si le mot de passe confirmé ne correspond pas au mot de passe principal
        if (confirmedValue !== passwordValue) {
            inputsValidity.repeatPassword = false
            showValidation(["repeatPassword"])
        } else {
            inputsValidity.repeatPassword = true
            showValidation(["repeatPassword"])
        }
    }
});