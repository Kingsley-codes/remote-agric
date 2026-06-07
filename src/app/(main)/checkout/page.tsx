import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";
import CheckoutLoading from "@/components/checkout/CheckoutLoading";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
