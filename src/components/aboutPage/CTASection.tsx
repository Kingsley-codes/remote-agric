"use client";

export default function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-20 bg-white text-gray-800 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-semibold text-primary mb-6 leading-tight">Ready to become a Remote Farmer?</h2>
          <p className="text-xl opacity-90 mb-8">Join thousands of Nigerians growing wealth while securing our nation&apos;s food future.</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-md">
              Browse Available Farms
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            <img className="w-32 h-32 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE_0KxngGKPrjnAOLl5AikIRPw8IWvfHCKRjLkhtjfKiPXlOilrOW7C-kZBFZ-RlZfKs8hezpw-9px1o8KqD0Fk5Cf8qYqNswWeSjzhIdFz-DXhyrT7YgvsLpodgg7cnaBlMN0iWF-iZUC4OyBaO0lU9XTXJHIf3RUp_34cIgQlHYLPSq2Im2MD0PZ_wyLGLqXDX_NAQ860Hqoy0tCWw_iLNuohDlkZ-G2lABcoAqg5vnLsLMMhgfjLR6tkXh-wrHKVXiCFMiyJK2l"/>
            <img className="w-32 h-48 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWnWrFAr2bu3T9uHp34sHfu3m0NLRrwTGAjpXIUu6uMgqOH66ZASCC3_0kVXLaN-8MnO986FFou1OuLCvFZEzYnZUA1gtXVlUHKgX1GBDiG-sdVlZAykrCJ6OvkfOWV2uthpm8vmhfZGw5FEi4CP7dMotUk7wzGKj-Lk9l1e6cktnBsvq2_k41_qBVZxSiRc8WYfCiln8JYTbhI0SAU9Xe8V4kux2UlYk8Wl0-2kAZLfp1fVKvH-srI1uF_RVOju45_Nf_EGjSIQnk"/>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <img className="w-32 h-48 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3uW4OLPDvbeXXp6gaN8H5EaqFOjwuGnQIJFlCKQplb8ZQkE0504foDQSabRVfZfG-1-lJVfACfYCWZlEzmFBQpwrLoBQfUQfZhvJHE58S8xIHKuFPdzLfDARDGpfKfnnJ-vlqEDhup9aFDmxetSdqpsmtc9rn-1SsTJIfV8T_1s-kRRSK6CzceKSjPl4grSf8bhbDNmomFdmno7FAkTi-nbGwXAXm-tnLuyM_hdCHqPZOtHme1OZJ4sgr5X8m43hcbdKChA46Aovv"/>
            <img className="w-32 h-32 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7mqTCPo7suKTSNBNsWvSjGcjK3kPNV0X-exF8TJQoQXtaqlY7MpRJjeRxuSaO1tBUMEYM8U-i5TjrZXuACKKac-TqAeUDRV8SZOgkO0TOjvFHD_iinwgYUC_S2oekx8i90uMcP005l9sC2DjvCA_ji8hhbiPVAdOfZ7evy8tjntW6e4f6j5_G7P4PYLK-tk3mgiNsGWEyLVvK7vIUZVGUXw04irHsqdJfZ7nBTfPF4LGvSJCE_2hOnkt7Z5NpXfBEjv9jOgWSq1JG"/>
          </div>
        </div>
      </div>
    </section>
  );
}