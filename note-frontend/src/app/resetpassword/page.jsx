"use client"
import ResetPasswordPage from "@/components/authentication/resetPasswordPage";
import Spinner from "@/components/common/spinner";
import { Suspense } from "react";
export default function page() {
  return (
    <>
     <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
          <ResetPasswordPage/>
        </Suspense>
    </>
  );
}
