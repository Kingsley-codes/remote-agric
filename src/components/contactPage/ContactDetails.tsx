import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function ContactDetails() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Details</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <FiMapPin size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Head Office</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Level 4, Heritage Place, 21 Lugard Ave, Ikoyi, Lagos, Nigeria
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <FiPhone size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Phone Number</p>
              <p className="text-sm text-slate-600">+234 (0) 800 AGRO FUND</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <FiMail size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Email Address</p>
              <p className="text-sm text-slate-600">hello@agrofundhub.ng</p>
            </div>
          </div>
        </div>
      </div>
      {/* Map placeholder */}
      <div className="bg-slate-200 rounded-md h-[250px] overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <img
          className="w-full h-full object-cover grayscale opacity-80"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1Bqn7BWUsZ-yI7XNJ-pKGMNwxZ6231uszVuHNaCqiOcGqYmDuLjj_HjJQcRl6qby3b6jDQBtENxvTikzczXQBRoyTx-Sv90QVnQRDdwxZD9by74rOe-yV-liAqF-wOCU4vU-sI5DEZ59v_V-deZAgGQkeK7R679nTv3sLLOVWLy7O3o5TiK4x7ePqg2i4G7oPoPFPcELzBBuJ_LF5CluTSU542va3TQlZAXcJDguedZ31GEx0LHrNIujzkNxShbXFHt5ze2xLYr2k"
          alt="Map of Lagos Ikoyi district"
        />
      </div>
    </div>
  );
}