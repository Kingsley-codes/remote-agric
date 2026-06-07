// app/complete-registration/page.tsx
import { Suspense } from "react";
import CompleteRegistrationContent from "./CompleteRegistrationContent";

export default function CompleteRegistrationPage() {
  return (
    <Suspense>
      <CompleteRegistrationContent />
    </Suspense>
  );
}
