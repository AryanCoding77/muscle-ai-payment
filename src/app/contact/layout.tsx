import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | MuscleAI",
  description:
    "Contact MuscleAI for support, questions, or feedback. We're here to help.",
  robots: "index, follow",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
