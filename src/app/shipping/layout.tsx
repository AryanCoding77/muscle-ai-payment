import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy | MuscleAI",
  description:
    "Information about MuscleAI's shipping methods, delivery times, and policies for physical products.",
  robots: "index, follow",
};

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
