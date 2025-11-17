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
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // joueur courant
    let currentPlayer = 'X';

    // éléments d'interface
    const currentPlayerEl = document.querySelector('.tictactoe__current-player'); // strong
    const statusTitleEl = document.querySelector('.tictactoe__info-game-title'); // message principal
    const cellsContainer = document.querySelector('.tictactoe__cells-container');
    const cells = Array.from(document.querySelectorAll('.tictactoe__cell'));
    const resetBtn = document.querySelector('.tictactoe__reset-btn');

    // état du jeu
    let gameIsLocked = false;

    // initialisation affichage
    if (currentPlayerEl) currentPlayerEl.textContent = currentPlayer;
    if (statusTitleEl) statusTitleEl.textContent = 'Match en cours.';

    // écouteurs
    if (cellsContainer) cellsContainer.addEventListener('click', handleTry);
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    // support clavier (Entrée / Espace) sur les cellules
    cells.forEach(cell => {
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cell.click();
        }
      });
    });

    // Gestion globale du clavier :
    // - Si une case est focalisée, on laisse le handler local la gérer (Enter/Space jouent la case).
    // - Si le focus est sur un contrôle (input/textarea/button/select), on ne fait rien.
    // - Sinon, Enter ou Espace déclenchent resetGame() (réinitialisation du design et de la grille).
    document.addEventListener('keydown', (e) => {
      const k = e.key;
      const isActivation = k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'Space';
      if (!isActivation) return;

      const active = document.activeElement;
      const tag = active && active.tagName ? active.tagName.toUpperCase() : null;
      const isFormControl = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'SELECT';
      const isCellFocused = active && active.classList && active.classList.contains('tictactoe__cell');

      // If a cell is focused, let its own handler manage Enter/Space (play the cell)
      if (isCellFocused) return;
      // If user is typing / focused on a control, do nothing
      if (isFormControl) return;

      // Otherwise, treat Enter/Space as "reset the game"
      e.preventDefault();
      resetGame();
    });
    
    /**
     * Gère la tentative de jouer dans une cellule.
     * @param {MouseEvent} e - événement de clic.
     */
    function handleTry(e) {
        if (gameIsLocked) return;

        // récupérer la cellule la plus proche du clic
        const cell = e.target.closest('.tictactoe__cell');
        if (!cell || !cellsContainer.contains(cell)) return;

        const boxIndex = Number(cell.getAttribute('data-index'));

        if (Number.isNaN(boxIndex)) return;

        // case déjà remplie ?
        if (cells[boxIndex].textContent.trim() !== '') return;

        // poser le symbole et style
        cells[boxIndex].textContent = currentPlayer;
        cells[boxIndex].classList.remove('x','o','win');
        cells[boxIndex].classList.add(currentPlayer === 'X' ? 'x' : 'o');

        // vérifier la fin de partie
        checkForGameEnd();
    }

    /**
     * Vérifie si la partie est terminée (victoire ou match nul),
     * met à jour l'UI et verrouille le jeu si nécessaire.
     */
    function checkForGameEnd() {
        // vérifier victoire
        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            const vA = cells[a].textContent.trim();
            const vB = cells[b].textContent.trim();
            const vC = cells[c].textContent.trim();

            if (vA && vA === vB && vA === vC) {
                // victoire
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                gameIsLocked = true;
                if (statusTitleEl) statusTitleEl.textContent = `${vA} a gagné !`;
                if (currentPlayerEl) currentPlayerEl.textContent = vA;
                return;
            }
        }

        // match nul ?
        const isDraw = cells.every(cell => cell.textContent.trim() !== '');
        if (isDraw) {
            gameIsLocked = true;
            if (statusTitleEl) statusTitleEl.textContent = `Match nul`;
            return;
        }

        // sinon : changer de joueur
        switchPlayer();
    }

    /**
     * Change le joueur courant et met à jour l'affichage.
     */
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayerEl) currentPlayerEl.textContent = currentPlayer;
        if (statusTitleEl) statusTitleEl.textContent = `Au tour de ${currentPlayer}`;
    }

    /**
     * Réinitialise la grille pour une nouvelle partie.
     */
    function resetGame() {
        cells.forEach(c => {
            c.textContent = '';
            c.classList.remove('x','o','win');
        });
        currentPlayer = 'X';
        gameIsLocked = false;
        if (currentPlayerEl) currentPlayerEl.textContent = currentPlayer;
        if (statusTitleEl) statusTitleEl.textContent = 'Match en cours.';
    }
});