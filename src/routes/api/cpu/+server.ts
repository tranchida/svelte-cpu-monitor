import { json } from '@sveltejs/kit';
import { getCpuInfo } from '$lib/cpu';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const cpus = await getCpuInfo();
    return json({ cpus });
  } catch (error) {
    console.error('API CPU Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ error: errorMessage }, { status: 500 });
  }
};
