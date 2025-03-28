# Muscle Analysis AI

A web application that analyzes body photos using AI to identify weak or underdeveloped muscles and provide feedback for improvement.

![Muscle AI Screenshot](https://i.imgur.com/PLACEHOLDER.png)

## Features

- Upload body photos for AI-powered muscle analysis
- Receive detailed feedback on weak or underdeveloped muscles
- Get exercise recommendations for improvement
- User-friendly interface with real-time image preview
- Secure API implementation
- Efficient caching system for faster repeated analyses
- Rate limiting to prevent API abuse

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Auth0
- **AI**: Together AI's Llama 3.2 Vision model
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Together AI API key (get one at [https://api.together.xyz/settings/api-keys](https://api.together.xyz/settings/api-keys))
- An Auth0 account and application (for authentication)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your API keys:
   ```
   TOGETHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_AUTH0_DOMAIN=your_auth0_domain_here
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id_here
   ```

### Auth0 Configuration

1. Create a new application in Auth0 dashboard
2. Configure the following URLs:
   - Allowed Callback URLs: `http://localhost:3000/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3. Get your Auth0 domain and client ID and add them to `.env.local`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## How to Use

1. Sign in with your account
2. Click the upload area or drag and drop a body photo
3. Review the image preview
4. Click "Analyze Muscles"
5. View the AI's analysis of weak or underdeveloped muscles, including:
   - Specific muscle groups that need work
   - Development rating on a scale of 1-10
   - Recommended exercises for improvement

## How It Works

This application uses Together AI's Llama 3.2 Vision model to analyze body images. The model has been instructed to:

1. Identify underdeveloped or weak muscle groups
2. Rate their development
3. Suggest specific exercises for improvement

The analysis is processed through a secure API endpoint, with all processing done on Together AI's servers. The application implements:

- Image caching: Identical images return cached results for faster response
- Rate limiting: Prevents API abuse
- Error handling: Graceful handling of API and processing errors
- Secure data handling: No permanent storage of user images

## Privacy and Terms

- [Terms of Service](/terms)
- [Privacy Policy](/privacy)

## License

This project is licensed under the MIT License.

## Acknowledgements

- Together AI for providing the vision model API
- Auth0 for authentication services
- Vercel for hosting services
