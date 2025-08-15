import Link from "next/link";

export default function ShippingPolicy() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Shipping and Delivery Policy
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-lg prose-invert max-w-none">
          <p>
            At Muscle AI, most of our services are delivered digitally. However,
            this policy outlines our approach for any physical items or
            merchandise that may be offered. Please read this policy carefully
            before making any purchases.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            1. Digital Products and Services
          </h2>
          <p>
            Our primary offerings are digital in nature and are delivered
            immediately upon successful payment processing.
          </p>
          <p>
            Digital products include access to our AI analysis tools,
            personalized fitness reports, and one-time payment services.
          </p>
          <p>
            No physical shipping is involved for digital products. Access is
            typically granted within <span className="text-blue-400">[X]</span>{" "}
            minutes of purchase confirmation.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Physical Products</h2>
          <p>
            For any physical merchandise (such as branded items, fitness
            accessories, etc.):
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Orders are typically processed within{" "}
              <span className="text-blue-400">[X]</span> business days
            </li>
            <li>
              Shipping times vary based on your location and selected shipping
              method
            </li>
            <li>Estimated delivery timeframes will be provided at checkout</li>
          </ul>
          <p>
            We currently ship to the following regions:{" "}
            <span className="text-blue-400">[List of countries/regions]</span>
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            3. Shipping Methods and Costs
          </h2>
          <p>We offer the following shipping options:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Standard Shipping: <span className="text-blue-400">[X-X]</span>{" "}
              business days
            </li>
            <li>
              Express Shipping: <span className="text-blue-400">[X-X]</span>{" "}
              business days
            </li>
            <li>
              International Shipping:{" "}
              <span className="text-blue-400">[X-X]</span> business days
            </li>
          </ul>
          <p>
            Shipping costs are calculated based on destination, weight, and
            selected shipping method. The exact cost will be displayed at
            checkout before payment.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Order Tracking</h2>
          <p>
            Once your order ships, you will receive a confirmation email with
            tracking information where available.
          </p>
          <p>
            You can track your order by visiting your account dashboard or by
            contacting our customer support team at{" "}
            <span className="text-blue-400">support@example.com</span>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Delivery Issues</h2>
          <p>In the event of delivery issues:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Lost packages should be reported within{" "}
              <span className="text-blue-400">[X]</span> days of the estimated
              delivery date
            </li>
            <li>
              Damaged items should be reported within{" "}
              <span className="text-blue-400">[X]</span> days of receipt
            </li>
            <li>Please retain all packaging materials for potential claims</li>
          </ul>
          <p>
            Contact our support team at{" "}
            <span className="text-blue-400">support@example.com</span> to report
            any delivery issues.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to Policy</h2>
          <p>
            We reserve the right to update or modify this Shipping and Delivery
            Policy at any time without prior notice. Changes will be effective
            immediately upon posting to our website.
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
