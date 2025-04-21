# MuscleAI

An AI-powered fitness companion application built with Next.js and Supabase.

## Features

- Personalized workout plans
- Exercise library with detailed instructions
- Progress tracking
- Contact form with Supabase integration

## Contact Form Integration

The contact page includes a fully functional form that stores submissions in a Supabase database table. To set up this functionality:

1. Follow the instructions in `SUPABASE-SETUP.md` to create the required database table
2. Make sure your environment variables in `.env.local` include the correct Supabase credentials
3. The form will automatically store submissions in your Supabase "contact" table

## Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env.local` and add your API keys
4. Run the development server with `npm run dev`

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_EXERCISEDB_API_KEY=your-exercisedb-api-key
NEXT_PUBLIC_EXERCISEDB_HOST=exercisedb.p.rapidapi.com
```

## Deployment

This project can be deployed on Vercel or any other platform that supports Next.js applications.

## License

[MIT](LICENSE)
