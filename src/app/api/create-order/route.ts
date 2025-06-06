import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, planName, userId, currency = "USD", referralCode = null } = body;

    if (!amount || !planName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (cents)
      currency: currency,
      notes: {
        planName: planName,
        userId: userId,
        referralCode: referralCode || "direct", // Include referral info in Razorpay notes
      },
    });

    // Store order information in the database
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("razorpay_orders")
      .insert([
        {
          order_id: order.id,
          user_id: userId,
          plan_name: planName,
          amount: amount,
          currency: order.currency,
          referral_code: referralCode, // Store referral code in the database
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Error storing order information:", orderError);
      // Continue despite database error to not block the payment flow
    } else {
      console.log("Order information stored successfully:", orderData);
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
