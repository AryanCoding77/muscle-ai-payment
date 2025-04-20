import { NextResponse } from "next/server";

export async function GET() {
  try {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!key) {
      return NextResponse.json(
        { error: "Razorpay key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({ key });
  } catch (error) {
    console.error("Error getting Razorpay key:", error);
    return NextResponse.json(
      { error: "Failed to get Razorpay key" },
      { status: 500 }
    );
  }
}
