import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders?page=${currentPage}&per_page=100`, {
        headers: {
          'Authorization': `Bearer ${process.env.SHIPROCKET_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const { data: orders, meta } = response.data;

      if (meta && meta.pagination) {
        totalPages = meta.pagination.total_pages || 1;
      }

      if (!Array.isArray(orders)) {
        throw new Error("Orders data is not an array or is missing");
      }

      for (const order of orders) {
        const existingOrder = await prisma.order.findFirst({
          where: {
            channelOrderId: order.channel_order_id || '',
          },
        });

        if (existingOrder) {
          console.log('Existing Order found, stopping the update process.');
          return new Response(JSON.stringify({ message: 'Update process stopped. Existing Order found.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (!existingOrder) {
          await prisma.order.create({
            data: {
              id: parseInt(order.channel_order_id),
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
              expedited: order.expedited === 1,
              status: order.status || '',
              statusCode: order.status_code || 0,
              paymentMethod: order.payment_method || '',
              isInternational: order.is_international === 1,
              purposeOfShipment: order.purpose_of_shipment || 0,
              channelCreatedAt: order.channel_created_at ? new Date(order.channel_created_at) : null,
              createdAt: order.created_at ? new Date(order.created_at) : null,
              allowReturn: order.allow_return === 1,
              isIncomplete: order.is_incomplete === 1,
              errors: Array.isArray(order.errors) ? order.errors : [],
              showEscalationBtn: order.show_escalation_btn === 1,
              escalationStatus: order.escalation_status || null,
              escalationHistory: Array.isArray(order.escalation_history) ? order.escalation_history : [],

              shipments: {
                create: Array.isArray(order.shipments) ? order.shipments.map((shipment) => ({
                  id: shipment.id,
                  isdCode: shipment.isd_code || '',
                  courier: shipment.courier || '',
                  weight: parseFloat(shipment.weight) || 0,
                  dimensions: shipment.dimensions || '',
                  pickupScheduledDate: isValidDate(shipment.pickup_scheduled_date) ? new Date(shipment.pickup_scheduled_date) : null,
                  pickupTokenNumber: shipment.pickup_token_number || '',
                  awb: shipment.awb || '',
                  returnAwb: shipment.return_awb || '',
                  volumetricWeight: parseFloat(shipment.volumetric_weight) || 0,
                  pod: shipment.pod || '',
                  etd: shipment.etd || '',
                  rtoDeliveredDate: isValidDate(shipment.rto_delivered_date) ? new Date(shipment.rto_delivered_date) : null,
                  deliveredDate: isValidDate(shipment.delivered_date) ? new Date(shipment.delivered_date) : null,
                  etdEscalationBtn: shipment.etd_escalation_btn === 1,
                })) : [],
              },

            
              products: {
                create: Array.isArray(order.products) ? order.products.map((product) => ({
                  id: product.id,
                  channelOrderProductId: product.channel_order_product_id || '',
                  name: product.name || '',
                  channelSku: product.channel_sku || '',
                  quantity: product.quantity || 0,
                  productId: product.product_id || 0,
                  available: product.available || 0,
                  status: product.status || '',
                  hsn: product.hsn || ''
                })) : [],
              },

        
              activities: {
                create: Array.isArray(order.activities) ? order.activities.map((activity) => ({
                  action: activity.action || '',
                })) : [],
              },
            },
          });
        }
      }

      currentPage++;
    }

    return new Response(JSON.stringify({ message: 'Orders data updated successfully!' }), {
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

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
