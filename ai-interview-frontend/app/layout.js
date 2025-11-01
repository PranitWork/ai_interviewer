import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AI Interview App",
  description: "Practice technical interviews with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar/>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
