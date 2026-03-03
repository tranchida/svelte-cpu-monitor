# svelte-cpu-monitor

Un outil de monitoring CPU en temps réel construit avec SvelteKit 2 et Svelte 5.

## 🚀 Techniques modernes utilisées

- **Svelte 5 Runes** : Utilisation de `$state` et `$effect` pour une réactivité moderne
- **SvelteKit 2** : Framework full-stack avec routing automatique
- **Tailwind CSS 4** : Dernière version avec `@tailwindcss/postcss`
- **Vite 6** : Build tool ultra-rapide
- **Chart.js 4** : Visualisation des données en temps réel

## 📦 Structure du projet

```
src/
├── lib/
│   └── cpu.js          # Fonctions pour récupérer les stats CPU
├── routes/
│   ├── +page.svelte     # Page principale avec le graphique (Svelte 5)
│   ├── +layout.svelte   # Layout de base
│   └── api/
│       └── cpu/+server.js # Endpoint API pour obtenir les données CPU
```

## ✨ Fonctionnalités

- Récupération des données CPU via Node.js `os.cpus()`
- API interne pour exposer ces données en JSON
- Affichage en temps réel avec Chart.js
- Interface moderne avec Tailwind CSS
- Mise à jour automatique toutes les 2 secondes
- Affichage par cœur de processeur

## 🛠️ Installation et développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview de la build de production
npm run preview

# Vérifier les types/erreurs
npm run check
```

## 🔄 Mise à jour récente (Mars 2026)

Le projet a été mis à jour avec :
- Svelte 5.15.0 avec les runes (`$state`, `$effect`)
- SvelteKit 2.15.0
- Vite 6.4.1
- @sveltejs/adapter-auto 7.0.1
- Tailwind CSS 4.2.1