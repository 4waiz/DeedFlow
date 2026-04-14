import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeedFlow — AI Property Compliance for UAE",
  description:
    "AI agent that turns fractional/tokenized property transactions into a guided, compliant workflow for the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    var stored = window.localStorage.getItem('deedflow-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`,
      }}
    />
  );
}
