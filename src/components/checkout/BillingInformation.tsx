type BillingData = {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
};

type Props = {
  billingData: BillingData;
  onChange: (data: BillingData) => void;
};

export default function BillingInformation({ billingData, onChange }: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...billingData, [name]: value });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          1
        </div>
        <h3 className="text-xl font-semibold">Billing Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="text-sm pl-2 font-semibold text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            value={billingData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            className="w-full rounded-lg py-2 pl-5 border border-gray-200 focus:border-gray-400 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="lastName"
            className="text-sm pl-2 font-semibold text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            value={billingData.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            className="w-full rounded-lg py-2 pl-5 border border-gray-200 focus:border-gray-400 focus:ring-primary"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label htmlFor="phone" className="text-sm pl-1 font-semibold text-gray-700">Phone number</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30}
            value={billingData.phone} onChange={handleInputChange} placeholder="+234 801 234 5678"
            className="w-full rounded-lg py-2 pl-5 border border-gray-200 focus:border-gray-400 focus:ring-primary" />
          <p className="text-xs text-gray-500">Required for guest checkout. Include your country code.</p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label
            htmlFor="email"
            className="text-sm pl-1 font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={billingData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className="w-full rounded-lg py-1 pl-5 border border-gray-200 focus:border-gray-400 focus:ring-primary"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label
            htmlFor="address"
            className="text-sm pl-1 font-semibold text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            value={billingData.address}
            onChange={handleInputChange}
            placeholder="Street address, city, state"
            className="w-full rounded-lg py-1 pl-5 border border-gray-200 focus:border-gray-400 focus:ring-primary"
          />
        </div>
      </div>
    </section>
  );
}
