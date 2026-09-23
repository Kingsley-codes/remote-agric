"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

type Profile = { firstName: string; lastName: string; email: string; farmerID: string; phone?: string; address?: string; gender?: string; profilePhoto?: { url?: string } };
const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`;
const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-primary disabled:bg-slate-50 disabled:text-slate-500";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    axios.get(endpoint, { withCredentials: true }).then(r => setProfile(r.data.data.user))
      .catch(() => setError("Unable to load your profile. Please reload to try again."));
  }, []);
  const choosePhoto = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("Choose a JPEG, PNG or WebP image smaller than 5MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile || saving) return;
    setSaving(true); setError("");
    const body = new FormData();
    for (const field of ["firstName", "lastName", "phone", "address", "gender"] as const) body.append(field, profile[field] ?? "");
    if (photo) body.append("profilePhoto", photo);
    try {
      const response = await axios.patch(endpoint, body, { withCredentials: true });
      setProfile(response.data.data.user); setPhoto(null); setPreview("");
      if (fileRef.current) fileRef.current.value = "";
      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Profile updated");
    } catch (failure) {
      setError(axios.isAxiosError(failure) ? failure.response?.data?.message ?? failure.response?.data?.error ?? "Unable to save your profile." : "Unable to save your profile.");
    } finally { setSaving(false); }
  };
  return <section className="mx-auto max-w-3xl p-6 lg:p-10">
    <h1 className="text-3xl font-semibold">Profile settings</h1>
    <p className="mt-2 text-sm text-slate-500">Keep your personal and contact details up to date.</p>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {!profile ? !error && <p className="mt-8 text-slate-500">Loading profile…</p> : <form onSubmit={save} className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <fieldset disabled={saving} className="space-y-6">
        <div className="flex flex-wrap items-center gap-5">
          {preview || profile.profilePhoto?.url ? <Image unoptimized width={96} height={96} src={preview || profile.profilePhoto!.url!} alt="Profile photo" className="size-24 rounded-full object-cover" /> : <div className="grid size-24 place-items-center rounded-full bg-green-50 text-2xl font-bold text-primary">{profile.firstName[0]}{profile.lastName[0]}</div>}
          <label className="text-sm font-medium">Profile photo<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block max-w-full text-xs" onChange={e => { const file = e.target.files?.[0]; if (file) choosePhoto(file); }} /><span className="mt-2 block text-xs text-slate-500">JPEG, PNG or WebP, up to 5MB.</span></label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {(["firstName", "lastName"] as const).map(field => <label key={field} className="text-sm font-medium">{field === "firstName" ? "First name" : "Last name"}<input required maxLength={80} autoComplete={field === "firstName" ? "given-name" : "family-name"} className={inputClass} value={profile[field]} onChange={e => setProfile({ ...profile, [field]: e.target.value })} /></label>)}
          <label className="text-sm font-medium">Email<input disabled className={inputClass} value={profile.email} /></label>
          <label className="text-sm font-medium">Farmer ID<input disabled className={inputClass} value={profile.farmerID} /></label>
          <label className="text-sm font-medium">Phone number<input type="tel" autoComplete="tel" maxLength={30} placeholder="+234…" className={inputClass} value={profile.phone ?? ""} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></label>
          <label className="text-sm font-medium">Gender<select className={inputClass} value={profile.gender ?? ""} onChange={e => setProfile({ ...profile, gender: e.target.value })}><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option></select></label>
        </div>
        <label className="block text-sm font-medium">Address<textarea rows={3} maxLength={500} autoComplete="street-address" className={inputClass} value={profile.address ?? ""} onChange={e => setProfile({ ...profile, address: e.target.value })} /></label>
        <div className="flex justify-end"><button disabled={saving} className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button></div>
      </fieldset>
    </form>}
  </section>;
}
