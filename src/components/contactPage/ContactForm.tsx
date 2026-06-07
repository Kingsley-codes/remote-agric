"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setSuccess(data.error || "Failed to send message.");
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-md shadow p-8 md:p-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h3>
      <p className="text-slate-600 mb-8">
        Have questions about our agricultural projects? Fill out the form below.
      </p>
      {success && <p className="mb-4 text-green-600">{success}</p>}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-slate-200 rounded-md focus:ring-primary focus:border-primary px-4 py-3"
              placeholder="John Doe"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-slate-200 rounded-md focus:ring-primary focus:border-primary px-4 py-3"
              placeholder="john@example.com"
              type="email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Subject</label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border-slate-200 rounded-md focus:ring-primary focus:border-primary px-4 py-3"
          >
            <option>General Inquiry</option>
            <option>Farmer Relations (Investors)</option>
            <option>Producer Support (Farm Owners)</option>
            <option>Technical Assistance</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full border-slate-200 rounded-md focus:ring-primary focus:border-primary px-4 py-3"
            placeholder="Tell us how we can help..."
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-md font-bold hover:bg-primary/90 transition-all shadow-md"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}