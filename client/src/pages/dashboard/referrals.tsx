import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ArrowRightLeft, Clock, CheckCircle2 } from "lucide-react";

// Mock Referrals based on schema
const referrals = [
  {
    id: 1,
    patient: "Michael Chen",
    from: "Dr. Smith (Cardiology)",
    to: "Dr. Jones (Neurology)",
    date: "2024-02-18",
    status: "pending",
    notes: "Patient reporting persistent migraines with visual aura. Please evaluate."
  },
  {
    id: 2,
    patient: "Emily Davis",
    from: "Dr. Smith (Cardiology)",
    to: "Dr. Williams (Dermatology)",
    date: "2024-02-14",
    status: "completed",
    notes: "Suspicious mole on left shoulder."
  },
];

export default function ReferralsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Referrals</h1>
            <p className="text-slate-500 mt-2">Manage patient referrals to other specialists.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Create Referral
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search referrals..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    referral.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">{referral.patient}</h3>
                      <Badge variant={referral.status === 'pending' ? 'outline' : 'default'} className={
                        referral.status === 'pending' ? 'text-amber-600 border-amber-200 bg-amber-50' : 'bg-green-600 hover:bg-green-700'
                      }>
                        {referral.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-500 mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">From</span>
                        <span className="text-slate-700">{referral.from}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">To</span>
                        <span className="text-slate-700">{referral.to}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-slate-50">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-900">Note:</span> {referral.notes}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                    <Button variant="outline" size="sm" className="flex-1">View</Button>
                    {referral.status === 'pending' && (
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">Process</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
