import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Plus, 
  Clock, 
  User, 
  Stethoscope, 
  Calendar as CalendarIcon 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock Records based on schema
const records = [
  {
    id: 1,
    patient: "Sarah Johnson",
    doctor: "Dr. Smith",
    date: "2024-02-15",
    type: "Check-up",
    diagnosis: "Hypertension (Stage 1)",
    treatment: "Prescribed Lisinopril 10mg daily. Advised lifestyle changes including low-sodium diet and regular exercise.",
    vitals: "BP: 140/90 | HR: 78 | Temp: 98.6°F",
    notes: "Patient complains of occasional headaches."
  },
  {
    id: 2,
    patient: "Michael Chen",
    doctor: "Dr. Smith",
    date: "2024-02-10",
    type: "Follow-up",
    diagnosis: "Acute Bronchitis",
    treatment: "Completed course of antibiotics. Symptoms improved significantly.",
    vitals: "BP: 120/80 | HR: 72 | Temp: 98.4°F",
    notes: "Lungs clear on auscultation."
  },
];

export default function RecordsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Medical Records</h1>
            <p className="text-slate-500 mt-2">View and manage patient clinical documentation.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            New Record
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filter - simulating patient selection */}
          <Card className="w-full md:w-80 h-fit border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase text-slate-500 tracking-wider">Patient Select</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Find patient..." className="pl-10" />
              </div>
              <div className="space-y-1">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium cursor-pointer border border-blue-100 flex items-center justify-between">
                  Sarah Johnson
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800 hover:bg-blue-200">Selected</Badge>
                </div>
                <div className="p-3 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-600 cursor-pointer transition-colors">
                  Michael Chen
                </div>
                <div className="p-3 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-600 cursor-pointer transition-colors">
                  Emily Davis
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <div className="flex-1 space-y-6">
            {records.map((record) => (
              <Card key={record.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 hover:bg-blue-700">{record.type}</Badge>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" /> {record.date}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {record.diagnosis}
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" /> Treatment Plan
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {record.treatment}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Vitals
                      </h4>
                      <p className="text-sm font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                        {record.vitals}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                      <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Notes</h4>
                      <p className="text-sm text-slate-600 italic">
                        "{record.notes}"
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 mt-4">
                      <User className="w-3 h-3" />
                      Recorded by <span className="font-medium text-slate-600">{record.doctor}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Activity } from "lucide-react"; // Import missing icon
