import { getCpuInfo, calculateUsage } from "$lib/cpu";
import type { RequestHandler } from "./$types";

const clients = new Set<ReadableStreamDefaultController<string>>();
let samplingInterval: ReturnType<typeof setInterval> | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let previousCpus: Awaited<ReturnType<typeof getCpuInfo>> | null = null;
let lastUsage: ReturnType<typeof calculateUsage> | null = null;

function sendEvent(
  controller: ReadableStreamDefaultController<string>,
  data: unknown,
) {
  try {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  } catch {
    clients.delete(controller);
  }
}

function broadcast(data: unknown) {
  for (const controller of clients) {
    sendEvent(controller, data);
  }
}

function broadcastHeartbeat() {
  for (const controller of clients) {
    try {
      controller.enqueue(": heartbeat\n\n");
    } catch {
      clients.delete(controller);
    }
  }
}

async function sampleCpuUsage() {
  if (!previousCpus) {
    previousCpus = await getCpuInfo();
    return;
  }

  const currentCpus = await getCpuInfo();
  lastUsage = calculateUsage(previousCpus, currentCpus);
  previousCpus = currentCpus;
  broadcast(lastUsage);
}

async function startSamplerIfNeeded() {
  if (samplingInterval) return;

  previousCpus = await getCpuInfo();
  await new Promise((resolve) => setTimeout(resolve, 100));
  await sampleCpuUsage();

  samplingInterval = setInterval(() => {
    void sampleCpuUsage();
  }, 2000);

  if (!heartbeatInterval) {
    heartbeatInterval = setInterval(() => {
      broadcastHeartbeat();
    }, 15000);
  }
}

function stopSamplerIfUnused() {
  if (clients.size > 0) return;
  if (samplingInterval) {
    clearInterval(samplingInterval);
    samplingInterval = null;
  }
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  previousCpus = null;
  lastUsage = null;
}

export const GET: RequestHandler = async ({ request }) => {
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new ReadableStream<string>({
    async start(controller) {
      clients.add(controller);
      await startSamplerIfNeeded();

      if (lastUsage) {
        sendEvent(controller, lastUsage);
      }

      request.signal.addEventListener("abort", () => {
        clients.delete(controller);
        try {
          controller.close();
        } catch {}
        stopSamplerIfUnused();
      });
    },
  });

  return new Response(stream, { headers });
};
