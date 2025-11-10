"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./SwarAiPreloader";

export default function PageLoader({ children }: any) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) return <Preloader />;

  return <>{children}</>;
}
