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
          Cancellation and Refund Policy
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-lg prose-invert max-w-none">
          <p>
            Thank you for choosing Muscle AI. We strive to provide you with the
            best possible experience. Please read this Cancellation and Refund
            Policy carefully before making any purchases.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            1. Subscription Cancellation
          </h2>
          <p>
            You may cancel your subscription at any time through your account
            settings or by contacting our support team at{" "}
            <span className="text-blue-400">support@example.com</span>.
          </p>
          <p>
            Upon cancellation, you will maintain access to your paid features
            until the end of your current billing period.
          </p>
          <p>
            We do not provide automatic prorated refunds for the unused portion
            of your subscription period.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            2. Refund Eligibility
          </h2>
          <p>
            Refund requests will be considered under the following
            circumstances:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Technical issues that severely impact service usage and cannot be
              resolved within <span className="text-blue-400">[X]</span>{" "}
              business days
            </li>
            <li>Incorrect charges or billing errors</li>
            <li>
              Service unavailability extending beyond{" "}
              <span className="text-blue-400">[X]</span> consecutive hours
            </li>
          </ul>
          <p>
            All refund requests must be submitted within{" "}
            <span className="text-blue-400">[X]</span> days of the purchase date
            to be considered.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Refund Process</h2>
          <p>
            To request a refund, please contact our support team at{" "}
            <span className="text-blue-400">support@example.com</span> with your
            order details and reason for the refund.
          </p>
          <p>
            We will review your request and respond within{" "}
            <span className="text-blue-400">[X]</span> business days.
          </p>
          <p>
            Approved refunds will be processed using the original payment method
            and may take <span className="text-blue-400">[X-X]</span> business
            days to appear in your account.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            4. Non-Refundable Items
          </h2>
          <p>The following are generally not eligible for refunds:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Subscriptions that have been active for more than{" "}
              <span className="text-blue-400">[X]</span> days
            </li>
            <li>One-time services that have been fully delivered</li>
            <li>Purchases made using promotional credits or gift cards</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes to Policy</h2>
          <p>
            We reserve the right to update or modify this Cancellation and
            Refund Policy at any time without prior notice. Changes will be
            effective immediately upon posting to our website.
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
