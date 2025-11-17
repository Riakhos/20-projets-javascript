# Jeu du morpion
>ctrl+shift+v pour afficher ce fichier markdown sur VS Code

### Objectif du projet 🎯

Le fameux **jeu du morpion** consiste à **aligner 3 croix(X) ou ronds(O)** afin de gagner la partie, à vous de jouer !

### Critères à respecter 📋
- Performance  
- Maintenabilité  
- Code simple et facile à comprendre  
- Flexibilité  
- Compatibilité  
- Accessibilité
  
### Compétences développées 💪
- Créer un mini-jeu en JavaScript
- Gérer les événements en JavaScript
- Manipuler le DOM de manière efficace
- Implémenter une bonne expérience utilisateur
- Structurer son code selon de bonnes pratiques


### A. Coder une interface basique
> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.

### B. Fonctionnalités JavaScript à coder pour ce projet

1. **Dessiner un X ou un O** lorsqu'on clique sur une cellule du Morpion.
2. Changer le texte pour informer les joueurs du **tour en cours**. (Au tour de X ou O)
3. À chaque clic, exécuter une fonction qui sert à **vérifier si la partie est finie, ou pas**.

- Pour ce faire, analyser le tableau de bonnes combinaisons fourni et **tenter de trouver si une bonne combinaison a été dessinée à chaque clic**.
- **Les chiffres dans "winningCombinations" correspondent aux index des potentielles combinaisons gagnantes**. <br>
Exemple : si X (ou O) est à l'index 0, 1, 2, c'est gagné.<br>
Vous n'avez plus qu'à **vérifier les combinaisons** une à une en fonction des cases cochées.
1. Si une bonne **combinaison est présente**, informer les joueurs **et proposer une nouvelle partie en appuyant sur la barre d'espace**, sinon, afficher un match nul.


### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.
