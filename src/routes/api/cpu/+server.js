import { json } from '@sveltejs/kit';
import { getCpuUsage } from '$lib/cpu';

export async function GET() {
  try {
    const usage = await getCpuUsage();
    return json({ cpu: usage });
  } catch (error) {
    console.error('API CPU Error:', error);
    return json({ cpu: 0, error: error.message }, { status: 500 });
  }
}
