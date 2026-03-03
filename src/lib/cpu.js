import os from 'os';

/**
 * Retourne l'usage CPU basé sur loadavg() normalisé par le nombre de coeurs.
 * @returns {Promise<number>} Pourcentage d'utilisation (0-100)
 */
export async function getCpuUsage() {
  try {
    const load = os.loadavg()[0]; // Charge moyenne sur 1 minute
    const cpuCount = os.cpus().length;
    // Normalisation : loadavg / nombre de coeurs * 100
    const usage = Math.min(100, Math.round((load / cpuCount) * 100));
    return usage;
  } catch (error) {
    console.error('Erreur lecture CPU:', error);
    return 0;
  }
}
