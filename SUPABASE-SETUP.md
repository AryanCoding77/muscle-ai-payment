# Supabase Setup for Contact Form

This document explains how to set up the required Supabase table for the contact form to work correctly.

## Setting up the Contact Table

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project (https://cjrjvjwgzuzvbwzaufjv.supabase.co/)
3. Go to the SQL Editor in the left sidebar
4. Create a New Query
5. Copy and paste the SQL from the `supabase-migration.sql` file
6. Click "Run" to execute the SQL

## Table Structure

The contact table will have the following columns:

- `id` - UUID primary key (automatically generated)
- `name` - Text field for the contact's name
- `email` - Text field for the contact's email address
- `subject` - Text field for the message subject
- `message` - Text field for the message content
- `created_at` - Timestamp for when the message was submitted
- `archived` - Boolean flag for marking messages as archived/processed

## Permissions

The SQL setup includes Row Level Security (RLS) policies that:

1. Allow anonymous users (website visitors) to INSERT records (submit contact forms)
2. Allow authenticated users (admins) to SELECT and UPDATE records
3. No one can DELETE records (for data retention purposes)

## Viewing Submissions

Once the form is live, you can view submissions by:

1. Going to your Supabase dashboard
2. Selecting the "Table Editor" from the sidebar
3. Opening the "contact" table

## Troubleshooting

If form submissions fail, check:

1. The Supabase connection credentials in your `.env.local` file
2. That the table exists with the correct structure in Supabase
3. That the RLS policies are set up correctly
4. Network requests in your browser's developer tools for specific error messages
