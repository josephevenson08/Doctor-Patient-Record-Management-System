import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, RefreshCw, Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function MfaPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    
    setIsLoading(true);
    // Simulate API call to send code
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1000);
  };

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
      <Card className="w-full max-w-[440px] shadow-xl border-border/50 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500 transition-all">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pt-10 pb-2">
          {/* Icon Placeholder */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300 delay-150">
            {step === "phone" ? (
              <Smartphone className="w-8 h-8 text-primary" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {step === "phone" ? "Two-Step Verification" : "Verify It's You"}
            </CardTitle>
            <CardDescription className="text-slate-500 text-base max-w-[300px] mx-auto">
              {step === "phone" 
                ? "Enter your mobile number to receive a verification code."
                : (
                  <span>
                    Enter the 6-digit code sent to <br/>
                    <span className="font-semibold text-slate-700">{phoneNumber}</span>
                  </span>
                )
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {step === "phone" ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-600 font-medium">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 555-5555"
                  className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  data-testid="input-phone"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
                disabled={isLoading || phoneNumber.length < 10}
                data-testid="button-send-code"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-8 flex flex-col items-center animate-in slide-in-from-right-8 fade-in duration-300">
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
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8 bg-slate-50/50 rounded-b-xl border-t border-slate-100">
          {step === "otp" && (
            <div className="text-center text-sm text-slate-500 animate-in fade-in slide-in-from-bottom-2">
              Didn't receive the code?{" "}
              <button 
                className="font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors ml-1 inline-flex items-center"
                onClick={() => alert("Code resent!")}
              >
                Resend code <RefreshCw className="ml-1 w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="text-center">
            {step === "otp" ? (
              <button 
                onClick={() => setStep("phone")}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition-colors inline-flex items-center"
              >
                <ArrowLeft className="mr-1 w-3 h-3" /> Change phone number
              </button>
            ) : (
              <Link href="/login">
                <span className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                  ← Back to sign in
                </span>
              </Link>
            )}
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
