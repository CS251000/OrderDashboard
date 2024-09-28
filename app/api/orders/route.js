import axios from 'axios';

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 1; // Get the page number from the query params

  try {
    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SHIPROCKET_API_TOKEN}`,
      },
    });

    const { data, meta } = response.data;

    return new Response(
      JSON.stringify({ orders: data, total_pages: meta.pagination.total_pages }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
