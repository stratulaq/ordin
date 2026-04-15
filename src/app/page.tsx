"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function OTPPage() {
  const [value, setValue] = useState("")
  const router = useRouter()

  const handleComplete = (val: string) => {
    if (val === "123456") {
      toast.success("Access Granted")
      router.push("/form")
    } else {
      toast.error("Invalid Code")
      setValue("")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Subtle organic background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[30%] h-[30%] rounded-full bg-blue-100/50 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[30%] h-[30%] rounded-full bg-zinc-200/50 blur-[100px]" />
      </div>
      
      <Card className="w-full max-w-md border-zinc-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 transition-all duration-500">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-zinc-200">
            <span className="text-2xl font-bold text-white">O</span>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-zinc-900 uppercase italic">Ordin</CardTitle>
          <CardDescription className="text-zinc-500 text-base font-medium">
            Enter secure access code
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-12 pt-4">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(v) => setValue(v)}
            onComplete={handleComplete}
            autoFocus
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot 
                  key={i} 
                  index={i} 
                  className="w-10 h-14 sm:w-12 sm:h-16 text-2xl font-bold border-zinc-200 text-zinc-900 bg-zinc-50 rounded-lg focus-within:ring-2 focus-within:ring-zinc-950 transition-all" 
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <p className="mt-8 text-zinc-300 text-xs uppercase tracking-widest font-bold">
            Authorized Personnel Only
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
