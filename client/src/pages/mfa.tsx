import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function MfaPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsLoading(false);
      // Here you would redirect to the dashboard
      alert("Verification successful!"); 
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-[440px] shadow-xl border-border/50 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pt-10 pb-2">
          {/* Icon Placeholder */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300 delay-150">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Two-Step Verification
            </CardTitle>
            <CardDescription className="text-slate-500 text-base max-w-[300px] mx-auto">
              Enter the 6-digit code sent to your device ending in <span className="font-semibold text-slate-700">**88</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleVerify} className="space-y-8 flex flex-col items-center">
            
            <div className="flex justify-center w-full">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={(value) => setOtp(value)}
                data-testid="input-otp"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="h-12 w-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md" />
                  <InputOTPSlot index={1} className="h-12 w-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md" />
                  <InputOTPSlot index={2} className="h-12 w-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md" />
                </InputOTPGroup>
                <div className="w-4" /> {/* Spacer */}
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} className="h-12 w-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md" />
                  <InputOTPSlot index={4} className="h-12 w-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md" />
                  <InputOTPSlot index={5} className="h-12 w-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
              disabled={isLoading || otp.length !== 6}
              data-testid="button-verify"
            >
              {isLoading ? "Verifying..." : "Verify Identity"}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8 bg-slate-50/50 rounded-b-xl border-t border-slate-100">
          <div className="text-center text-sm text-slate-500">
            Didn't receive the code?{" "}
            <button 
              className="font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors ml-1 inline-flex items-center"
              onClick={() => alert("Code resent!")}
            >
              Resend code <RefreshCw className="ml-1 w-3 h-3" />
            </button>
          </div>
          
          <div className="text-center">
            <Link href="/login">
              <span className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                ← Back to sign in
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
      </div>
    </div>
  );
}
