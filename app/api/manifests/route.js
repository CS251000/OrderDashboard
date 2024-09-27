import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');

  try {
    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders?from=${fromDate}&to=${toDate}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SHIPROCKET_API_TOKEN}`
      },
    });

    const orders = response.data.data;

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}



