<script lang="ts">
  import { chartAction } from "$lib/chartAction";

  let currentUsages = $state<number[]>([]);
  let totalUsage = $state<number>(0);
  let isConnected = $state<"connecting" | "connected" | "disconnected">(
    "connecting",
  );
  let numCores = $state<number>(0);

  let eventSource: EventSource | null = null;
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

  function connectSSE() {
    if (eventSource) eventSource.close();
    eventSource = new EventSource("/api/cpu");
    isConnected = "connecting";

    eventSource.onopen = () => {
      isConnected = "connected";
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.coreUsage) {
          currentUsages = data.coreUsage;
          totalUsage = data.totalUsage;
          if (numCores === 0) {
            numCores = data.coreUsage.length;
          }
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    eventSource.onerror = () => {
      isConnected = "disconnected";
      eventSource?.close();
      // Retry logic
      setTimeout(connectSSE, 3000);
    };
  }

  $effect(() => {
    connectSSE();
    return () => {
      eventSource?.close();
    };
  });
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10 relative">
      <div class="absolute right-0 top-0 mt-2">
        {#if isConnected === "connected"}
          <span
            class="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-medium bg-green-100 text-green-800"
          >
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
            ></span>
            En direct
          </span>
        {:else if isConnected === "connecting"}
          <span
            class="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800"
          >
            <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"
            ></span>
            Connexion...
          </span>
        {:else}
          <span
            class="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-medium bg-red-100 text-red-800"
          >
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            Déconnecté
          </span>
        {/if}
      </div>

      <h1
        class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
      >
        CPU Monitor
      </h1>
      <p class="mt-2 text-lg text-gray-600">
        Surveillance en temps réel via SSE
      </p>

      {#if currentUsages.length > 0}
        <div class="mt-6">
          <div
            class="inline-block bg-white border-2 border-gray-100 rounded-full py-2 px-6 shadow-sm"
          >
            <span class="text-sm font-semibold text-gray-500 uppercase mr-2"
              >Usage Global</span
            >
            <span
              class="text-2xl font-bold {totalUsage > 80
                ? 'text-red-600'
                : totalUsage > 50
                  ? 'text-yellow-600'
                  : 'text-blue-600'}"
            >
              {totalUsage.toFixed(1)}%
            </span>
          </div>
        </div>
      {/if}
    </div>

    <div
      class="bg-white rounded-2xl shadow-xl overflow-hidden p-6 mb-8 relative"
    >
      {#if currentUsages.length === 0}
        <div
          class="h-96 w-full flex flex-col items-center justify-center text-gray-400"
        >
          <svg
            class="animate-spin h-8 w-8 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Analyse du CPU en cours...</p>
        </div>
      {:else}
        <div class="h-96 w-full">
          {#if numCores > 0}
            <canvas use:chartAction={{ usages: currentUsages, numCores }}
            ></canvas>
          {/if}
        </div>
      {/if}
    </div>

    {#if currentUsages.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {#each currentUsages as usage, i}
          <div
            class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center"
          >
            <span
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
              >Core {i}</span
            >
            <div
              class="text-2xl font-bold"
              style="color: {colors[i % colors.length]}"
            >
              {usage.toFixed(1)}%
            </div>
            <div
              class="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-300 ease-out"
                style="width: {usage}%; background-color: {colors[
                  i % colors.length
                ]}"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
