# Coder une liste filtrable

> ctrl+shift+v pour afficher ce fichier markdown sur VS Code

### Objectif du projet 🎯

**Récupérer et afficher une liste d’utilisateurs**, puis créer une fonctionnalité de **filtre dynamique**.

### Critères à respecter 📋

- Performance
- Maintenabilité
- Code simple et facile à comprendre
- Flexibilité
- Compatibilité
- Accessibilité

### Compétences développées 💪

- Récupérer et afficher des données dynamiques
- Implémenter un système de filtrage côté client
- Gérer les événements en JavaScript
- Manipuler le DOM de manière efficace
- Appliquer des principes d’UX pour une recherche intuitive
- Structurer son code selon de bonnes pratiques

### A. Coder une interface basique

> Au début de chaque projet, codez seulement une interface basique du projet à réaliser, en ajoutant un peu de style si besoin est. <br>
> Puis codez les fonctionnalités JavaScript.

### B. Fonctionnalités JavaScript à coder pour ce projet

1. **Faire un appel à une API** afin de **récupérer** les données et de créer la liste.
   <br>L'URL de l'API est : **"https://randomuser.me/api/?nat=fr&results=50"**<br>Cette route nous permet de récupérer 50 utilisateurs.
2. **Créer la liste à afficher** à l'aide des résultats triés. Les noms de famille apparaissent en premier et dans l'ordre. Ex :
   Dupont Jean<br>
   Legrand Baptiste<br>
   Sauveur Léa
3. Implémenter un **loader** et un potentiel **message d'erreur**.
4. Enfin, implémenter un **filtre côté client** qui permet de recherche par nom ou prénom ou les deux.
   Plusieurs cas sont à prendre en compte :

- Si la recherche ne contient **qu'un seul mot**, on retourne les utilisateurs dont **le nom ou le prénom commencent par ce mot**.<br>
  Exemple, nom-prénom à chercher : "Andre Emilie"<br>
  "And" correspond.<br>
  "Emil" correspond.<br>
  "xyz" ne correspond pas.
- Si la recherche contient deux mots, on retourne les utilisateurs dont **le nom et le prénom commencent par le premier mot et le second mot ou inversement**.<br>
  Nom-prénom à chercher : "Andre Emilie"<br>
  "Andre Emi" correspond<br>
  "Emilie And" correspond<br>
  "and em" recherche étrange et fragmentaire, mais ça correspond<br>
  "andre zzz" ne correspond pas<br>
  "yyy emilie" ne correspond pas<br>

### C. Finir l'interface. 🎨

Une fois les fonctionnalités JavaScript codées, **ajouter le style manquant** afin de finir **l'implémentation de l'interface**.
