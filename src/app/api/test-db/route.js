// Tests if Next.js can connect to MySQL
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    //connect to MySQL database
    const db = await connectDB();
    // Run simple test query
    const [rows] = await db.execute("SELECT 1 + 1 AS result");
    return NextResponse.json({ //Sucess message
      message: "💚 Database connected successfully!"
    }, { status: 200 });

  } catch (error) {
    // Return error if connection fails
    return NextResponse.json({ 
      message: "❌ Connection failed",
      error: error.message 
    }, { status: 500 });
  }
}