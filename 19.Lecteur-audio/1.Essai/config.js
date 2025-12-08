// ===========================
// CONFIGURATION API JAMENDO
// ===========================
// ATTENTION : Ce fichier ne doit JAMAIS être committé sur Git !
// Il est exclu par le fichier .gitignore

// Configuration pour l'API Jamendo (musique libre de droits)
// 1. Compte créé sur https://developer.jamendo.com/v3.0
// 2. Application: "Haridou's App"
// 3. Client ID et Secret récupérés depuis le dashboard
const API_CONFIG = {
    CLIENT_ID: 'd416b964',
    CLIENT_SECRET: '17f183484c9ff7914df66d499d39c69b',
    API_URL: 'https://api.jamendo.com/v3.0/tracks',
    LIMIT: 20, // Nombre de morceaux par requête
    TIMEOUT: 10000 // Timeout en millisecondes
};

// Export de la configuration (ne pas modifier cette ligne)
window.API_CONFIG = API_CONFIG;
