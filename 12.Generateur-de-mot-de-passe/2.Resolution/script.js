const charactersSets = {
  lowercaseChars: "abcdefghijklmnopqrstuvwxyz",
  uppercaseChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
}

const generatePwdBtn = document.querySelector('.pwd-generator__generate-pwd-btn');
const copyBtn = document.querySelector('.pwd-generator__copy-btn'); // Ajout du bouton de copie
const generatedPassword = document.querySelector('.pwd-generator__generated-pwd');
const checkboxes = document.querySelectorAll('.pwd-generator__checkbox');
const errorMsg = document.querySelector('.pwd-generator__error-msg');

const range = document.querySelector('.pwd-generator__range-input');
let passwordLength = range.value;

// Événements
generatePwdBtn.addEventListener('click', createPassword);
copyBtn.addEventListener('click', copyPasswordToClipboard); // Événement pour le bouton de copie

// ===========================
// FONCTION DE GÉNÉRATION DE MOT DE PASSE
// ===========================
function createPassword() {
  const checkedDataSets = getCheckedDataSets();
  // console.log(checkedDataSets);

  errorMsg.textContent = "";
  if (!checkedDataSets.length) {
    displayMessage("Au moins une case doit être cochée !", "error");
    return;
  }

  const requiredCharacters = [];

  for (let i = 0; i < checkedDataSets.length; i++) {
    requiredCharacters.push(checkedDataSets[i][getRandomIndex(0, checkedDataSets[i].length - 1)]);
  }
  // console.log(requiredCharacters);

  const concatenatedDataSets = checkedDataSets.reduce((acc, cur) => acc + cur);
  let password = "";
  for (let i = requiredCharacters.length; i < passwordLength; i++) {
    password += concatenatedDataSets[getRandomIndex(0, concatenatedDataSets.length - 1)];
  }
  // console.log(password);
  
  requiredCharacters.forEach((item, index) => {
    const randomIndex = getRandomIndex(0, password.length);
    password = password.slice(0, randomIndex) + requiredCharacters[index] + password.slice(randomIndex);
  });

  generatedPassword.textContent = password;
  displayMessage("Mot de passe généré avec succès !", "success");
}

// ===========================
// FONCTION DE COPIE DU MOT DE PASSE
// ===========================
function copyPasswordToClipboard() {
  // Récupérer le mot de passe affiché
  const password = generatedPassword.textContent.trim();
  
  // Vérifier qu'il y a un mot de passe à copier
  if (!password || password === '') {
    displayMessage('Aucun mot de passe à copier. Générez d\'abord un mot de passe.', 'error');
    return;
  }
  
  // Fonction fallback pour les navigateurs plus anciens
  function fallbackCopyToClipboard(text) {
    try {
      // Créer un élément textarea temporaire
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      
      document.body.appendChild(textarea);
      
      // Sélectionner et copier le texte
      textarea.select();
      textarea.setSelectionRange(0, 99999); // Pour mobile
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        displayMessage('Mot de passe copié dans le presse-papier !', 'success');
        animateCopyButton();
      } else {
        displayMessage('Impossible de copier le mot de passe', 'error');
      }
    } catch (err) {
      console.error('Erreur lors de la copie fallback:', err);
      displayMessage('Erreur lors de la copie du mot de passe', 'error');
    }
  }
  
  // Utiliser l'API Clipboard moderne si disponible
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(password)
      .then(() => {
        displayMessage('Mot de passe copié dans le presse-papier !', 'success');
        animateCopyButton();
      })
      .catch((err) => {
        console.error('Erreur API Clipboard:', err);
        // En cas d'échec, utiliser la méthode fallback
        fallbackCopyToClipboard(password);
      });
  } else {
    // Utiliser la méthode fallback pour les navigateurs plus anciens
    fallbackCopyToClipboard(password);
  }
}

// ===========================
// ANIMATION DU BOUTON COPIE
// ===========================
function animateCopyButton() {
  if (!copyBtn) return;
  
  // Animation de feedback visuel
  copyBtn.style.transform = 'scale(0.9)';
  copyBtn.style.transition = 'all 0.1s ease';
  
  // Retour à l'état normal après 150ms
  setTimeout(() => {
    copyBtn.style.transform = 'scale(1)';
  }, 150);
}

// ===========================
// FONCTION D'AFFICHAGE DES MESSAGES
// ===========================
function displayMessage(message, type = 'info') {
  if (!errorMsg) return;
  
  // Définir la couleur selon le type
  let color = '#333';
  if (type === 'error') {
    color = '#ff6b6b';
  } else if (type === 'success') {
    color = '#4CAF50';
  }
  
  // Afficher le message
  errorMsg.textContent = message;
  errorMsg.style.color = color;
  errorMsg.style.opacity = '1';
  errorMsg.style.fontWeight = 'bold';
  
  // Masquer automatiquement après 3 secondes
  setTimeout(() => {
    errorMsg.style.opacity = '0';
    
    // Vider le message après l'animation
    setTimeout(() => {
      errorMsg.textContent = '';
    }, 300);
  }, 3000);
}

// ===========================
// FONCTIONS UTILITAIRES EXISTANTES
// ===========================
function getCheckedDataSets() {
  const checkedSets = [];

  checkboxes.forEach(checkbox => checkbox.checked && checkedSets.push(charactersSets[checkbox.id]));

  return checkedSets;
}

function getRandomIndex(min, max) {
  /* 
  Si on veut créer un chiffre au hasard entre 0 et 3

  [0, 0.25[ → retourne 0

  [0.25, 0.5[ → retourne 1

  [0.5, 0.75[ → retourne 2

  [0.75, 1[ → retourne 3
  
  */
  const randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
  // console.log(randomNumber);
  // 4294967295 + 1
  const randomFloatingNumber = randomNumber / 4294967296;
  // console.log(randomFloatingNumber, Math.random());

  return Math.trunc(randomFloatingNumber * (max + 1));
}

// ===========================
// INITIALISATION
// ===========================
// Améliorer l'accessibilité du bouton de copie
if (copyBtn) {
  copyBtn.setAttribute('aria-label', 'Copier le mot de passe dans le presse-papier');
  copyBtn.setAttribute('title', 'Copier le mot de passe');
}