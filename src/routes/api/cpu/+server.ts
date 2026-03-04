import { getCpuInfo, calculateUsage } from "$lib/cpu";
import type { RequestEvent } from "@sveltejs/kit";

export const GET = async ({ request }: RequestEvent) => {
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new ReadableStream({
    async start(controller) {
      let previousCpus = await getCpuInfo();

      // Delay before first data to get an initial delta
      await new Promise((resolve) => setTimeout(resolve, 100));

      let currentCpus = await getCpuInfo();
      let usageInfo = calculateUsage(previousCpus, currentCpus);

      const sendData = (data: any) => {
        try {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch (e) {
          // Stream might be closed
        }
      };

      sendData(usageInfo);
      previousCpus = currentCpus;

      const interval = setInterval(async () => {
        try {
          const newCpus = await getCpuInfo();
          usageInfo = calculateUsage(previousCpus, newCpus);
          sendData(usageInfo);
          previousCpus = newCpus;
        } catch (e) {
          // Error handling if stream closed
        }
      }, 2000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch (e) {}
      });
    },
  });

  return new Response(stream, { headers });
};
