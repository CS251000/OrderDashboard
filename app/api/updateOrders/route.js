import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders`, {
      headers: {
        'Authorization': `Bearer ${process.env.SHIPROCKET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const { data: orders } = response.data;

    if (!Array.isArray(orders)) {
      throw new Error("Orders data is not an array or is missing");
    }

    for (const order of orders) {
      const existingOrder = await prisma.order.findFirst({
        where: { channelOrderId: order.channel_order_id },
      });

      if (!existingOrder) {
        await prisma.order.create({
          data: {
            id : order.id,
            channelId: order.channel_id || null,
            channelName: order.channel_name || null,
            baseChannelCode: order.base_channel_code || '',
            channelOrderId: order.channel_order_id,
            customerName: order.customer_name || null,
            customerEmail: order.customer_email || null,
            customerPhone: order.customer_phone || null,
            customerAddress: order.customer_address || null, 
            customerAddress2: order.customer_address_2 || null, 
            customerCity: order.customer_city || null, 
            customerState: order.customer_state || null,
            customerPincode: order.customer_pincode || null, 
            customerCountry: order.customer_country || null, 
            pickupLocation: order.pickup_location || null,
            paymentStatus: order.payment_status || '',
            total: parseFloat(order.total) || 0,
            tax: parseFloat(order.tax) || 0,
            sla: order.sla || '',
            shippingMethod: order.shipping_method || '',
            expedited: order.expedited === 1,  // Convert to boolean
            status: order.status || '',
            statusCode: order.status_code || 0,
            paymentMethod: order.payment_method || '',
            isInternational: order.is_international === 1,
            purposeOfShipment: order.purpose_of_shipment || 0,
            channelCreatedAt: new Date(order.channel_created_at) || null,
            createdAt: new Date(order.created_at) || null,
            allowReturn: order.allow_return === 1,
            isIncomplete: order.is_incomplete === 1,
          },
        });
      }
    }

    return new Response(JSON.stringify({ message: 'Missing data successfully updated!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating orders:', error.response?.data || error.message);
    return new Response(JSON.stringify({
      message: 'Error updating data',
      error: error.message,
      details: error.response?.data || null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
