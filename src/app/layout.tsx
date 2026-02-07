import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeedFlow — AI Property Compliance for UAE",
  description: "AI agent that turns fractional/tokenized property transactions into a guided, compliant workflow for the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
