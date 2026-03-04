import os from "node:os";

export interface CpuUsageInfo {
  coreUsage: number[];
  totalUsage: number;
}

export function calculateUsage(
  oldCpus: os.CpuInfo[],
  newCpus: os.CpuInfo[],
): CpuUsageInfo {
  const coreUsage: number[] = [];
  let totalOld = 0;
  let totalNew = 0;
  let idleOld = 0;
  let idleNew = 0;

  for (let i = 0; i < newCpus.length; i++) {
    const oldCpu = oldCpus[i];
    const newCpu = newCpus[i];

    const oldTotalCore = Object.values(oldCpu.times).reduce((a, b) => a + b, 0);
    const newTotalCore = Object.values(newCpu.times).reduce((a, b) => a + b, 0);
    const totalDiffCore = newTotalCore - oldTotalCore;
    const idleDiffCore = newCpu.times.idle - oldCpu.times.idle;

    if (totalDiffCore === 0) {
      coreUsage.push(0);
    } else {
      coreUsage.push(
        Math.max(0, Math.min(100, 100 * (1 - idleDiffCore / totalDiffCore))),
      );
    }

    totalOld += oldTotalCore;
    totalNew += newTotalCore;
    idleOld += oldCpu.times.idle;
    idleNew += newCpu.times.idle;
  }

  const totalDiff = totalNew - totalOld;
  const idleDiff = idleNew - idleOld;
  const totalUsage =
    totalDiff === 0
      ? 0
      : Math.max(0, Math.min(100, 100 * (1 - idleDiff / totalDiff)));

  return { coreUsage, totalUsage };
}

export async function getCpuInfo(): Promise<os.CpuInfo[]> {
  return os.cpus();
}
