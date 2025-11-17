# Coder une application météo ☀️

> ctrl+shift+v pour afficher ce fichier markdown sur VS Code

### Objectif du projet 🎯

Le but de ce projet consiste à **afficher les données météo comme si elles provenaient d'une API**.

Pour des raisons pratiques, un fichier contenant les données à afficher a été créé dans **/weatherAPI/weatherData.json**.
Cela nous permet de ne pas utiliser une API météo dont les politiques de **tarification changent souvent**, en simulant le comportement d’un véritable appel à une API.

Une fois les données **récupérées**, vous n'aurez plus qu'à les afficher sur **l'interface de la page**.

### Critères à respecter 📋

- Performance
- Maintenabilité
- Code simple et facile à comprendre
- Flexibilité
- Compatibilité
- Accessibilité

### Compétences développées 💪

- Utiliser fetch() en mimant un appel vers une API
- Afficher des données dans une interface
- Manipuler le DOM

### A. Coder une interface basique

> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.

### B. Fonctionnalités JavaScript à coder pour ce projet

1. Faire un **appel** vers le **fichier** **/weatherAPI/weatherData.json** pour récupérer les données météo. Cela permet d’éviter les changements de tarification fréquents des APIs météo tout en simulant une **API REST**.
2. Gérer les erreurs pouvant survenir lors de la récupération des données en affichant **un message générique sur l'interface**.
3. Afficher un loader **par défaut**, et le retirer quand les **données sont reçues**, ou quand une **erreur a lieu**.
4. **Afficher les données** reçues dans l'interface.



### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.
