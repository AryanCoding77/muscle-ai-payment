import Link from "next/link";

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Terms of Service
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-lg prose-invert max-w-none">
          <p>
            Welcome to Muscle AI! By using our website, you agree to follow
            these terms. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Use of Service</h2>
          <p>
            Muscle AI provides AI-based analysis of user-uploaded photos for
            fitness insights.
          </p>
          <p>You must be at least 13 years old to use our services.</p>
          <p>Do not upload illegal, offensive, or copyrighted content.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            2. Data and AI Accuracy
          </h2>
          <p>
            The AI-generated results are for informational purposes only and
            should not replace professional advice.
          </p>
          <p>We do not guarantee 100% accuracy in AI analysis.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            3. User Responsibilities
          </h2>
          <p>
            You are responsible for the photos you upload and the actions you
            take based on the results.
          </p>
          <p>
            Do not misuse the service or attempt to hack or disrupt the website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            4. Privacy and Security
          </h2>
          <p>
            We respect your privacy. Read our{" "}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>{" "}
            to understand how we handle your data.
          </p>
          <p>
            We may store uploaded images temporarily for processing but do not
            use them for any other purpose.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service
            means you accept the changes.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
