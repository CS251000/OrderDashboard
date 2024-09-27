import axios from "axios";
export async function POST(request) {
    try {
      const body = await request.json(); 
      const orderIds = body.order_ids;

      const response = await axios.post(`https://apiv2.shiprocket.in/v1/external/manifests/print`, {
        order_ids: orderIds 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SHIPROCKET_API_TOKEN}`
        },
      });
  
      const link = response.data;
  
      return new Response(JSON.stringify(link), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error printing manifests:', error.response?.data || error.message);
      return new Response(JSON.stringify({ error: 'Failed to fetch link', details: error.response?.data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  