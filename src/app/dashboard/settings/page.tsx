"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type Profile = { firstName: string; lastName: string; email: string; phone?: string; address?: string; gender?: "male" | "female"; farmerID?: string };
const base = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SettingsPage() {
  const { loading: authLoading } = useAuth({ allowedRoles: ["user"] });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", address: "", gender: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    fetch(`${base}/api/user/profile`, { credentials: "include" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message ?? "Unable to load your profile.");
        const user = payload.data.user as Profile;
        setProfile(user);
        setForm({ firstName: user.firstName ?? "", lastName: user.lastName ?? "", phone: user.phone ?? "", address: user.address ?? "", gender: user.gender ?? "" });
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [authLoading]);

  const save = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(`${base}/api/user/profile`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, gender: form.gender || undefined }) });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message ?? "Unable to update your profile.");
      const user = payload.data.user as Profile;
      setProfile(user);
      localStorage.setItem("user", JSON.stringify(user));
      setMessage("Your details have been updated.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update your profile."); }
    finally { setSaving(false); }
  };

  if (authLoading || loading) return <div className="flex h-full items-center justify-center"><div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;
  if (!profile) return <div className="p-8 text-center text-red-600">{error || "Unable to load your profile."}</div>;

  return <div className="mx-auto w-full max-w-3xl p-4 md:p-8 lg:px-12"><header className="mb-8"><h1 className="text-3xl font-semibold text-gray-800">Settings</h1><p className="mt-2 text-gray-500">Manage the personal details associated with your remote-farmer account.</p></header><form onSubmit={save} className="rounded-2xl border border-[#dce8d7] bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 rounded-xl bg-[#f4f8f1] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Account details</p><p className="mt-1 text-sm text-gray-600">{profile.email}</p>{profile.farmerID && <p className="mt-1 text-xs text-gray-500">Farmer ID: {profile.farmerID}</p>}</div><div className="grid gap-5 sm:grid-cols-2"><Field label="First name" value={form.firstName} onChange={(value) => setForm({ ...form, firstName: value })} required /><Field label="Last name" value={form.lastName} onChange={(value) => setForm({ ...form, lastName: value })} required /><Field label="Phone number" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} type="tel" /><label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">Gender<select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="rounded-xl border border-[#dce8d7] px-3 py-3 font-normal outline-none focus:border-primary"><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option></select></label></div><Field label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} /><div className="mt-6 flex items-center gap-4"><button disabled={saving} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>{message && <p className="text-sm text-primary">{message}</p>}{error && <p className="text-sm text-red-600">{error}</p>}</div></form></div>;
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-[#dce8d7] px-3 py-3 font-normal outline-none focus:border-primary" /></label>;
}
