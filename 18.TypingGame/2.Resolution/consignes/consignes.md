# Coder un jeu de vitesse de frappe
>ctrl+shift+v pour afficher ce fichier markdown sur VS Code

### Objectif du projet 🎯

Le but de ce projet est de **coder un jeu de vitesse de frappe** dans lequel l'utilisateur tentera d'écrire un **maximum de caractères en soixante secondes.**

### Critères à respecter 📋
- Performance  
- Maintenabilité  
- Code simple et facile à comprendre  
- Flexibilité  
- Compatibilité  
- Accessibilité
  
### Compétences développées 💪
- Coder un jeu en JavaScript
- Gérer un compte à rebours / chrono en JavaScript
- Gérer des évènements en JavaScript
- Manipuler le DOM


### A. Coder une interface basique
> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.

### B. Fonctionnalités JavaScript à coder pour ce projet

1. **Afficher la première phrase** du tableau importé "phrases" en dessous du textarea.
2. Faire en sorte de **comparer** ce que l'on écrit dans le textarea en fonction de la phrase affichée à écrire.
Si le caractère écrit dans le textarea correspond au caractère à écrire dans la phrase affichée, il faut le **surligner en vert** au niveau de la phrase à écrire, sinon, le **surligner en rouge**.
1. Une fois qu'une phrase à écrire est **complètement verte**, **afficher la phrase suivante** du tableau. Si l'utilisateur a écrit toutes les phrases, **revenir à la première phrase.**
2. **Incrémenter le score** lors de l'écriture de chaque caractère identique à celui de la phrase à écrire. **Décrémenter** le score dans le cas contraire.
3. Mettre en place un chrono de **soixante secondes**.
4. À la fin du chrono, afficher `Bravo, votre score est ${score}`
5. Enfin, mettre en place un **reset** de la partie à l'aide du raccourci clavier : **ctrl + alt + enter**
Ce raccourci doit tout remettre à zéro et permettre de recommencer depuis le début.


### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.
