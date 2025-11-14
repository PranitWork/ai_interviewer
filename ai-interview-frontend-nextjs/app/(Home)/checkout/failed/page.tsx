"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold text-red-600">
          Payment Failed!
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </ProtectedRoute>
  );
}
