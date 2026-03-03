<script>
  import { onMount } from 'svelte';
  import { 
    Chart, 
    LineController, 
    LineElement, 
    PointElement, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend, 
    CategoryScale 
  } from 'chart.js';

  // Enregistrement explicite des composants pour éviter le tree-shaking excessif
  Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

  let canvasEl;
  let chart;
  let usage = 0;

  async function updateData() {
    try {
      const res = await fetch('/api/cpu');
      const data = await res.json();
      usage = data.cpu;

      const now = new Date().toLocaleTimeString();
      chart.data.labels.push(now);
      chart.data.datasets[0].data.push(usage);

      // Garder les 20 derniers points
      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update('none'); // Update sans animation pour la performance
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  onMount(() => {
    chart = new Chart(canvasEl, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Utilisation CPU (%)',
          data: [],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        animation: false
      }
    });

    const interval = setInterval(updateData, 2000);
    updateData(); // Premier appel immédiat

    return () => clearInterval(interval);
  });
</script>

<main>
  <h1>Svelte CPU Monitor</h1>
  <div class="stats">
    <span class="value">{usage}%</span>
    <span class="label">Actuel</span>
  </div>
  
  <div class="chart-container">
    <canvas bind:this={canvasEl}></canvas>
  </div>
</main>

<style>
  main {
    font-family: 'Inter', system-ui, sans-serif;
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    text-align: center;
    background: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  h1 { color: #333; margin-bottom: 2rem; }

  .stats {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
  }

  .value {
    font-size: 3rem;
    font-weight: bold;
    color: #4CAF50;
  }

  .label {
    text-transform: uppercase;
    font-size: 0.8rem;
    color: #666;
    letter-spacing: 1px;
  }

  .chart-container {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #eee;
  }
</style>
