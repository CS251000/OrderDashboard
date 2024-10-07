import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const securityToken = request.headers.get('x-api-key');
    if (securityToken !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
      return new Response(JSON.stringify({ error: 'Invalid security token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const body = await request.json();
    
    const {
      awb,
      courier_name,
      current_status,
      shipment_status,
      shipment_status_id,
      current_timestamp,
      order_id,
      awb_assigned_date,
      pickup_scheduled_date,
      etd,
    } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { channelOrderId: order_id },
    });

    if (existingOrder) {
      await prisma.order.update({
        where: { channelOrderId: order_id },
        data: {
          status: shipment_status,
          statusCode: shipment_status_id,
        },
      });
    }

    const existingShipment = await prisma.shipment.findFirst({
      where: {awb},
    });

    if (existingShipment) {
      await prisma.shipment.update({
        where: { id: existingShipment.id },
        data: {
          courier: courier_name,
          etd,
          pickupScheduledDate: new Date(pickup_scheduled_date),
          deliveredDate: current_status === 'DELIVERED' ? new Date(current_timestamp) : null,
        },
      });
    } else {
      await prisma.shipment.create({
        data: {
          awb,
          courier: courier_name,
          etd,
          pickupScheduledDate: new Date(pickup_scheduled_date),
          orderId: order_id,
          deliveredDate: current_status === 'DELIVERED' ? new Date(current_timestamp) : null,
        },
      });
    }

 
    await Promise.all(
      scans.map(async (scan) => {
        const { date, activity } = scan;

        await prisma.activity.create({
          data: {
            orderId: order_id,
            action: `${activity} at ${scan.location} on ${date}`,
          },
        });
      })
    );

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing webhook and updating database:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to process webhook and update database', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });a
  }
}
