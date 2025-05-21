# Payment Security Setup

This document describes how to properly set up and configure the payment security features for the MuscleAI application.

## Razorpay Security Implementation

The application implements several security measures for handling payments through Razorpay:

1. Server-side order creation
2. Payment signature verification
3. Webhook integration for payment verification
4. Double verification using Razorpay API

## Configuration Steps

### 1. Set Environment Variables

Make sure all the required environment variables are set:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### 2. Configure Razorpay Webhooks

1. Log in to your Razorpay Dashboard
2. Go to Settings > Webhooks
3. Click on "Add New Webhook"
4. Enter your webhook URL: `https://your-domain.com/api/razorpay-webhook`
5. Select the events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
6. Create a secret and store it as `RAZORPAY_WEBHOOK_SECRET` in your environment variables
7. Enable the webhook

### 3. Run Database Migrations

Run the Supabase migrations to create the necessary tables:

```bash
npx supabase db push
```

## Security Verification Flow

1. **Order Creation**:
   - User selects a plan
   - Server creates an order on Razorpay and stores order information
   - Client receives order ID and initiates payment

2. **Client-side Payment**:
   - User enters payment information
   - Razorpay handles payment collection
   - Payment success callback is triggered with payment ID, order ID, and signature

3. **Signature Verification**:
   - Server verifies the payment signature using Razorpay secret
   - Ensures the payment data hasn't been tampered with

4. **API Verification**:
   - Server verifies payment status with Razorpay API
   - Confirms payment has been captured or authorized

5. **Webhook Verification**:
   - Razorpay sends webhook event to the server
   - Server verifies webhook signature
   - Server processes payment and activates subscription if verified

## Testing Payments

Use the test card details for testing:

```
Card Number: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
Name: test user
3D Secure Password: 1234
```

## Security Best Practices

1. **Never expose Razorpay secret key** in client-side code
2. Always verify signatures for both client callbacks and webhooks
3. Always check payment status with Razorpay API
4. Store transaction records with verification status
5. Implement idempotency to avoid duplicate processing
6. Use the test mode when in development environment 

## Troubleshooting Webhooks

If you're experiencing issues with webhooks, follow these troubleshooting steps:

1. **Check Webhook Events**:
   Visit `/api/check-webhook-events` in development mode to see all received webhook events and their statuses.

2. **Check Subscription Plans**:
   Visit `/api/check-subscription-plans` to ensure subscription plans are properly configured.

3. **Common Issues**:
   - **Missing Subscription Plans**: If you see "Subscription plan not found" errors, use the `/api/check-subscription-plans` endpoint to initialize the plans.
   - **Webhook Signature Failures**: Ensure your RAZORPAY_WEBHOOK_SECRET matches the secret configured in the Razorpay dashboard.
   - **Order Not Found**: If webhooks report "Order not found" errors, ensure the order creation process is storing orders in the database.

4. **Webhook Logging**:
   All webhook events are logged to the `razorpay_webhook_events` table with:
   - Event type
   - Payload
   - Verification status
   - Processing status
   - Any errors encountered

5. **Manual Verification**:
   If automatic webhook verification is failing, you can check the payment status using the Razorpay dashboard or API.

## Webhook Testing

For testing webhooks locally:

1. Use a service like ngrok to expose your local server to the internet
2. Create a temporary webhook in the Razorpay dashboard pointing to your ngrok URL
3. Make test payments and monitor webhook events in the `/api/check-webhook-events` endpoint

## Production Best Practices

1. **Enable Retry Logic**: Razorpay can retry failed webhook deliveries
2. **Multiple Verification**: Use both webhook events and client-side verification
3. **Monitoring**: Set up alerts for webhook failures
4. **Idempotency**: Ensure processing a webhook multiple times doesn't cause duplicate subscriptions

## Advanced Security

For even more security, consider:

1. **IP Whitelisting**: Only accept webhook calls from Razorpay IPs
2. **Database Encryption**: Store sensitive payment data encrypted at rest
3. **Audit Logging**: Log all payment events for regulatory compliance
4. **Redundancy**: Implement both webhook and polling verification methods 