import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Patient } from "@shared/schema";

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const formatName = (value: string) => {
  return value.replace(/[^a-zA-Z\s\-']/g, "");
};

const formatEmail = (value: string) => {
  return value.replace(/[^a-zA-Z0-9@._\-+]/g, "");
};

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const createPatient = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", "/api/patients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      setDialogOpen(false);
      setForm({ firstName: "", lastName: "", dob: "", gender: "", email: "", phone: "", address: "", emergencyName: "", emergencyPhone: "" });
    },
  });

  const deletePatient = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/patients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
    },
  });

  const filteredPatients = patients.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    return name.includes(q) || (p.email?.toLowerCase().includes(q)) || (p.phone?.includes(q));
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patients</h1>
            <p className="text-slate-500 mt-2">Manage patient records and information.</p>
          </div>
          <Button
            data-testid="button-add-patient"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  data-testid="input-search-patients"
                  placeholder="Search by name, email, or phone..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="text-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">DOB</TableHead>
                    <TableHead className="font-semibold text-slate-600">Gender</TableHead>
                    <TableHead className="font-semibold text-slate-600">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-600">Email</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500" data-testid="text-no-patients">
                        No patients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-slate-50/50 transition-colors" data-testid={`row-patient-${patient.id}`}>
                        <TableCell className="font-medium text-slate-900">
                          <div>
                            {patient.firstName} {patient.lastName}
                            <div className="text-xs text-slate-400 font-normal md:hidden">{patient.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.dob}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.gender === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {patient.gender || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{patient.phone || "—"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{patient.email || "—"}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" data-testid={`button-actions-${patient.id}`}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem data-testid={`button-view-${patient.id}`}>
                                <Eye className="w-4 h-4 mr-2 text-slate-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem data-testid={`button-edit-${patient.id}`}>
                                <Edit className="w-4 h-4 mr-2 text-slate-500" /> Edit Record
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                data-testid={`button-delete-${patient.id}`}
                                onClick={() => deletePatient.mutate(patient.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Fill in patient details below.</DialogDescription>
          </DialogHeader>
          <form
            data-testid="form-add-patient"
            onSubmit={(e) => {
              e.preventDefault();
              createPatient.mutate(form);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input data-testid="input-firstName" id="firstName" required maxLength={50} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: formatName(e.target.value) })} placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input data-testid="input-lastName" id="lastName" required maxLength={50} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: formatName(e.target.value) })} placeholder="Doe" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input data-testid="input-dob" id="dob" type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger data-testid="select-gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input data-testid="input-email" id="email" type="email" maxLength={100} value={form.email} onChange={(e) => setForm({ ...form, email: formatEmail(e.target.value) })} placeholder="patient@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input data-testid="input-phone" id="phone" type="tel" maxLength={14} value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })} placeholder="(555) 555-5555" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input data-testid="input-address" id="address" maxLength={200} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City, State ZIP" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                <Input data-testid="input-emergencyName" id="emergencyName" maxLength={100} value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: formatName(e.target.value) })} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input data-testid="input-emergencyPhone" id="emergencyPhone" type="tel" maxLength={14} value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: formatPhoneNumber(e.target.value) })} placeholder="(555) 555-5555" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" data-testid="button-submit-patient" className="bg-blue-600 hover:bg-blue-700" disabled={createPatient.isPending}>
                {createPatient.isPending ? "Adding..." : "Add Patient"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
