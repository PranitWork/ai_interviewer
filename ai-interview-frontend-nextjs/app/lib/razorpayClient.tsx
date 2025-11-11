import axios from "@/app/api/config";

export const openRazorpayCheckout = async (plan: string) => {
  try {
    const { data } = await axios.post(
      "/subscription/create",
      { plan },
      { withCredentials: true }
    );

    if (!data?.id) {
      alert("Failed to start payment session");
      return;
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Voxy AI",
      description: `Upgrade to ${plan} Plan`,
      order_id: data.id,
      handler: function (response: any) {
        alert("✅ Payment successful!");
        // Optionally call /subscription/status
      },
      theme: { color: "#2563EB" },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  } catch (err) {
    alert("Payment initiation failed");
    console.error(err);
  }
};
