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
│   ├── cpu.ts          # Fonctions pour récupérer/calculer les stats CPU
│   └── chartAction.ts  # Action Svelte pour le graphique Chart.js
├── routes/
│   ├── +page.svelte     # Page principale avec le graphique (Svelte 5)
│   ├── +layout.svelte   # Layout de base
│   └── api/
│       └── cpu/+server.ts # Endpoint SSE pour obtenir les données CPU en direct
```

## ✨ Fonctionnalités

- Récupération des données CPU via Node.js `os.cpus()`
- API interne SSE pour pousser les données CPU en continu
- Affichage en temps réel avec Chart.js
- Interface moderne avec Tailwind CSS
- Flux mis à jour toutes les 2 secondes côté serveur
- Affichage par cœur de processeur

## 🧠 Architecture SSE

- **Un seul sampler CPU global côté serveur** : l'échantillonnage CPU est mutualisé (intervalle unique) pour tous les clients connectés.
- **Broadcast multi-clients** : chaque échantillon est diffusé à toutes les connexions SSE actives.
- **Heartbeat SSE** : un keepalive (`: heartbeat`) est envoyé périodiquement pour limiter les coupures silencieuses derrière certains proxies.
- **Nettoyage automatique** : les timers sont arrêtés quand le dernier client se déconnecte.

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