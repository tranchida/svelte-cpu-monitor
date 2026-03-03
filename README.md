# svelte-cpu-monitor

Un outil de monitoring CPU en temps réel construit avec SvelteKit.

## Structure du projet

```
src/
├── lib/
│   └── cpu.js          # Fonctions pour récupérer les stats CPU
├── routes/
│   ├── +page.svelte     # Page principale avec le graphique
│   └── api/
│       └── cpu/+server.js # Endpoint API pour obtenir les données CPU
```

## Fonctionnalités

- Récupération des données CPU via un script shell (Linux/macOS)
- API interne pour exposer ces données en JSON
- Affichage en temps réel avec un graphique (Chart.js ou similaire)