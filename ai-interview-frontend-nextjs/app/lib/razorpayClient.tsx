// app/lib/razorpayClient.ts

export const openRazorpayCheckout = (order: any) => {
  const options = {
    key: order.key,
    amount: order.amount,
    currency: order.currency,
    name: "SwarAi",
    description: "Subscription Payment",
    order_id: order.id,

    handler: function (response: any) {
      console.log("Payment Success:", response);
      window.location.href = "/checkout/processing";
    },

    modal: {
      ondismiss: function () {
        console.log("Checkout Cancelled");
        window.location.href = "/checkout/failed";
      },
    },

    prefill: {
      name: "",
      email: "",
    },

    theme: {
      color: "#6A5ACD",
    },
  };

  // Load script if not present
  if (typeof window !== "undefined") {
    if (!(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } else {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  }
};
