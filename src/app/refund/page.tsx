import Link from "next/link";

export default function RefundPolicy() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Refund and Cancellation Policy
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-lg prose-invert max-w-none">
          <p>
            Thank you for choosing Muscle AI. Please read our refund and
            cancellation policy carefully before subscribing to our services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">No Refund Policy</h2>
          <p>
            At Muscle AI, we do not offer refunds for any payments made for our
            services. All sales are final once payment is processed.
          </p>
          <p>
            By subscribing to our service, you acknowledge and agree that we do
            not provide refunds under any circumstances, including but not
            limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Dissatisfaction with the service</li>
            <li>Technical issues beyond our control</li>
            <li>Change of mind or accidental purchases</li>
            <li>Unused analysis credits</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">No Cancellation Policy</h2>
          <p>
            We do not offer cancellations for purchases at Muscle AI. When
            you make a payment for our service, you are committing to the full
            purchase.
          </p>
          <p>
            All purchases are one-time payments that provide access to the specified
            number of analyses. There are no automatic renewals.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this policy, please contact us at{" "}
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
