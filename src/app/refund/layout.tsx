import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy | MuscleAI",
  description:
    "Learn about MuscleAI's cancellation and refund policies for subscriptions and services.",
  robots: "index, follow",
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
