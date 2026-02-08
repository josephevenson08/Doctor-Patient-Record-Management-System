import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("patient");
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    specialty: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to login or dashboard after successful signup
      alert("Account created successfully!");
      setLocation("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-[500px] shadow-xl border-border/50 bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pt-8 pb-2">
          {/* Icon Placeholder */}
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-500 text-base">
              Join the patient management portal today
            </CardDescription>
          </div>

          <Tabs defaultValue="patient" className="w-full max-w-[300px]" onValueChange={setRole}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={handleSignup} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-600 font-medium">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John"
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-600 font-medium">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe"
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 font-medium">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com"
                className="bg-slate-50 border-slate-200 focus:bg-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-600 font-medium">Mobile Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(555) 555-5555"
                className="bg-slate-50 border-slate-200 focus:bg-white"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {role === "doctor" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="specialty" className="text-slate-600 font-medium">Medical Specialty</Label>
                <Select 
                  value={formData.specialty} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white w-full">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="family-medicine">Family Medicine</SelectItem>
                    <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="radiology">Radiology</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-600 font-medium">Username</Label>
              <Input 
                id="username" 
                placeholder="johndoe123"
                className="bg-slate-50 border-slate-200 focus:bg-white"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-600 font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    className="bg-slate-50 border-slate-200 focus:bg-white pr-8"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-600 font-medium">Confirm</Label>
                <Input 
                  id="confirmPassword" 
                  type={showPassword ? "text" : "password"}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 mt-2" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8 bg-slate-50/50 rounded-b-xl border-t border-slate-100">
          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login">
              <span className="font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors ml-1">
                Sign in here
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
