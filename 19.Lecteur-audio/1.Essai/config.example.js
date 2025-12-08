// ===========================
// CONFIGURATION API JAMENDO
// ===========================
// INSTRUCTIONS :
// 1. Copier ce fichier et le renommer en 'config.js'
// 2. Remplacer 'YOUR_CLIENT_ID_HERE' et 'YOUR_CLIENT_SECRET_HERE' par vos vraies clés API
// 3. Créer un compte sur https://developer.jamendo.com/v3.0 pour obtenir vos clés
// 4. NE JAMAIS committer le fichier config.js (il est exclu par .gitignore)

// Configuration pour l'API Jamendo (musique libre de droits)
const API_CONFIG = {
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
    CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',
    API_URL: 'https://api.jamendo.com/v3.0/tracks',
    LIMIT: 20, // Nombre de morceaux par requête
    TIMEOUT: 10000 // Timeout en millisecondes
};

// Export de la configuration (ne pas modifier cette ligne)
window.API_CONFIG = API_CONFIG;
