import OTPPage from '@/components/otpPage/otpPage'
import { Suspense } from 'react'
import Spinner from "@/components/common/spinner"

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
      <OTPPage/>
    </Suspense>
  )
}