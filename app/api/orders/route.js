import axios from 'axios';

const SHIPROCKET_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export async function GET(request) {
  try {
    const response = await axios.get('https://apiv2.shiprocket.in/v1/external/orders', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SHIPROCKET_API_TOKEN}`
      }
    });

    return new Response(JSON.stringify(response.data.data), {
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
