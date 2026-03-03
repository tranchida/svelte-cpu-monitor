import os from 'os';

/**
 * Retourne les informations brutes des CPUs via os.cpus()
 * @returns {Promise<import('os').CpuInfo[]>}
 */
export async function getCpuInfo() {
  return os.cpus();
}
