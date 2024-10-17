// Import Prisma Client
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderId } = req.body; // Assuming the orderId is passed in the request body.

    try {
      // Step 1: Fetch the Order and associated details (Products, Shipments, Activities)
      const order = await prisma.order.findUnique({
        where: { channelOrderId: orderId },
        include: {
          products: true, // Include related products
          shipments: true, // Include related shipments
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Step 2: Map the Prisma data to the Delhivery API payload
      const delhiveryPayload = {
        format: 'json',
        data: {
          shipments: [
            {
              name: order.customerName,
              add: `${order.customerAddress} ${order.customerAddress2 || ''}`, // Combine address and address2
              pin: order.customerPincode,
              city: order.customerCity,
              state: order.customerState,
              country: order.customerCountry || 'India',
              phone: order.customerPhone,
              order: order.channelOrderId,
              payment_mode: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
              return_pin: order.pickupLocation, // Assuming return pin is based on pickup location
              return_city: order.customerCity, // Assuming same as customer city
              return_phone: order.customerPhone,
              return_add: `${order.customerAddress} ${order.customerAddress2 || ''}`, // Same for return address
              return_state: order.customerState,
              return_country: order.customerCountry || 'India',
              products_desc: order.products
                .map((product) => `${product.name} (Qty: ${product.quantity})`)
                .join(', '),
              hsn_code: order.products[0]?.hsn || '', // Assuming all products have the same HSN
              cod_amount: order.paymentMethod === 'COD' ? order.total : '',
              order_date: order.channelCreatedAt,
              total_amount: order.total,
              seller_add: '', // Add seller details if needed
              seller_name: '', // Add seller details if needed
              seller_inv: '', // Add seller details if needed
              quantity: order.products.length,
              waybill: '', // Leave waybill empty
              shipment_width: '30', // Map if available
              shipment_height: '20', // Map if available
              weight: order.shipments[0]?.weight || '',
              seller_gst_tin: '', // Add seller GST details if needed
              shipping_mode: 'Surface',
              address_type: '',
            },
          ],
          pickup_location: {
            name: 'MYNACHIKETA EXPRESS', // Add pickup location name if available
            add: '24, Pusa Road, Beside Axis Bank, Karol Bagh', // Add pickup location address if available
            city: 'NEW DELHI', // Add pickup city if available
            pin_code: '110005', // Add pickup pin code if available
            country: 'INDIA', // Add pickup country if available
            phone: '8790033615', // Add pickup phone if available
          },
        },
      };

      // Step 3: Send the payload to Delhivery API
      const response = await fetch('https://staging-express.delhivery.com/api/cmu/create.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization:  `TOKEN ${process.env.DELHIVERY_API_TOKEN}`,, // Replace with actual API token
        },
        body: JSON.stringify(delhiveryPayload),
      });

      const result = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: result });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
