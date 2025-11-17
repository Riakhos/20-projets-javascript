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
    // GESTION DE L'APPLICATION COOKIES
    // ===========================
    
    // Sélection de tous les champs de saisie du formulaire
    const inputs = document.querySelectorAll('.cookies-app__input')

    // Ajout des écouteurs d'événements pour la validation des champs
    inputs.forEach(input => {
        // Gestion du message d'erreur personnalisé lors de la validation
        input.addEventListener('invalid', handleInvalidInput)
        // Réinitialisation du message d'erreur lors de la saisie
        input.addEventListener('input', handleResetInputCustomValidity)
    })

    // Fonction pour définir un message d'erreur personnalisé
    function handleInvalidInput(e) {
        e.target.setCustomValidity("Veuillez remplir ce champ")
    }

    // Fonction pour effacer le message d'erreur personnalisé
    function handleResetInputCustomValidity(e) {
        e.target.setCustomValidity("")
    }

    // Sélection du formulaire et ajout de l'écouteur pour la soumission
    const cookieForm = document.querySelector(".cookies-app__form")
    cookieForm.addEventListener("submit", handleCookieForm)

    // Fonction de gestion de la soumission du formulaire
    function handleCookieForm(e) {
        e.preventDefault() // Empêche le comportement par défaut du formulaire
        
        createCookie() // Crée le cookie avec les données saisies
        cookieForm.reset() // Remet à zéro les champs du formulaire
    }

    // Sélection de la liste où afficher les cookies
    const cookiesList = document.querySelector(".cookies-app__list")

    // Fonction principale pour créer un cookie
    function createCookie() {
        
        // Création d'un objet pour stocker les données du cookie
        const newCookie = {}
        inputs.forEach(input => {
            const nameAttribute = input.getAttribute("name")
            newCookie[nameAttribute] = input.value.trim()
        })
        
        // Récupération et formatage des cookies existants
        const cookiesArray = document.cookie.replace(/\s/g, "").split(";")
        // Vérification si un cookie avec le même nom existe déjà
        const alreadyExistingCookie = cookiesArray.find(cookie => decodeURIComponent(cookie.split("=")[0]) === newCookie.name)

        if(alreadyExistingCookie) {
            // Si le cookie existe déjà, on le modifie
            createToast({name: newCookie.name, state: "modifié", color: "royalblue"})

            // Mise à jour de l'affichage du cookie existant
            const modifiedCookie = document.querySelector(`[data-cookie=${newCookie.name}]`)
            modifiedCookie.querySelector(".cookies-app__cookie-value").textContent = `Valeur : ${newCookie.value}`
        } else {
            // Si c'est un nouveau cookie, on l'ajoute à la liste
            createToast({name: newCookie.name, state: "créé", color: "green"})

            // Ajout du nouveau cookie à l'affichage
            if(!cookiesList.children.length === 0) {
                cookiesList.appendChild(createCookieListItem(`${newCookie.name}=${newCookie.value}`))
            } else {
                // Insertion en première position si la liste n'est pas vide
                cookiesList.insertBefore(
                    createCookieListItem(`${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)}`),
                    cookiesList.firstChild
                )
            }
        }

        // Enregistrement du cookie dans le navigateur avec une expiration de 7 jours
        document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)}; path=/; expires=${getCookieExpiration(7)}`
    }

    // Fonction pour créer un élément de liste représentant un cookie
    function createCookieListItem(cookie) {

        // Séparation du nom et de la valeur du cookie
        const formatCookie = cookie.split("=")
        
        // Création de l'élément <li> pour le cookie
        const cookieListItem = document.createElement("li")
        cookieListItem.className = 'cookies-app__cookie'
        cookieListItem.setAttribute("data-cookie", decodeURIComponent(formatCookie[0]))

        // Création de la structure HTML du cookie
        cookieListItem.innerHTML = `
            <p class="cookies-app__cookie-name"></p>
            <p class="cookies-app__cookie-value"></p>
            <button class="cookies-app__cookie-button">X</button>
        `
        
        // Remplissage des données décodées
        cookieListItem.querySelector(".cookies-app__cookie-name").textContent = `Nom : ${decodeURIComponent(formatCookie[0])}`
        cookieListItem.querySelector(".cookies-app__cookie-value").textContent = `Valeur : ${decodeURIComponent(formatCookie[1])}`

        // Ajout de l'écouteur pour le bouton de suppression
        cookieListItem.querySelector(".cookies-app__cookie-button").addEventListener("click", handleDeleteCookie)

        // Fonction de suppression d'un cookie
        function handleDeleteCookie(e) {
            // Affichage d'une notification de suppression
            createToast({name: formatCookie[0], state: "supprimé", color: "crimson"})

            // Suppression du cookie du navigateur en définissant une date d'expiration passée
            document.cookie = `${encodeURIComponent(formatCookie[0])}=; expires=${new Date(0)}; path=/`
            // Suppression de l'élément de l'affichage
            e.target.closest(".cookies-app__cookie").remove()
        }

        return cookieListItem
    }

    // Fonction utilitaire pour calculer la date d'expiration d'un cookie
    function getCookieExpiration(days) {
        // Calcul de la date d'expiration en ajoutant le nombre de jours spécifié
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    }

    // Sélection du conteneur pour les notifications toast
    const toastsContainer = document.querySelector(".toasts")

    // Fonction pour créer et afficher une notification toast
    function createToast({ name, state, color }) {
        // Création de l'élément toast
        const toast = document.createElement("div")
        toast.className = "toast"
        toast.innerHTML = "<p class='toast__name'></p>" // Correction de la balise fermante
        
        // Définition du message et du style de la notification
        toast.querySelector(".toast__name").textContent = `Cookie ${name} ${state}`
        toast.style.backgroundColor = color
        
        // Ajout de la notification au conteneur
        toastsContainer.appendChild(toast)

        // Suppression automatique de la notification après 2.5 secondes
        setTimeout(() => {
            toast.remove()
        }, 2500)
    }

    // Fonction pour afficher les cookies existants au chargement de la page
    function displayCookies() {
        // Vérification s'il y a des cookies existants
        if (document.cookie) {
            // Utilisation d'un fragment pour optimiser les performances DOM
            const fragment = document.createDocumentFragment()

            // Récupération et formatage des cookies (ordre inverse pour affichage chronologique)
            const cookies = document.cookie.replace(/\s/g, "").split(";").reverse()
            
            // Création d'un élément de liste pour chaque cookie
            cookies.forEach(cookie => {
                fragment.appendChild(createCookieListItem(cookie))
            })
            
            // Ajout de tous les cookies à la liste en une seule opération
            cookiesList.appendChild(fragment)
        }
    }
    
    // Initialisation : affichage des cookies existants au chargement
    displayCookies()
})
