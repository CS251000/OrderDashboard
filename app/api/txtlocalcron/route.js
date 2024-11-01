// app/api/cron/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TXT_API_KEY;
  const numbers = "9818907290"; 
  const sender = "MYNACH";
  const message = "Hello Parents, Sunday Gita Class - 3 (Doing Work, Without Desire) Starts in 1 Hour on Zoom by myNachiketa.com. Meeting Link: https://bit.ly/4bTqSux";

  
  const url = `https://api.textlocal.in/send/?apiKey=${encodeURIComponent(apiKey)}&numbers=${encodeURIComponent(numbers)}&sender=${encodeURIComponent(sender)}&message=${encodeURIComponent(message)}`;

  try {
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
}
