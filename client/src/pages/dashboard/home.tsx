import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const stats = [
  { 
    title: "Total Patients", 
    value: "1,284", 
    change: "+12%", 
    trend: "up",
    icon: Users,
    color: "bg-blue-500"
  },
  { 
    title: "Appointments Today", 
    value: "42", 
    change: "+4", 
    trend: "up",
    icon: Calendar,
    color: "bg-indigo-500"
  },
  { 
    title: "Pending Referrals", 
    value: "7", 
    change: "-2", 
    trend: "down",
    icon: Activity,
    color: "bg-amber-500"
  },
  { 
    title: "Critical Alerts", 
    value: "3", 
    change: "+1", 
    trend: "up",
    icon: AlertCircle,
    color: "bg-red-500"
  },
];

const upcomingAppointments = [
  { id: 1, patient: "Sarah Johnson", time: "09:00 AM", type: "Check-up", status: "Confirmed" },
  { id: 2, patient: "Michael Chen", time: "10:30 AM", type: "Follow-up", status: "In Progress" },
  { id: 3, patient: "Emily Davis", time: "11:45 AM", type: "Consultation", status: "Confirmed" },
  { id: 4, patient: "Robert Wilson", time: "02:15 PM", type: "Lab Results", status: "Pending" },
];

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-2">Overview of your practice performance and daily activities.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    <span className={`text-xs font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Upcoming Appointments */}
          <Card className="border-slate-200 shadow-sm col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Upcoming Appointments</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                      <div>
                        <p className="font-medium text-slate-900">{apt.patient}</p>
                        <p className="text-sm text-slate-500">{apt.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{apt.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Recent Activity */}
          <Card className="border-slate-200 shadow-sm col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 pb-6 border-l-2 border-slate-100 pl-4 last:pb-0 relative">
                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">2 hours ago</p>
                      <p className="font-medium text-slate-900">Dr. Smith updated medical records for <span className="text-blue-600">Sarah Johnson</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
