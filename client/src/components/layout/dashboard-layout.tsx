import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Stethoscope, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  X,
  CheckCircle2,
  Clock,
  UserPlus,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("mediportal_user");
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch {}
    }
  }, []);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Patients", icon: Users, href: "/dashboard/patients" },
    { label: "Medical Records", icon: FileText, href: "/dashboard/records" },
    { label: "Referrals", icon: Stethoscope, href: "/dashboard/referrals" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">MediPortal</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 border border-slate-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "DR"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user ? `Dr. ${user.lastName}` : "Doctor"}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{user?.specialty?.replace("-", " ") || "General"}</p>
          </div>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-950/30 gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r-slate-800 bg-slate-900">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-slate-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            
            <div className="relative hidden sm:block w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search patients, records, or doctors..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50" data-testid="button-notifications">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0" data-testid="dropdown-notifications">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 border-b border-slate-50 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">Welcome to <span className="font-medium">MediPortal</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">Just now</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 border-b border-slate-50 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">System is <span className="font-medium">fully operational</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">2 min ago</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 border-b border-slate-50 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">Remember to review <span className="font-medium">pending referrals</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">15 min ago</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">No critical alerts at this time</p>
                      <p className="text-xs text-slate-400 mt-0.5">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all notifications</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
