# Cours — 20 projets JavaScript (Résumé des projets)

Ce dépôt contient 20 petits projets didactiques JavaScript organisés pour progresser pas à pas.  
Chaque projet est dans son dossier numéroté, avec 3 sous-dossiers usuels :  
- 1.Essai → votre essai / terrain de jeu  
- 2.Résolution → solution guidée (vidéo/course)  
- 3.Code-source → version finale de référence

Structure générale
- c:\Users\ricoe\OneDrive\Documents\Developpeur web\javascript\20-projets-javascript\
  - 01.Projet-n (par exemple `13.Liste-filtrable`)
    - 1.Essai
    - 2.Résolution
    - 3.Code-source
  - README.md ← ce fichier (index des projets)

Comment lancer un projet localement
1. Ouvrir le dossier du projet (ex. `13.Liste-filtrable/1.Essai`) dans votre éditeur.  
2. Pour éviter les problèmes CORS, servez le dossier depuis un serveur local (recommandé) :
   - Python 3: `python -m http.server 8000`
   - Node (serve): `npx serve .`
3. Ouvrir `index.html` via `http://localhost:8000` ou en double‑cliquant (parfois limité).

Conventions et bonnes pratiques
- Fichiers principaux : `index.html`, `style.css`, `script.js` dans `1.Essai`.
- Utilisez les classes BEM simples (ex. `.app-header`, `.search-input`) pour faciliter la lisibilité.
- Les ressources (images/icônes) se trouvent dans `assets/` ou `ressources/`.
- Testez l'accessibilité (focus clavier, aria-live) et le responsive (mobile/tablette).

Résumé rapide des 20 projets
1. 1.Application-pret-bancaire — simulateur de prêt avec calculs et validation.  
2. 2.Application-meteo — récupère météo via API et affiche prévisions.  
3. 3.Quizz — quiz interactif, score et gestion des questions.  
4. 4.WikiApp — recherche d'articles (Wikipedia API) et affichage dynamique.  
5. 5.Cookies — démonstration des cookies / stockage simple.  
6. 6.Generateur-de-degrades — éditeur visuel de dégradés CSS.  
7. 7.Slider — carrousel / slider responsive avec pagination.  
8. 8.Validation-formulaire — validations front (regex, contraintes).  
9. 9.Jeu-des-cartes-memoires — jeu mémoire (paires) avec animations.  
10. 10.Scroll-infini — pagination infinie et chargement asynchrone.  
11. 11.Pomodoro — minuteur Pomodoro avec cycles et notifications.  
12. 12.Generateur-de-mot-de-passe — règles de génération / complexité.  
13. 13.Liste-filtrable — recherche en temps réel sur liste (RandomUser).  
14. 14.Lecteur-video — lecteur vidéo custom, playlist et contrôles.  
15. 15.Jeu-du-morpion — morpion accessible (clavier / touch).  
16. 16.Particules — animation canvas particules avec contrôles.  
17. 17.Animations — démonstrations d'animations, curseur perso, reveal.  
18. 18.TypingGame — jeu de frappe (typing) et scoring.  
19. 19.Lecteur-audio — lecteur audio custom et playlist.  
20. 20.Calculatrice — calculatrice JS avec gestion d'entrée et priorité.

Conseils rapides
- Travaillez projet par projet. Ne cherchez pas à tout couvrir en une séance.  
- Pour chaque projet, commencez par lire le HTML/CSS puis le JS.  
- Si un exercice bloque, comparez avec `3.Code-source` pour comprendre la logique.  
- Pensez à commits fréquents et messages clairs dans Git.

Crédits & Licence
- Auteur / source : cours "20 projets JavaScript".  
- Usage personnel et pédagogique autorisé. Redistribution globale interdite sans accord (voir mentions de la formation).

Bon codage ! 🚀