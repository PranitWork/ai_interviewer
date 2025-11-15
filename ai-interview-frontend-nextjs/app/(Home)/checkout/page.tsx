import { Suspense } from "react";
import CheckoutPage from "./checkoutpage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-voxy-muted">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
