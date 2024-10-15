import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { author } from "@/lib/constants";
import { ThemeProvider } from "./_components/themeProvider";

const interVariable = localFont({
  src: "./fonts/Inter/variable.ttf",
  variable: "--font-inter-variable",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `${author}'s Blog`,
  description: `This is the blog of ${author}, where he talks about tech and ai and personal life.`,
  openGraph : {
    title: `${author}'s Blog`,
    images: ["@/public/assets/images/avishakeadhikary.jpg"]
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
