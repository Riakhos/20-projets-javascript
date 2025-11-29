// ===========================
// CONFIGURATION API UNSPLASH
// ===========================
// ATTENTION : Ce fichier ne doit JAMAIS être committé sur Git !
// Il est exclu par le fichier .gitignore

// TODO: Remplacez 'YOUR_API_KEY_HERE' par votre vraie clé API Unsplash
// 1. Créez un compte gratuit sur https://unsplash.com/developers
// 2. Créez une nouvelle application
// 3. Copiez votre "Access Key" ici
const API_CONFIG = {
    API_KEY: 'qte00mItbA7FO_cTNhW4pMajhEoEHJ6WcDyi4eAUMcI',
    API_URL: 'https://api.unsplash.com/search/photos',
    PER_PAGE: 30, // Nombre d'images par page
    TIMEOUT: 10000 // Timeout en millisecondes
};

// Export de la configuration (ne pas modifier cette ligne)
window.API_CONFIG = API_CONFIG;
