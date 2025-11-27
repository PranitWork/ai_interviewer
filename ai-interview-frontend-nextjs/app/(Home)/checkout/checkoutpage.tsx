"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { asyncApplyCoupon, asynccheckout } from "@/app/Store/actions/checkoutActions";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { openRazorpayCheckout } from "@/app/lib/razorpayClient";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppDispatch } from "@/app/Store/hook";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const selectedPlanName = searchParams.get("plan");

  const { register, handleSubmit } = useForm();
  const { plans } = useSelector((state: any) => state.planReducer);

  const plan = useMemo(() => {
    return plans?.find(
      (p: any) => p.name.toLowerCase() === selectedPlanName?.toLowerCase()
    );
  }, [plans, selectedPlanName]);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyLoading, setApplyLoading] = useState(false);
  const [couponStatus, setCouponStatus] = useState("");
  const [isPayLoading, setIsPayLoading] = useState(false);

  const finalAmount = plan ? plan.price - discount : 0;

  if (!plan) {
    return <p className="text-center text-voxy-muted mt-20">Loading plan...</p>;
  }

  const submitHandler = async (formData: any) => {
    setIsPayLoading(true);

    const payload = {
      plan: plan.name,
      coupon: coupon || null,
      name: formData.billingName,
      email: formData.billingEmail,
    };

    const res: any = await dispatch(asynccheckout(payload));
    setIsPayLoading(false);

    if (res.success) {
      toast.success("Opening Razorpay...");
      openRazorpayCheckout(res.data);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-voxy-surface border border-voxy-border rounded-2xl shadow-lg p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-voxy-text mb-6">
            Checkout
          </h1>

          {/* PLAN SUMMARY */}
          <div className="border border-voxy-border rounded-xl p-4 sm:p-6 mb-6 bg-voxy-surface">
            <h2 className="text-lg sm:text-xl font-semibold text-voxy-text mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2 text-voxy-text text-sm sm:text-base">
              <p className="capitalize">{plan.name} Plan</p>
              <p>₹{plan.price}</p>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-500">
                <p>Discount Applied</p>
                <p>-₹{discount}</p>
              </div>
            )}

            <hr className="my-3 border-voxy-border" />

            <div className="flex justify-between text-lg sm:text-xl font-bold text-voxy-text">
              <p>Total</p>
              <p>₹{finalAmount}</p>
            </div>
          </div>

          {/* APPLY COUPON */}
          <div className="border border-voxy-border rounded-xl p-4 sm:p-6 mb-6 bg-voxy-surface">
            <h2 className="text-lg sm:text-xl font-semibold text-voxy-text mb-3">
              Apply Coupon
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="ENTER COUPON"
                className="flex-1 p-3 border border-voxy-border rounded-lg bg-transparent text-voxy-text w-full"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponStatus("");
                }}
              />

              <button
                disabled={applyLoading}
                className="w-full sm:w-auto px-4 py-2 bg-voxy-primary text-white rounded-lg disabled:opacity-50"
                onClick={async () => {
                  if (!coupon) return setCouponStatus("Enter a coupon code");

                  setApplyLoading(true);
                  const res: any = await dispatch(asyncApplyCoupon(coupon, plan.price));
                  setApplyLoading(false);

                  if (res.success) {
                    setDiscount(res.data.discount);
                    setCouponStatus("Coupon applied successfully 🎉");
                  } else {
                    setCouponStatus(res.message);
                    setDiscount(0);
                  }
                }}
              >
                {applyLoading ? "Applying..." : "Apply"}
              </button>
            </div>

            {couponStatus && (
              <p
                className={`mt-2 text-sm ${
                  couponStatus.includes("success") ? "text-green-500" : "text-red-500"
                }`}
              >
                {couponStatus}
              </p>
            )}
          </div>

          {/* BILLING FORM */}
          <form method="POST" onSubmit={handleSubmit(submitHandler)}>
            <div className="border border-voxy-border rounded-xl p-4 sm:p-6 mb-6 bg-voxy-surface">
              <h2 className="text-lg sm:text-xl font-semibold text-voxy-text mb-4">
                Billing Details
              </h2>

              <input
                type="text"
                placeholder="Full Name"
                {...register("billingName", { required: true })}
                className="w-full p-3 mb-4 border border-voxy-border rounded-lg bg-transparent text-voxy-text"
              />

              <input
                type="email"
                placeholder="Email Address"
                {...register("billingEmail", { required: true })}
                className="w-full p-3 border border-voxy-border rounded-lg bg-transparent text-voxy-text"
              />
            </div>

            {/* PAYMENT BUTTON WITH LOADER */}
            <button
              type="submit"
              disabled={isPayLoading}
              className="w-full py-4 bg-voxy-primary text-white rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPayLoading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
