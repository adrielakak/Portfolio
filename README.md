# Adriel Kourlate — Interactive 3D Portfolio

> Portfolio personnel interactif bilingue (**FR / EN**) présentant mon parcours en Data Science, architecture de bases de données relationnelles et ingénierie logicielle.

🔗 **Site en ligne :** [portfolio-nu-eosin-a953g7hsv2.vercel.app](https://portfolio-nu-eosin-a953g7hsv2.vercel.app)

## Fonctionnalités & Stack Technique

- **Rendu 3D & Shaders (`background.js`)** : Scène WebGL temps réel propulsée par **Three.js** (`0.160.0`) et **postprocessing** (`6.34.3`) chargée en ES Modules.
- **Animations fluides (`animations.js`)** : Transitions et révélations au défilement orchestrées par **GSAP** (`3.12.5`) et `ScrollTrigger`.
- **Carte de profil interactive (`profile-card.js` / `profile-card.css`)** : Effet de perspective 3D et interactions tactiles/souris.
- **Bilinguisme instantané (FR / EN)** : Bascule dynamique via attributs `data-fr` / `data-en`.
- **Études de cas & Expériences cachées** :
  - Rapport technique SQL (3NF, ERD/MLD) : `projects/DB_Lab_2_AdrielKourlate.pdf`
  - Visuels d'analyse électorale : `projects/election-area.png`, `projects/election-bar.png`, `projects/election-map.png`
  - Pages interactives annexes : `craft.html` et `secret.html`

## Structure du projet

```text
Portfolio/
├── index.html                  # Page principale (FR/EN, Import Map Three.js & GSAP)
├── style.css                   # Styles globaux et mise en page responsive
├── background.js               # Arrière-plan 3D Three.js + postprocessing
├── animations.js               # Animations GSAP / ScrollTrigger
├── profile-card.js / .css      # Composant carte de profil interactive
├── craft.html                  # Expérience interactive "Table de Craft"
├── secret.html                 # Page secrète interactive
├── Adriel_KOURLATE_Resume.pdf  # CV
└── projects/                   # Rapports PDF et visuels de projets Data
```

## Aperçu local

Aucune étape de compilation n'est requise : il suffit de servir le répertoire avec un serveur HTTP statique.

```bash
python3 -m http.server 8080
```

Ouvrez ensuite [http://localhost:8080](http://localhost:8080).
