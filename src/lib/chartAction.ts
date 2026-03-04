import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
);

const colors = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
  "#F97316",
  "#14B8A6",
  "#06B6D4",
  "#A855F7",
  "#84CC16",
  "#E11D48",
  "#0EA5E9",
  "#D97706",
  "#22C55E",
  "#7C3AED",
  "#FB923C",
  "#2DD4BF",
];

export interface ChartActionOptions {
  usages: number[];
  numCores: number;
}

export function chartAction(
  node: HTMLCanvasElement,
  options: ChartActionOptions,
) {
  const chart = new Chart(node, {
    type: "line",
    data: {
      labels: [] as string[],
      datasets: Array.from({ length: options.numCores }, (_, i) => ({
        label: `Core ${i}`,
        data: [] as number[],
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length],
        tension: 0.4,
        pointRadius: 0,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: "#f3f4f6" },
        },
        x: {
          grid: { display: false },
        },
      },
      plugins: {
        legend: {
          position: "right",
          labels: { usePointStyle: true, boxWidth: 10, padding: 16 },
        },
      },
      animation: false,
    },
  });

  return {
    update(newOptions: ChartActionOptions) {
      if (!newOptions.usages || newOptions.usages.length === 0) return;

      const now = new Date().toLocaleTimeString();
      chart.data.labels?.push(now);
      if (chart.data.labels && chart.data.labels.length > 20) {
        chart.data.labels.shift();
      }

      newOptions.usages.forEach((usage, i) => {
        if (chart.data.datasets[i]) {
          chart.data.datasets[i].data.push(usage);
          if (chart.data.datasets[i].data.length > 20) {
            chart.data.datasets[i].data.shift();
          }
        }
      });

      chart.update("none");
    },
    destroy() {
      chart.destroy();
    },
  };
}
