import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export async function GET(req) {
  const apiKey = process.env.TXT_API_KEY;
  numbers="9818907290";
  const sender = "MYNACH";
  const message = "Hello Parents, Sunday Gita Class - 3 (Doing Work, Without Desire) Starts in 1 Hour on Zoom by myNachiketa.com. Meeting Link: https://bit.ly/4bTqSux";


  try {
//     const orders = await prisma.order.findMany({
//       where: {
//        //tbd
//       },
//       select: {
//         customerPhone: true, 
//       },
//     });

//     const numbers = orders.map(order => order.customerPhone).filter(Boolean).join(','); 

//     if (!numbers) {
//       return NextResponse.json({ message: "No phone numbers found" }, { status: 404 });
//     }

    const url = `https://api.textlocal.in/send/?apiKey=${encodeURIComponent(apiKey)}&numbers=${encodeURIComponent(numbers)}&sender=${encodeURIComponent(sender)}&message=${encodeURIComponent(message)}`;

    const response = await fetch(url, { method: "POST" });

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }

    const data = await response.json();
    console.log("SMS sent:", data);
    return NextResponse.json({ message: "SMS sent successfully", data });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({ message: "Failed to send SMS", error: error.message }, { status: 500 });
  } 
//   finally {
//     await prisma.$disconnect();
//   }
}
