# Muscle Analysis AI

A web application that analyzes body photos using Llama 3.2 Vision to identify weak or underdeveloped muscles and provide feedback for improvement.

## Features

- Upload body photos for AI-powered muscle analysis
- Receive detailed feedback on weak or underdeveloped muscles
- Get exercise recommendations for improvement
- User-friendly interface with real-time image preview
- Secure API implementation
- Efficient caching system for faster repeated analyses
- Rate limiting to prevent API abuse

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Redis server (local or cloud-hosted)
- A Together AI API key (get one at [https://api.together.xyz/settings/api-keys](https://api.together.xyz/settings/api-keys))

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   TOGETHER_API_KEY=your_api_key_here
   REDIS_URL=your_redis_url_here  # Optional: defaults to localhost:6379
   ```

### Setting up Redis

#### Local Development

1. Install Redis on your machine:

   - Windows: Use [Windows Subsystem for Linux (WSL)](https://redis.io/docs/getting-started/installation/install-redis-on-windows/) or [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
   - Mac: `brew install redis`
   - Linux: `sudo apt-get install redis-server`

2. Start Redis server:
   - Windows (WSL): `sudo service redis-server start`
   - Mac/Linux: `redis-server`

#### Production

For production, we recommend using a managed Redis service like:

- Redis Cloud
- Amazon ElastiCache
- Azure Cache for Redis
- Google Cloud Memorystore

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## How to Use

1. Click the upload area or drag and drop a body photo
2. Review the image preview
3. Click "Analyze Muscles"
4. View the AI's analysis of weak or underdeveloped muscles, including:
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

## Technology Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- Together AI's Llama 3.2 Vision model for image analysis
- Redis for efficient caching
- Auth0 for authentication

## License

This project is licensed under the MIT License.
