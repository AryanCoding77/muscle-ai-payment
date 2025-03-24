# Muscle Analysis AI

A web application that analyzes body photos using Llama 3.2 Vision to identify weak or underdeveloped muscles and provide feedback for improvement.

## Features

- Upload body photos for AI-powered muscle analysis
- Receive detailed feedback on weak or underdeveloped muscles
- Get exercise recommendations for improvement
- User-friendly interface with real-time image preview
- Secure API implementation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Together AI API key (get one at [https://api.together.xyz/settings/api-keys](https://api.together.xyz/settings/api-keys))

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Together AI API key:
   ```
   TOGETHER_API_KEY=your_api_key_here
   ```

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

The analysis is processed through a secure API endpoint, with all processing done on Together AI's servers.

## Technology Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- Together AI's Llama 3.2 Vision model for image analysis

## License

This project is licensed under the MIT License.
