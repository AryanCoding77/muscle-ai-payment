# Quota Reset Functionality

This document explains how the monthly quota reset functionality works in the MuscleAI application and provides instructions on how to test it.

## How Quota Reset Works

The MuscleAI application implements a monthly quota system for muscle analyses based on the user's subscription plan:

- **Starter Plan**: 5 analyses per month
- **Pro/Enterprise Plan**: 20 analyses per month
- **Ultimate/Business Plan**: 100 analyses per month

The quota automatically resets 30 days after the last reset date. This is implemented using:

1. A PostgreSQL trigger function (`reset_user_quota`) that checks if it's been more than 30 days since the last reset
2. A trigger (`reset_monthly_quota`) that runs this function whenever a user subscription record is updated
3. A function (`check_and_increment_quota`) that checks if a quota reset is needed before incrementing usage

## Testing the Quota Reset

We've provided two scripts to test and fix the quota reset functionality:

### 1. `test-quota-reset.js`

This script tests if the quota reset functionality is working correctly by:
- Setting the last reset date to 31 days ago (simulating a month passing)
- Triggering the quota check function
- Verifying that the quota is reset to 0 and the reset date is updated

To run the test:

```bash
node test-quota-reset.js [user_id]
```

Where `[user_id]` is optional and defaults to a test user ID.

### 2. `fix-quota-reset-function.sql`

This SQL file contains the definitions for the quota reset functions and trigger. If the test script detects any issues, you can run this SQL in your Supabase SQL editor to fix the functions.

## Manual Testing

You can also manually test the quota reset functionality:

1. Find a user with an active subscription
2. Update their `last_quota_reset` date to more than 30 days ago:
   ```sql
   UPDATE user_subscriptions
   SET last_quota_reset = NOW() - INTERVAL '31 days'
   WHERE user_id = 'your-user-id' AND status = 'active';
   ```
3. Trigger a quota check by having the user analyze an image or by running:
   ```sql
   SELECT check_and_increment_quota('your-user-id');
   ```
4. Verify that the quota has been reset to 0 (or 1 after the increment) and the reset date updated:
   ```sql
   SELECT quota_used, last_quota_reset 
   FROM user_subscriptions 
   WHERE user_id = 'your-user-id' AND status = 'active';
   ```

## Troubleshooting

If the quota reset is not working:

1. Check if the `reset_user_quota` function exists:
   ```sql
   SELECT pg_get_functiondef('reset_user_quota()'::regprocedure);
   ```

2. Check if the trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'reset_monthly_quota';
   ```

3. If either is missing, run the `fix-quota-reset-function.sql` script in your Supabase SQL editor.

4. Verify that the `user_subscriptions` table has the required columns:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'user_subscriptions' 
   AND column_name IN ('quota_used', 'monthly_quota', 'last_quota_reset');
   ```

## Conclusion

The monthly quota reset functionality is a critical part of the subscription system. It ensures that users get their full quota of analyses each month, encouraging continued use of the application. 