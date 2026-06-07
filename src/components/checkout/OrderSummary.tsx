"use client";

import { useState } from "react";
import { FiArrowRight, FiLock } from "react-icons/fi";

type ProduceType = {
  _id: string;
  name: string;
  title: string;
  price: number;
  image1: { url: string; publicId: string };
  farm?: string;
  description?: string;
};

type BillingData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
};

type Props = {
  produce: ProduceType | null;
  units: number;
  billingData: BillingData;
  paymentMethod: "card" | "bank" | "wallet";
  userId?: string;
};

export default function OrderSummary({
  produce,
  units,
  billingData,
  paymentMethod,
  userId,
}: Props) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!produce) {
    return (
      <div className="bg-white p-6 rounded-xl border">
        Loading order summary...
      </div>
    );
  }

  const unitPrice = produce.price;
  const total = unitPrice * units;

  const handlePayment = async () => {
    if (!agreed) {
      setError("Please agree to the Terms of Investment to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        userId,
        produceId: produce._id,
        units,
        unitPrice,
        amount: total,
        paymentMethod,
        firstName: billingData.firstName,
        lastName: billingData.lastName,
        email: billingData.email,
        address: billingData.address,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/paystack/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Payment failed");
      }

      const data = await res.json();

      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err: unknown) {
      setError(
        (err as Error).message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6 bg-linear-to-br from-white to-background-light border-b border-gray-100">
        <h3 className="text-lg font-bold mb-4">Investment Summary</h3>

        <div className="flex gap-4 mb-4">
          <div
            className="w-20 h-20 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${produce.image1.url})` }}
          />
          <div>
            <p className="text-sm font-bold text-primary">{produce.title}</p>
            <p className="font-bold">Cassava Plantation - Zone B</p>
            <p className="text-xs text-gray-500">Projected ROI: 18%</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 text-sm">
        <Row label="Unit Price" value={`₦${unitPrice.toLocaleString()}`} />
        <Divider />
        <Row label="Quantity" value={`${units} Units`} />
        <Divider />

        <div className="flex justify-between items-end pb-2">
          <span className="text-base font-bold text-gray-800">
            Total to Pay
          </span>
          <span className="text-2xl font-bold">₦{total.toLocaleString()}</span>
        </div>

        <div className="flex items-start gap-3 py-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (error) setError(null);
            }}
          />
          <div className="text-xs text-gray-500">
            <label className="font-medium text-gray-700">
              I agree to the Terms of Investment
            </label>
            <p>
              By continuing, you agree to Agrofund&apos;s{" "}
              <a className="text-primary hover:underline" href="#">
                Conditions of Use
              </a>{" "}
              and{" "}
              <a className="text-primary hover:underline" href="#">
                Privacy Notice
              </a>
              .
            </p>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-gray-100 font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/20 transition flex items-center justify-center gap-2"
        >
          {loading
            ? "Processing..."
            : `Confirm & Pay ₦${total.toLocaleString()}`}
          {!loading && <FiArrowRight />}
        </button>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <FiLock size={14} /> Payments are secure and encrypted
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: React.ReactNode;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center ${highlight ? "text-primary text-xs font-semibold" : "text-gray-600"}`}
    >
      <span>{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 my-2" />;
}
