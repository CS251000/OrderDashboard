import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');
  const parsedFromDate = fromDate ? new Date(fromDate) : "2022-09-30";
  const parsedToDate = toDate ? new Date(toDate) : new Date();

  try {
    // console.log('Parsed From Date:', parsedFromDate);
    // console.log('Parsed To Date:', parsedToDate);
    if (!parsedFromDate || !parsedToDate || isNaN(parsedFromDate) || isNaN(parsedToDate)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: parsedFromDate,
          lte: parsedToDate,
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      include: {
        products: true,
        shipments: true,
        activities: true,
      },
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
