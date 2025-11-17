# 🖼️ Application Scroll Infini - Unsplash API

## 🚀 Configuration rapide

### 1. Configuration de la clé API

1. **Créez un compte Unsplash Developer** :
   - Allez sur [https://unsplash.com/developers](https://unsplash.com/developers)
   - Créez un compte gratuit
   - Créez une nouvelle application

2. **Configurez votre clé API** :
   ```bash
   # Copiez le fichier d'exemple
   cp config.example.js config.js
   ```
   
3. **Éditez le fichier config.js** :
   - Ouvrez `config.js`
   - Remplacez `YOUR_API_KEY_HERE` par votre vraie clé API
   - Sauvegardez le fichier

### 2. Structure des fichiers

```
scroll-infini/
├── index.html          # Page principale
├── style.css           # Styles CSS
├── script.js           # JavaScript principal
├── config.js           # ⚠️ Votre clé API (non committé)
├── config.example.js   # Exemple de configuration
├── .gitignore          # Fichiers à ignorer par Git
└── README.md           # Ce fichier
```

## 🔒 Sécurité

- ✅ **config.js** est automatiquement exclu de Git
- ✅ Votre clé API reste privée
- ✅ **config.example.js** peut être partagé en toute sécurité

## 🛠️ Fonctionnalités

- **Scroll infini** avec Intersection Observer
- **Recherche d'images** en temps réel
- **Loader animé** pendant les requêtes
- **Gestion d'erreurs** complète
- **Bouton scroll to top** avec animation
- **Design responsive** et moderne

## 🚨 Dépannage

### Erreur "Fichier config.js manquant"
1. Vérifiez que `config.js` existe
2. Vérifiez que le script est inclus dans `index.html` avant `script.js`

### Erreur "Clé API non configurée"
1. Ouvrez `config.js`
2. Remplacez `YOUR_API_KEY_HERE` par votre vraie clé
3. Rechargez la page

### Erreur 401 (Unauthorized)
- Votre clé API est invalide ou expirée
- Vérifiez votre clé sur [Unsplash Developer](https://unsplash.com/developers)

### Erreur 403 (Rate Limit)
- Vous avez atteint la limite de requêtes (50/heure en démo)
- Attendez 1 heure ou upgrader votre compte Unsplash

## 📚 API Unsplash

- **Limite démo** : 50 requêtes/heure
- **Documentation** : [https://unsplash.com/documentation](https://unsplash.com/documentation)
- **Rate limits** : [https://unsplash.com/documentation#rate-limiting](https://unsplash.com/documentation#rate-limiting)

## 🎯 Prochaines étapes

Maintenant que la configuration est prête, vous pouvez :
1. Implémenter les fonctions JavaScript étape par étape
2. Tester chaque fonctionnalité
3. Personnaliser le design selon vos besoins
