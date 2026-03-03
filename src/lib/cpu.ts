import os from 'node:os';

/**
 * Retourne les informations brutes des CPUs via os.cpus()
 */
export async function getCpuInfo(): Promise<os.CpuInfo[]> {
  return os.cpus();
}
