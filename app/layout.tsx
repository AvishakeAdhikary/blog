import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { author } from "@/lib/constants";
import { ThemeProvider } from "./_components/themeProvider";

const interVariable = localFont({
  src: "./fonts/inter/variable.ttf",
  variable: "--font-inter-variable",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `${author}'s Blog`,
  description: `Join ${author}, a Machine Learning Engineer, as he shares insights on AI technology, data science, and personal growth. Explore engaging discussions on machine learning, practical tips, and reflections on life, blending professional expertise with personal experiences.`,
  openGraph: {
    title: `${author}'s Blog`,
    images: ["https://raw.githubusercontent.com/AvishakeAdhikary/blog/refs/heads/main/public/assets/images/ogcover.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${interVariable.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
