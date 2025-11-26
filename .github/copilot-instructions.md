# Guidance pour agents IA (Copilot) — 20-projets-javascript

Ce dépôt est une collection de 20 mini‑projets JavaScript indépendants, pensés pour l’apprentissage. Chaque projet vit dans son propre dossier et suit la même structure.

## Vue d’ensemble de l’architecture

- 20 dossiers de projets numérotés, ex. `18.TypingGame/`.
- Chaque projet a 3 variantes:
  - `1.Essai/` (terrain d’essai à compléter),
  - `2.Resolution/` (solution guidée),
  - `3.Code-source/` (version finale de référence).
- Fichiers clés par variante: `index.html`, `style.css`, `script.js` (+ parfois `assets/`, `ressources/`, `consignes/`, `data/`).
- Aucune toolchain/bundler global(e) (pas de `package.json`). Les projets sont des pages statiques HTML/CSS/JS. Certains utilisent des modules ES via `<script type="module">`.

## Lancer et développer (workflows)

- Ouvrir la variante cible (souvent `1.Essai/`).
- Si le projet importe des modules (ex. `18.TypingGame/3.Code-source/index.html`), servir via HTTP (sinon erreurs CORS/import):
  - PowerShell (Windows):
    - Python: `python -m http.server 8000`
    - Node: `npx serve .`
- Sinon, l’ouverture directe de `index.html` suffit, mais le serveur local reste recommandé (cf. README racine).
- Pour les projets à clé API (ex. `10.Scroll-infini/1.Essai/`):
  - Copier `config.example.js` → `config.js`, y mettre la clé, et inclure `config.js` avant `script.js` dans `index.html`. `config.js` est ignoré par Git (voir `.gitignore` local).

## Conventions de code du dépôt

- Nommage CSS: BEM simple pour le style (`block__element`) + préfixe `js-` pour les hooks/logique (ex. `.js-time-left`, `.js-active-loader`).
- Pattern JS récurrent:
  - Sélection DOM en haut de fichier (`const el = document.querySelector(...)`).
  - Gestionnaires nommés `handleXxx` et écouteurs ajoutés après les sélections (`el.addEventListener('event', handleXxx)`).
  - Mise à jour du DOM via `textContent`, classes d’état (`.classList.add/remove`).
  - Fragment/performances pour les listes (ex. `DocumentFragment` dans `10.Scroll-infini/3.Code-source/script.js`).
  - Utilisation d’`IntersectionObserver` pour le scroll infini (marqueur `.search-imgs__marker`).
  - Modules ES ponctuels (ex. `18.TypingGame/3.Code-source/script.js` importe `./data/phrases.js`).
- Texte, identifiants et commentaires en français. Conserver ce ton et ces libellés.

## Exemples utiles du dépôt

- `18.TypingGame/3.Code-source/script.js`:
  - Import de données, rendu lettre‑par‑lettre, classes `js-correct`/`js-wrong`, minuterie 60s, reset via `Ctrl+Alt+Entrée`.
- `10.Scroll-infini/3.Code-source/script.js`:
  - Requêtes Unsplash, loader avec `.js-active-loader`, gestion d’erreurs utilisateur, pagination par `IntersectionObserver`.
- `1.Application-pret-bancaire/3.Code-source/script.js`:
  - Synchronisation entrées range/labels et calculs dérivés affichés en direct.

## Intégrations et dépendances externes

- APIs publiques selon projet (Unsplash, Wikipedia, RandomUser, météo, etc.).
- Pour les clés:
  - Variante Essai fournit `config.example.js` → créer `config.js` local non versionné.
  - Ne jamais committer de secrets. Respecter l’ordre de chargement des scripts (`config.js` avant `script.js`).

## Bonnes pratiques spécifiques ici

- Travailler dans `1.Essai/` pour implémenter/itérer; utiliser `3.Code-source/` comme référence fonctionnelle.
- Respecter les classes `js-` comme contrat entre JS et DOM; ne pas renommer arbitrairement celles déjà en place.
- Préférer des fonctions pures/utilitaires légères dans le même fichier plutôt qu’une sur‑architecture (projets courts).
- Si vous ajoutez des modules ES, vérifier que la page est servie via HTTP et que les chemins sont relatifs avec extension `.js`.

## Ce qu’un agent peut faire en autonomie

- Ajouter une fonctionnalité dans un projet donné en suivant les patterns ci‑dessus (sélecteurs en haut, `handleXxx`, classes `js-`).
- Factoriser un petit utilitaire commun dans la variante du projet concerné (éviter les cross‑projets non nécessaires).
- Mettre à jour un README local (par ex. pas‑à‑pas de config API) en français.

## À éviter

- Introduire une stack/bundler global(e) sans demande explicite.
- Briser la structure `1.Essai/`, `2.Resolution/`, `3.Code-source/` ou renommer les classes `js-` existantes.
- Commettre des clés API; ne pas supprimer les `.gitignore` locaux des variantes Essai.
