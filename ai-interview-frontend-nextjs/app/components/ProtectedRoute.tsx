"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { asyncCurrentUser } from "@/app/Store/actions/authActions";
import type { AppDispatch, RootState } from "@/app/Store/Store";
import { useAppDispatch } from "../Store/hook";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
 const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const res = await dispatch(asyncCurrentUser());

      if (!res.success) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    };

    if (!user) {
      verifyUser();
    } else {
      setLoading(false);
    }
  }, [user, dispatch, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-voxy-muted">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
