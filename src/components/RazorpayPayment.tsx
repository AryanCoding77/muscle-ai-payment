"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useUser } from "@/context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  planName: string;
  amount: number;
  onSuccess: () => void;
  onFailure: () => void;
}

export default function RazorpayPayment({
  planName,
  amount,
  onSuccess,
  onFailure,
}: RazorpayPaymentProps) {
  const { userInfo } = useUser();
  const { user } = useAuth0();
  const [isProcessing, setIsProcessing] = useState(false);

  const saveSubscription = async (response: any) => {
    setIsProcessing(true);
    console.log(
      "Saving subscription for payment:",
      response.razorpay_payment_id
    );

    // Calculate dates
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30); // 30 days subscription

    // First, check if the database has the subscription plans
    try {
      console.log("Checking and initializing database plans...");
      const checkDbResponse = await fetch("/api/check-database");
      const dbData = await checkDbResponse.json();
      console.log("Database check result:", dbData);
    } catch (error) {
      console.error("Error checking database:", error);
      // Continue anyway as this is just a precaution
    }

    // Save to database
    try {
      console.log(
        "Attempting to save subscription via payment-success endpoint"
      );
      const saveResponse = await fetch("/api/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.sub, // Auth0 user ID
          planName,
          amount,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          startDate: today.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error("Payment-success endpoint failed:", errorData);

        // Try a fallback approach using create-subscription endpoint
        console.log("Attempting fallback with create-subscription endpoint");
        const fallbackResponse = await fetch("/api/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.sub,
            planName,
            amount,
            paymentId: response.razorpay_payment_id,
            currency: "INR",
          }),
        });

        if (!fallbackResponse.ok) {
          const fallbackError = await fallbackResponse.json();
          console.error(
            "Fallback subscription creation failed:",
            fallbackError
          );
          throw new Error("Both subscription creation methods failed");
        }

        const fallbackResult = await fallbackResponse.json();
        console.log(
          "Fallback subscription creation succeeded:",
          fallbackResult
        );
        toast.success("Your subscription has been activated!");
        onSuccess();
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const result = await saveResponse.json();
        console.log("Subscription saved successfully:", result);
        toast.success("Your subscription has been activated!");
        onSuccess();
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Error saving subscription to database:", error);
      toast.error(
        "Payment successful, but there was an issue activating your subscription."
      );
      onFailure();
    } finally {
      setIsProcessing(false);
    }
  };

  const initializeRazorpay = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // First, ensure subscription plans exist
      try {
        console.log("Checking subscription plans...");
        const plansResponse = await fetch("/api/check-subscription-plans");
        const plansData = await plansResponse.json();
        console.log("Subscription plans check result:", plansData);
      } catch (error) {
        console.error("Error checking subscription plans:", error);
        // Continue anyway as this is just a precaution
      }

      // Fetch Razorpay key
      const keyResponse = await fetch("/api/get-razorpay-key");
      if (!keyResponse.ok) {
        throw new Error("Failed to fetch Razorpay key");
      }
      const keyData = await keyResponse.json();

      // Create order on your backend
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          planName,
          userId: user?.sub, // Add user ID for later verification
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating order");
      }

      // Initialize Razorpay payment
      const options = {
        key: keyData.key,
        amount: data.amount,
        currency: data.currency,
        name: "MuscleAI",
        description: `${planName} Plan - One-time Payment`,
        order_id: data.orderId,
        prefill: {
          name: userInfo?.name || "",
          email: userInfo?.email || "",
        },
        handler: async function (response: any) {
          // Handle successful payment
          console.log("Payment successful:", response);
          await saveSubscription(response);
        },
        modal: {
          ondismiss: function () {
            // Handle payment modal dismissal
            console.log("Payment modal closed");
            setIsProcessing(false);
            onFailure();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
      onFailure();
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <button
        onClick={initializeRazorpay}
        className="w-full py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors font-medium text-sm"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Get Started"}
      </button>
    </>
  );
}
