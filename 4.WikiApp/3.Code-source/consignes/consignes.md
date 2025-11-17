# Coder une recherche Wikipedia

> ctrl+shift+v pour afficher ce fichier markdown sur VS Code

### Objectif du projet 🎯

Le but de ce projet est de coder un **système de recherche** grâce à l'**API REST publique de Wikipedia**.<br>
L'utilisateur peut effectuer une recherche et voir s'afficher des résultats sur lesquels il pourra **cliquer** s'il veut se déplacer sur la **page de l'article en question**. <br>

### Critères à respecter 📋

- Performance
- Maintenabilité
- Code simple et facile à comprendre
- Flexibilité
- Compatibilité
- Accessibilité

### Compétences développées 💪

- Faire un appel à une API REST et exploiter les données reçues
- Afficher un loader
- Afficher des messages d'erreur
- Mettre en page des données reçues depuis une API
- Manipuler le DOM en JavaScript

### A. Coder une interface basique

> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.

### B. Fonctionnalités JavaScript à coder pour ce projet

1. Récupérer les **données entrées dans l'input** en JavaScript.
2. Utiliser **l'API de Wikipedia** afin d'obtenir les résultats de cette recherche.<br>
   Je vous donne **l’URL de la route à utiliser** pour obtenir les données car c'est un des premiers projets et que la doc n'est pas très claire :

https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}

- Utilisez l'API à l'aide de la **méthode fetch()** en y incluant le **contenu de la recherche au niveau** de **${searchInput}** dans l'URL ci-dessus.

3. Ajouter un **loader** pendant le chargement.
4. **Afficher les résultats** en dessous de l'input.
5. Faire en sorte qu'on puisse **effectuer autant de recherches qu'on le souhaite à la suite** en répétant le processus.
6. Bonus : Gérer les **erreurs possibles** avec la méthode **fetch()**

### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.
