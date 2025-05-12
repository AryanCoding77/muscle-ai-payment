import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Regular client for non-admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Map for handling plan name mismatches
const planNameMapping: Record<string, string> = {
  Starter: "Starter",
  Enterprise: "Pro",
  Business: "Ultimate",
};

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    
    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Parse the webhook payload
    let payload;
    try {
      payload = JSON.parse(body);
      console.log("Webhook payload:", payload);
    } catch (error) {
      console.error("Error parsing webhook payload:", error);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
    
    // Record the webhook event regardless of verification
    try {
      await supabaseAdmin
        .from("razorpay_webhook_events")
        .insert([
          {
            event_type: payload.event || "unknown",
            event_id: payload.id || null,
            payload: payload,
            signature: signature || null,
            verified: false, // Will update after verification
          },
        ]);
    } catch (error) {
      console.error("Error recording webhook event:", error);
      // Continue processing even if recording fails
    }
    
    if (!webhookSecret) {
      console.error("Webhook secret is not defined");
      
      // Update the event record to indicate the error
      if (payload.id) {
        await supabaseAdmin
          .from("razorpay_webhook_events")
          .update({
            error_message: "Webhook secret not configured",
            processed: true,
          })
          .eq("event_id", payload.id);
      }
      
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }
    
    if (!signature) {
      console.error("No signature found in the request");
      
      // Update the event record to indicate the error
      if (payload.id) {
        await supabaseAdmin
          .from("razorpay_webhook_events")
          .update({
            error_message: "Missing signature",
            processed: true,
          })
          .eq("event_id", payload.id);
      }
      
      return NextResponse.json(
        { error: "Invalid webhook request" },
        { status: 400 }
      );
    }
    
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");
      
    const isSignatureValid = expectedSignature === signature;
    
    // Update verification status
    if (payload.id) {
      await supabaseAdmin
        .from("razorpay_webhook_events")
        .update({
          verified: isSignatureValid,
          error_message: isSignatureValid ? null : "Signature verification failed",
        })
        .eq("event_id", payload.id);
    }
    
    if (!isSignatureValid) {
      console.error("Signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }
    
    // Handle different webhook events
    const event = payload.event;
    
    if (event === "payment.authorized" || event === "payment.captured") {
      try {
        const paymentId = payload.payload.payment.entity.id;
        const orderId = payload.payload.payment.entity.order_id;
        const amount = payload.payload.payment.entity.amount / 100; // Convert from paisa to INR
        
        console.log(`Processing ${event} for payment ${paymentId}, order ${orderId}`);
        
        // Fetch order details to get plan name and user ID
        // You would need to store this when creating the order
        const { data: orderData, error: orderError } = await supabaseAdmin
          .from("razorpay_orders")
          .select("user_id, plan_name, currency")
          .eq("order_id", orderId)
          .single();
          
        if (orderError || !orderData) {
          console.error("Error fetching order data:", orderError);
          
          // Update webhook event status
          if (payload.id) {
            await supabaseAdmin
              .from("razorpay_webhook_events")
              .update({
                error_message: `Order not found: ${orderError?.message || "Unknown error"}`,
                processed: true,
              })
              .eq("event_id", payload.id);
          }
          
          return NextResponse.json(
            { error: "Order not found", details: orderError },
            { status: 404 }
          );
        }

        // Check if this payment has already been processed
        const { data: existingTransaction } = await supabaseAdmin
          .from("subscription_transactions")
          .select("id")
          .eq("razorpay_payment_id", paymentId)
          .single();

        if (existingTransaction) {
          console.log("Payment already processed:", existingTransaction);
          
          // Update webhook event status
          if (payload.id) {
            await supabaseAdmin
              .from("razorpay_webhook_events")
              .update({
                error_message: "Payment already processed",
                processed: true,
              })
              .eq("event_id", payload.id);
          }
          
          return NextResponse.json({ 
            success: true, 
            message: "Payment already processed" 
          });
        }
        
        const { user_id: userId, plan_name: planName, currency } = orderData;
        console.log("Order data found:", { userId, planName });
        
        // Get the subscription plan ID
        const mappedPlanName = planNameMapping[planName] || planName;
        console.log(`Looking for subscription plan: "${mappedPlanName}"`);
        
        const { data: planData, error: planError } = await supabaseAdmin
          .from("subscription_plans")
          .select("id, name")
          .ilike("name", mappedPlanName)
          .single();
          
        if (planError || !planData) {
          console.error("Error fetching subscription plan:", planError);
          
          // Attempt to list all available plans for debugging
          const { data: allPlans } = await supabaseAdmin
            .from("subscription_plans")
            .select("id, name");
          
          console.log("Available subscription plans:", allPlans);
          
          // Update webhook event status
          if (payload.id) {
            await supabaseAdmin
              .from("razorpay_webhook_events")
              .update({
                error_message: `Subscription plan not found: ${planError?.message || "Unknown error"}`,
                processed: true,
              })
              .eq("event_id", payload.id);
          }
          
          return NextResponse.json(
            { 
              error: "Subscription plan not found", 
              details: planError,
              searchedFor: mappedPlanName,
              availablePlans: allPlans
            },
            { status: 404 }
          );
        }
        
        console.log("Found subscription plan:", planData);
        
        // Check if user already has an active subscription
        const { data: existingSubscription } = await supabaseAdmin
          .from("user_subscriptions")
          .select("id, status")
          .eq("user_id", userId)
          .eq("status", "active")
          .single();
        
        if (existingSubscription) {
          console.log("User already has an active subscription:", existingSubscription);
          
          // Record the transaction but don't create a new subscription
          const transactionData = {
            user_id: userId,
            plan_id: planData.id,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            amount: amount,
            currency: currency || "INR",
            status: "success",
            payment_date: new Date().toISOString(),
            verified: true,
          };
          
          await supabaseAdmin
            .from("subscription_transactions")
            .insert([transactionData]);
          
          // Update order status
          await supabaseAdmin
            .from("razorpay_orders")
            .update({ status: "paid" })
            .eq("order_id", orderId);
          
          // Update webhook event status
          if (payload.id) {
            await supabaseAdmin
              .from("razorpay_webhook_events")
              .update({
                processed: true,
              })
              .eq("event_id", payload.id);
          }
          
          return NextResponse.json({ 
            success: true, 
            message: "Payment processed, user already has an active subscription" 
          });
        }
        
        // Calculate subscription dates
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30); // 30 days subscription
        
        // Create a new user subscription record
        const subscriptionData = {
          user_id: userId,
          plan_id: planData.id,
          start_date: today.toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
        };
        
        const { data: subscription, error: subscriptionError } = await supabaseAdmin
          .from("user_subscriptions")
          .insert([subscriptionData])
          .select()
          .single();
          
        if (subscriptionError) {
          console.error("Error creating user subscription:", subscriptionError);
          
          // Update webhook event status
          if (payload.id) {
            await supabaseAdmin
              .from("razorpay_webhook_events")
              .update({
                error_message: `Failed to create subscription: ${subscriptionError?.message || "Unknown error"}`,
                processed: true,
              })
              .eq("event_id", payload.id);
          }
          
          return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
          );
        }
        
        // Record the transaction
        const transactionData = {
          user_id: userId,
          plan_id: planData.id,
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          amount: amount,
          currency: currency || "INR",
          status: "success",
          payment_date: new Date().toISOString(),
          verified: true,
        };
        
        const { data: transaction, error: transactionError } = await supabaseAdmin
          .from("subscription_transactions")
          .insert([transactionData])
          .select()
          .single();
          
        if (transactionError) {
          console.error("Error recording transaction:", transactionError);
          // Continue despite transaction recording error
        }
        
        // Update order status
        await supabaseAdmin
          .from("razorpay_orders")
          .update({ status: "paid" })
          .eq("order_id", orderId);
        
        // Update webhook event status
        if (payload.id) {
          await supabaseAdmin
            .from("razorpay_webhook_events")
            .update({
              processed: true,
            })
            .eq("event_id", payload.id);
        }
        
        console.log("Payment processed successfully");
        return NextResponse.json({ success: true });
      
      } catch (error) {
        console.error(`Error processing ${event}:`, error);
        
        // Update webhook event status
        if (payload.id) {
          await supabaseAdmin
            .from("razorpay_webhook_events")
            .update({
              error_message: `Processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
              processed: true,
            })
            .eq("event_id", payload.id);
        }
        
        return NextResponse.json(
          { error: "Error processing payment event" },
          { status: 500 }
        );
      }
    } else {
      // For all other webhook events, just mark as processed
      console.log(`Received webhook event: ${event}`);
      
      if (payload.id) {
        await supabaseAdmin
          .from("razorpay_webhook_events")
          .update({
            processed: true,
          })
          .eq("event_id", payload.id);
      }
      
      return NextResponse.json({ 
        success: true,
        message: `Webhook event ${event} acknowledged` 
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 