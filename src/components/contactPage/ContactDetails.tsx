import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function ContactDetails() {
  const address = "Level 4, Heritage Place, 21 Lugard Ave, Ikoyi, Lagos, Nigeria";
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Contact Details
        </h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <FiMapPin size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Head Office</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {address}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <FiPhone size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Phone Number</p>
              <a
                href="tel:+2348060779290"
                className="text-sm text-slate-600 hover:text-slate-500"
              >
                +234 (0) 806 077 9290
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <FiMail size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Email Address</p>
              <a
                href="mailto:remoteagric2024@gmail.com"
                className="text-slate-600 text-sm hover:text-slate-500"
              >
                remoteagric2024@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-200 rounded-md h-62.5 overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <iframe
          className="w-full h-full border-0"
          src={mapUrl}
          title={`Map showing ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
