import Link from "next/link";

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="text-gray-400 mb-8 text-center">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-lg prose-invert max-w-none">
          <p>
            At Muscle AI, we are committed to protecting your privacy. This
            policy explains how we collect, use, and protect your data.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p>
            <strong>Uploaded Photos:</strong> When you upload an image, we
            process it using AI.
          </p>
          <p>
            <strong>Usage Data:</strong> We collect logs, analytics, and device
            information to improve our services.
          </p>
          <p>
            <strong>Contact Information (if provided):</strong> If you contact
            us, we may store your email for support purposes.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p>To analyze and provide AI-generated fitness insights.</p>
          <p>To improve website functionality and user experience.</p>
          <p>To ensure security and prevent misuse of the service.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            3. Data Storage and Security
          </h2>
          <p>
            Uploaded images may be temporarily stored for processing but are not
            retained permanently.
          </p>
          <p>We do not share or sell your data to third parties.</p>
          <p>We use encryption and security measures to protect user data.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            4. Third-Party Services
          </h2>
          <p>
            We use Together AI API to analyze photos. They may have their own
            privacy policies.
          </p>
          <p>
            We may use third-party analytics tools to track website performance.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
          <p>You can request the deletion of your data by contacting us.</p>
          <p>
            You can stop using our service at any time if you disagree with our
            policies.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            6. Updates to This Policy
          </h2>
          <p>
            We may update this Privacy Policy. We will notify users of
            significant changes.
          </p>

          <p className="mt-8">
            For questions or concerns, contact us at{" "}
            <a
              href="mailto:support@muscleai.com"
              className="text-blue-400 hover:text-blue-300"
            >
              support@muscleai.com
            </a>
            .
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline mr-6"
          >
            Return to Home
          </Link>
          <Link
            href="/terms"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
