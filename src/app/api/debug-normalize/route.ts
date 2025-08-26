import normalizeVehicleForUI from '@/lib/normalizeVehicle';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const res = await fetch(`http://localhost:5000/api/v1/vehicles/${id}`);
    const payload = await res.json();

    if (!res.ok || !payload.success) {
      return new Response(JSON.stringify({ error: 'Failed to fetch backend vehicle', details: payload }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const vehicle = payload.data;
    const normalized = normalizeVehicleForUI(vehicle as any);

    return new Response(JSON.stringify({ vehicle, normalized }, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
