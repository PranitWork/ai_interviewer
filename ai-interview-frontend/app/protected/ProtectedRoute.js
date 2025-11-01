// app/protected/ProtectedRoute.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login"); // redirect to login if not logged in
    }
  }, []);

  return <>{isAuthenticated() && children}</>;
}
