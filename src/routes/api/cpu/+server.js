import { json } from '@sveltejs/kit';
import { getCpuInfo } from '$lib/cpu';

export async function GET() {
  try {
    const cpus = await getCpuInfo();
    return json({ cpus });
  } catch (error) {
    console.error('API CPU Error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
