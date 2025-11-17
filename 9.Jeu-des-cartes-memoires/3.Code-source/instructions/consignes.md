# Jeu des cartes mémoire

> ctrl+shift+v pour afficher ce fichier markdown sur VS Code

Ce défi consiste à coder **le fameux jeu des cartes mémoire**.<br>
Le but est de pouvoir **cliquer** sur les cartes afin d'apercevoir **l'icône** qu'elles contiennent, puis de retrouver des **paires d’icônes identiques**.<br>
Le score représente **le nombre de coups tentés**.

### Critères à respecter 📋

- Performance
- Maintenabilité
- Code simple et facile à comprendre
- Flexibilité
- Compatibilité
- Accessibilité

### Compétences développées 💪

- Gérer une opération aléatoire en JavaScript via le mélange des cartes
- Créer un mini-jeu
- Manipuler des tableaux et des objets
- setTimeout()
- Utiliser la perspective en CSS
- Évènements JavaScript
- Manipuler le DOM
- Etc ...

### A. Coder une interface basique
> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.

### B. Fonctionnalités JavaScript à coder pour ce projet

1. **Créer et placer les cartes dans un ordre aléatoire** via JavaScript à chaque fois qu'on arrive sur la page ou lorsqu'on appuie sur la **barre d’espace**.
2. L’utilisateur doit pouvoir cliquer sur deux cartes qui **pivotent à 180° au clic**.<br>Lorsque les deux cartes sont visibles, il faut **vérifier leur contenu** puis au choix :

- Les laisser **visibles** si c'est une **paire**.
- Les **cacher à nouveau**.

1. Lorsqu'un coup est tenté, **incrémenter le nombre d'essais**.
2. Lorsque **toutes** les paires sont trouvées, c'est **gagné**, proposer de **recommencer la partie en appuyant sur la barre d’espace.**

### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.