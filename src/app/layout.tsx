import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LanguageSelector from "@/components/LanguageSelector";
import { TranslationProvider } from "@/contexts/TranslationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TravelCue - Travel Destination Overview",
  description: "Get a comprehensive overview of any travel destination including weather, events, safety, currency, and more. Plan your next trip with real-time data.",
  keywords: "travel, destination, weather, events, safety, currency, tourism, trip planning",
  authors: [{ name: "TravelCue Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TranslationProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Language Selector Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">TravelCue</h1>
                  </div>
                  <LanguageSelector />
                </div>
              </div>
            </header>
            
            {children}
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
}
