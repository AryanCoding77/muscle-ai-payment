import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';

// WARNING: This endpoint is for testing purposes only
// It should be disabled or removed in production

export async function GET(req: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    // Get userId from query parameter
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const planName = searchParams.get('plan') || 'Starter'; // Default to starter plan

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // 1. Get the subscription plan ID
    const { data: planData, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('id, name')
      .ilike('name', planName)
      .single();

    if (planError || !planData) {
      return NextResponse.json(
        { error: 'Unable to find subscription plan', details: planError?.message },
        { status: 404 }
      );
    }

    // 2. Create or update user's subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 day subscription

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    let subscriptionResult;

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          plan_id: planData.id,
          end_date: endDate.toISOString(),
          status: 'active',
        })
        .eq('id', existingSubscription.id)
        .select()
        .single();

      subscriptionResult = { data, error, action: 'updated' };
    } else {
      // Create new subscription
      const { data, error } = await supabaseAdmin
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planData.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
        })
        .select()
        .single();

      subscriptionResult = { data, error, action: 'created' };
    }

    if (subscriptionResult.error) {
      return NextResponse.json(
        { error: 'Failed to create subscription', details: subscriptionResult.error.message },
        { status: 500 }
      );
    }

    // 3. Record the test transaction
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('subscription_transactions')
      .insert({
        user_id: userId,
        plan_id: planData.id,
        razorpay_payment_id: `test_${Date.now()}`,
        amount: 1999, // Test amount
        currency: 'INR',
        status: 'success',
        payment_date: new Date().toISOString(),
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      message: `Test subscription ${subscriptionResult.action} successfully`,
      subscription: subscriptionResult.data,
      transaction: transaction,
      transactionError: transactionError ? transactionError.message : null,
    });
  } catch (error: any) {
    console.error('Error creating test subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create test subscription', details: error.message },
      { status: 500 }
    );
  }
} 