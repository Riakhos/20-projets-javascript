# Validation de données côté Front ✨

>ctrl+shift+v pour afficher ce fichier markdown sur VS Code

### Objectif du projet 🎯

**Valider les données** côté **Front** permet de guider les utilisateurs et augmente **drastiquement** le taux de remplissage et d'envoi des **formulaires**.

**Attention, il faut toujours valider les données côté serveur en plus d'une potentielle validation Front**.En effet, n'importe qui peut passer outre un formulaire côté client et envoyer directement les données vers un serveur, esquivant ainsi la "validation front".

Ceci étant dit, la validation côté front est souvent **bâclée** ou mal **mise en place**, ce qui fait bêtement chuter le potentiel **succès** d'un site.

Votre défi est de valider chaque input dans les règles de l'art, afin de proposer une bonne **expérience utilisateur**, avant d'autoriser **l'envoi du formulaire.**

### Critères à respecter 📋
- Performance  
- Maintenabilité  
- Code simple et facile à comprendre  
- Flexibilité  
- Compatibilité  
- Accessibilité

### Compétences développées 💪

- Validation côté client
- Manipuler un formulaire et ses inputs en JavaScript
- Créer une bonne expérience utilisateur
- Gérer des évènements en JavaScript
- Manipuler le DOM


### A. Coder une interface basique
> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.


### B. Fonctionnalités JavaScript à coder pour ce projet

1. Le formulaire ne doit **pas pouvoir être envoyé** si les inputs n'ont pas passé toutes les validations, imaginez mentalement un système qui pourra globalement **gérer tout ça**.
2. Le premier input gère le **nom d'utilisateur** qui doit contenir au **moins trois lettres**, sans espaces à gauche et à droite.<br>
Si ce n'est pas le cas, montrer un message indiquant la condition de validation : "Choisissez un pseudo contenant au moins 3 caractères".
Montrer également une icône **rouge** à droite de l'input lorsqu'il ne passe pas la validation, et **verte** le cas contraire.

1. Enchaîner avec la validation du second input, servant à saisir l'**email**.
Le message d'erreur est le suivant: **Rentrez un email valide**.

1. Continuer avec l'input du mot de passe. Le mot de passe doit contenir : "**Au moins un symbole, un chiffre, ainsi que 6 caractères**."

2. Finir avec l'input de **répétition de mot de passe**.

3. Vérifier l'intégralité des inputs d'un coup **lorsqu'on envoie le formulaire**, et exécuter "alert("Données envoyées avec succès.")" si toutes les validations sont passées positivement.

### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.

