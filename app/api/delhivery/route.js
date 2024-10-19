import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { channelOrderId: orderId },
      include: {
        products: true,
        shipments: true,
        activities: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Map the Prisma data to the Delhivery API payload
    const delhiveryPayload = {
      "shipments": [
        {
          "name": order.customerName,
          "add": `${order.customerAddress} ${order.customerAddress2 || ''}`,
          "pin": order.customerPincode,
          "city": order.customerCity,
          "state": order.customerState,
          "country": order.customerCountry || "India",
          "phone": order.customerPhone,
          "order": order.channelOrderId,
          "payment_mode": order.paymentMethod === "COD" ? "COD" : "Prepaid",
          "return_pin": order.customerPincode,
          "return_city": order.customerCity,
          "return_phone": order.customerPhone,
          "return_add": `${order.customerAddress} ${order.customerAddress2 || ''}`,
          "return_state": order.customerState,
          "return_country": order.customerCountry || "India",
          "products_desc": order.products
            .map((product) => `${product.name} (Qty: ${product.quantity})`)
            .join(', '),
          "hsn_code": order.products[0]?.hsn || "",
          "cod_amount": order.paymentMethod === "COD" ? order.total : "",
          "order_date": order.channelCreatedAt,
          "total_amount": order.total,
          "seller_add": "",
          "seller_name": "",
          "seller_inv": "",
          "quantity": order.products.length,
          "waybill": "",
          "shipment_width": "30",
          "shipment_height": "20",
          "weight": order.shipments[0]?.weight || "",
          "seller_gst_tin": "",
          "shipping_mode": "Surface",
          "address_type": ""
        }
      ],
      "pickup_location": {
        "name": "MYNACHIKETA EXPRESS",
        "add": "24, Pusa Road, Beside Axis Bank, Karol Bagh",
        "city": "NEW DELHI",
        "pin_code": "110005",
        "country": "INDIA",
        "phone": "8790033615"
      }
    };

    // Construct the query string separately
    const queryString = `format=json&data=${encodeURIComponent(JSON.stringify(delhiveryPayload))}`;

    const response = await fetch(`https://track.delhivery.com/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json',
        "Authorization": `Token ${process.env.DELHIVERY_API_TOKEN}`,
      },
        body: queryString,
    });
    // console.log(queryString);

    const result = await response.json();
    if (!response.ok) {
      // Handle Delhivery API errors
      return NextResponse.json({ error: result }, { status: response.status });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // Handle JSON parsing errors or Prisma query errors
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
