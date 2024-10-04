import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const orders = await prisma.order.findMany({
      orderBy:[{
        createdAt:'desc',
      }],
      include: {
        products: true, 
        shipments: true, 
        activities: true, 
      }
    }); 

    return new Response(
      JSON.stringify({ orders }),
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
  } finally {
    await prisma.$disconnect();
  }
}
