# Subscription Database Setup

This document explains how to set up the required Supabase tables for the subscription system to work correctly.

## Setting up the Subscription Tables

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project (https://cjrjvjwgzuzvbwzaufjv.supabase.co/)
3. Go to the SQL Editor in the left sidebar
4. Create a New Query
5. Copy and paste the SQL from the `subscription-migration.sql` file
6. Click "Run" to execute the SQL

## Table Structures

The subscription system uses three main tables:

### 1. subscription_plans

Stores information about available subscription plans:

- `id` - UUID primary key (automatically generated)
- `name` - Name of the plan (e.g., "Starter", "Enterprise", "Business")
- `description` - Text description of the plan
- `price` - Numeric price of the plan (in USD)
- `duration_days` - Number of days the subscription lasts (default: 30)
- `features` - JSON field containing features included in the plan
- `is_active` - Boolean indicating if the plan is currently available
- `created_at` - Timestamp when the plan was created
- `currency` - Currency of the plan price (default: "USD")

### 2. user_subscriptions

Records active and expired user subscriptions:

- `id` - UUID primary key (automatically generated)
- `user_id` - Auth0 user ID
- `subscription_id` - Reference to the subscription plan
- `start_date` - When the subscription begins
- `end_date` - When the subscription ends
- `status` - Current status ("active", "expired", or "cancelled")
- `created_at` - Timestamp when the subscription was created

### 3. subscription_transactions

Records payment transactions:

- `id` - UUID primary key (automatically generated)
- `user_id` - Auth0 user ID
- `subscription_id` - Reference to the subscription plan
- `razorpay_payment_id` - Payment ID from Razorpay
- `amount` - Payment amount
- `currency` - Payment currency (default: "USD")
- `status` - Payment status ("success", "failed", or "pending")
- `payment_date` - Timestamp of the payment
- `metadata` - Additional payment information as JSON

## Default Plans

The system initializes with three default subscription plans:

1. **Starter Plan** - $4 USD
   - Basic muscle analysis
   - 5 analyses per month
   - Email support

2. **Enterprise/Pro Plan** - $7 USD
   - Advanced muscle analysis
   - 20 analyses per month
   - Priority support

3. **Business/Ultimate Plan** - $14 USD
   - Expert-level analysis
   - 100 analyses per month
   - 24/7 dedicated support

## Permissions

The SQL setup includes Row Level Security (RLS) policies that:

1. Allow authenticated users (logged-in users) to view and create subscriptions for themselves
2. Allow authenticated users to view their own transactions
3. Prevent users from viewing other users' subscription data

## Troubleshooting

If subscription creation fails, check:

1. The Supabase connection credentials in your `.env.local` file
2. That the tables exist with the correct structure in Supabase
3. That the RLS policies are set up correctly
4. Network requests in your browser's developer tools for specific error messages

## Viewing Data

You can view subscription data in the Supabase dashboard:

1. Go to your Supabase dashboard
2. Select the "Table Editor" from the sidebar
3. Open the respective tables to view subscription data
