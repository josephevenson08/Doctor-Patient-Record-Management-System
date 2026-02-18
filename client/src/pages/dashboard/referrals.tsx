import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, ArrowRightLeft, Clock, CheckCircle2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Referral, Patient, Doctor } from "@shared/schema";

export default function ReferralsPage() {
  const searchString = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    patientId: "",
    referringDoctorId: "",
    referredDoctorId: "",
    dateTime: "",
    notes: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const patientId = params.get("patientId");
    const notes = params.get("notes");
    if (patientId) {
      const now = new Date().toISOString().slice(0, 16);
      setForm({
        patientId,
        referringDoctorId: "",
        referredDoctorId: "",
        dateTime: now,
        notes: notes || "",
      });
      setDialogOpen(true);
      window.history.replaceState({}, "", "/dashboard/referrals");
    }
  }, [searchString]);

  const { data: referrals = [], isLoading: loadingReferrals } = useQuery<Referral[]>({
    queryKey: ["/api/referrals"],
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const combinedDoctors = useMemo(() => {
    const result: Array<{ id: number; firstName: string; lastName: string; specialty?: string | null }> = [...doctors];
    try {
      const stored = localStorage.getItem("mediportal_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.id && !result.some((d) => d.id === user.id)) {
          result.push({
            id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            specialty: user.specialty || null,
          });
        }
      }
    } catch {}
    return result;
  }, [doctors]);

  const createReferral = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/referrals", {
      ...data,
      patientId: parseInt(data.patientId),
      referringDoctorId: parseInt(data.referringDoctorId),
      referredDoctorId: parseInt(data.referredDoctorId),
      dateTime: new Date(data.dateTime).toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      setDialogOpen(false);
      setForm({ patientId: "", referringDoctorId: "", referredDoctorId: "", dateTime: "", notes: "" });
    },
  });

  const processReferral = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/referrals/${id}`, { status: "completed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
    },
  });

  const getPatientName = (patientId: number) => {
    const p = patients.find((pat) => pat.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : `Patient #${patientId}`;
  };

  const getDoctorLabel = (doctorId: number) => {
    const d = combinedDoctors.find((doc) => doc.id === doctorId);
    return d ? `Dr. ${d.firstName} ${d.lastName}${d.specialty ? ` (${d.specialty})` : ""}` : `Doctor #${doctorId}`;
  };

  const filteredReferrals = referrals.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const patientName = getPatientName(r.patientId).toLowerCase();
    const fromDoc = getDoctorLabel(r.referringDoctorId).toLowerCase();
    const toDoc = getDoctorLabel(r.referredDoctorId).toLowerCase();
    return patientName.includes(q) || fromDoc.includes(q) || toDoc.includes(q) || (r.notes?.toLowerCase().includes(q));
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Referrals</h1>
            <p className="text-slate-500 mt-2">Manage patient referrals to other specialists.</p>
          </div>
          <Button
            data-testid="button-create-referral"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              const now = new Date();
              const localDatetime = now.toISOString().slice(0, 16);
              setForm({ patientId: "", referringDoctorId: "", referredDoctorId: "", dateTime: localDatetime, notes: "" });
              setDialogOpen(true);
            }}
          >
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
                  <Input
                    data-testid="input-search-referrals"
                    placeholder="Search referrals..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {loadingReferrals ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="flex gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredReferrals.length === 0 ? (
                <p className="text-center py-8 text-slate-500" data-testid="text-no-referrals">No referrals found.</p>
              ) : (
                filteredReferrals.map((referral) => (
                  <div key={referral.id} data-testid={`card-referral-${referral.id}`} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      referral.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">{getPatientName(referral.patientId)}</h3>
                        <Badge variant={referral.status === 'pending' ? 'outline' : 'default'} className={
                          referral.status === 'pending' ? 'text-amber-600 border-amber-200 bg-amber-50' : 'bg-green-600 hover:bg-green-700'
                        }>
                          {referral.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {(referral.status || "pending").charAt(0).toUpperCase() + (referral.status || "pending").slice(1)}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-500 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">From</span>
                          <span className="text-slate-700">{getDoctorLabel(referral.referringDoctorId)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">To</span>
                          <span className="text-slate-700">{getDoctorLabel(referral.referredDoctorId)}</span>
                        </div>
                      </div>

                      {referral.notes && (
                        <div className="pt-3 mt-3 border-t border-slate-50">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium text-slate-900">Note:</span> {referral.notes}
                          </p>
                        </div>
                      )}

                      {referral.dateTime && (
                        <p className="text-xs text-slate-400 mt-1">
                          Date: {new Date(referral.dateTime).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                      <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-referral-${referral.id}`}>View</Button>
                      {referral.status === 'pending' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          data-testid={`button-process-referral-${referral.id}`}
                          onClick={() => processReferral.mutate(referral.id)}
                          disabled={processReferral.isPending}
                        >
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Referral</DialogTitle>
            <DialogDescription>Create a new patient referral to a specialist.</DialogDescription>
          </DialogHeader>
          <form
            data-testid="form-create-referral"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.patientId || !form.referringDoctorId || !form.referredDoctorId || !form.dateTime) return;
              createReferral.mutate(form);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="ref-patient">Patient <span className="text-red-500">*</span></Label>
              <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v })} required>
                <SelectTrigger data-testid="select-referral-patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()} data-testid={`select-patient-option-${p.id}`}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ref-from">Referring Doctor <span className="text-red-500">*</span></Label>
                <Select value={form.referringDoctorId} onValueChange={(v) => setForm({ ...form, referringDoctorId: v })} required>
                  <SelectTrigger data-testid="select-referring-doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {combinedDoctors.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()} data-testid={`select-referring-doctor-option-${d.id}`}>
                        Dr. {d.firstName} {d.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref-to">Referred To <span className="text-red-500">*</span></Label>
                <Select value={form.referredDoctorId} onValueChange={(v) => setForm({ ...form, referredDoctorId: v })} required>
                  <SelectTrigger data-testid="select-referred-doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {combinedDoctors.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()} data-testid={`select-referred-doctor-option-${d.id}`}>
                        Dr. {d.firstName} {d.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref-dateTime">Date & Time <span className="text-red-500">*</span></Label>
              <Input data-testid="input-referral-datetime" id="ref-dateTime" type="datetime-local" required value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref-notes">Notes</Label>
              <Textarea data-testid="input-referral-notes" id="ref-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reason for referral..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" data-testid="button-submit-referral" className="bg-blue-600 hover:bg-blue-700" disabled={createReferral.isPending || !form.patientId || !form.referringDoctorId || !form.referredDoctorId || !form.dateTime}>
                {createReferral.isPending ? "Creating..." : "Create Referral"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
