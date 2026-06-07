import { Suspense } from "react";
import VerifyPaymentContent from "./VerifyPaymentContent";
import CheckoutLoading from "@/components/verifyPaymentPage/VerifyLoading";

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <VerifyPaymentContent />
    </Suspense>
  );
}
