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

  Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

  let canvasEl;
  let chart;
  let prevCpus = [];
  let currentUsage = [];

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B'
  ];

  function calculateUsage(oldCpu, newCpu) {
    const oldTotal = Object.values(oldCpu.times).reduce((a, b) => a + b, 0);
    const newTotal = Object.values(newCpu.times).reduce((a, b) => a + b, 0);
    const totalDiff = newTotal - oldTotal;
    
    const idleDiff = newCpu.times.idle - oldCpu.times.idle;
    
    if (totalDiff === 0) return 0;
    return Math.max(0, Math.min(100, 100 * (1 - idleDiff / totalDiff)));
  }

  async function updateData() {
    try {
      const res = await fetch('/api/cpu');
      const data = await res.json();
      
      if (!data.cpus) return;

      const now = new Date().toLocaleTimeString();
      const newUsage = [];

      if (prevCpus.length > 0) {
        data.cpus.forEach((cpu, i) => {
          const usage = calculateUsage(prevCpus[i], cpu);
          newUsage.push(usage);
          
          // Update chart dataset
          if (chart.data.datasets[i]) {
            chart.data.datasets[i].data.push(usage);
             if (chart.data.datasets[i].data.length > 20) {
              chart.data.datasets[i].data.shift();
            }
          }
        });
        
        currentUsage = newUsage;

        chart.data.labels.push(now);
        if (chart.data.labels.length > 20) {
          chart.data.labels.shift();
        }
        
        chart.update('none');
      } else {
        // Initialize datasets on first load if needed
        if (chart.data.datasets.length === 0) {
           data.cpus.forEach((_, i) => {
             chart.data.datasets.push({
               label: `Core ${i}`,
               data: [],
               borderColor: colors[i % colors.length],
               backgroundColor: 'transparent',
               tension: 0.4,
               pointRadius: 0
             });
           });
           chart.update();
        }
      }

      prevCpus = data.cpus;
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  onMount(() => {
    chart = new Chart(canvasEl, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: '#f3f4f6' }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true }
          }
        },
        animation: false
      }
    });

    const interval = setInterval(updateData, 2000);
    updateData();

    return () => clearInterval(interval);
  });
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        CPU Monitor
      </h1>
      <p class="mt-2 text-lg text-gray-600">Real-time usage per core</p>
    </div>

    <div class="bg-white rounded-2xl shadow-xl overflow-hidden p-6 mb-8">
      <div class="h-96 w-full">
        <canvas bind:this={canvasEl}></canvas>
      </div>
    </div>

    {#if currentUsage.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {#each currentUsage as usage, i}
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Core {i}</span>
            <div class="text-2xl font-bold" style="color: {colors[i % colors.length]}">
              {usage.toFixed(1)}%
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div class="h-1.5 rounded-full transition-all duration-500" 
                   style="width: {usage}%; background-color: {colors[i % colors.length]}">
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
