import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./providers/StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppInitializer from "./components/AppInitializer";
import { ToastContainer } from "react-toastify";
import Preloader from "./components/preloader/SwarAiPreloader";
import { DarkLight } from "./components/DarkLightMood/DarkLight";

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwarAi",
  description: "AI Interview Preparation Platform",
  icons: {
    icon: "/favicon.jpg", // ✅ Use your JPG here
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg", // optional for Apple devices
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            <AppInitializer />
            <Preloader />
            <DarkLight />
            <Analytics/>
            <SpeedInsights/>
            {children}
          </GoogleOAuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
