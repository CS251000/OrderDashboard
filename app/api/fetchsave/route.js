import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const totalPages = body.totalPages;

    if (!totalPages || isNaN(totalPages)) {
      throw new Error("Invalid or missing totalPages");
    }

    let currentPage = 1;

    while (currentPage <= totalPages) {
      const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders?page=${currentPage}`, {
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
        await prisma.order.create({
          data: {
            channelId: order.channel_id,
            channelName: order.channel_name,
            baseChannelCode: order.base_channel_code || '',
            channelOrderId: order.channel_order_id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            customerPhone: order.customer_phone,
            pickupLocation: order.pickup_location,
            paymentStatus: order.payment_status || '',
            total: parseFloat(order.total) || 0,
            tax: parseFloat(order.tax) || 0,
            sla: order.sla || '',
            shippingMethod: order.shipping_method || '',
            expedited: order.expedited === 1,  // Convert to boolean
            status: order.status || '',
            statusCode: order.status_code || 0,
            paymentMethod: order.payment_method || '',
            isInternational: order.is_international ===1,
            purposeOfShipment: order.purpose_of_shipment || 0,
            channelCreatedAt: new Date(order.channel_created_at),
            createdAt: new Date(order.created_at),
            allowReturn: order.allow_return===1,
            isIncomplete: order.is_incomplete ===1,
            // products: {
            //   create: order.products.map((product) => ({
            //     name: product.name,
            //     channelOrderProductId: product.channel_order_product_id,
            //     channelSku: product.channel_sku,
            //     quantity: product.quantity,
            //     productId: product.product_id,
            //     available: product.available,
            //     status: product.status,
            //     hsn: product.hsn || '',
            //   })),
            // },
          },
        });
      }

      console.log(`Fetched and saved page ${currentPage} of ${totalPages}`);
      currentPage++;
    }

    return new Response(JSON.stringify({ message: 'Data saved successfully from all pages!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching or saving orders:', error.response?.data || error.message);
    return new Response(JSON.stringify({
      message: 'Error saving data',
      error: error.message,
      details: error.response?.data || null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
