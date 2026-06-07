export default function FAQSection() {
  return (
    <section className="mt-20 max-w-7xl mx-auto px-6 lg:px-20">
      <div className="text-center mb-12">
        <span className="text-secondary font-bold text-sm tracking-widest uppercase">Common Questions</span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Frequently Asked Questions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-primary bg-primary/10 p-2 rounded-md">👨‍🌾</span>
            <h3 className="text-xl font-bold text-primary">For Remote Farmers</h3>
          </div>
          <details className="group bg-white rounded-md shadow-sm border border-slate-100">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-semibold text-slate-800">
              How do I track my farm's progress?
            </summary>
            <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
              You can monitor your farm's growth in real-time via your personalized dashboard, including drone imagery, weather reports, and weekly updates.
            </div>
          </details>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-secondary bg-secondary/10 p-2 rounded-md">🌱</span>
            <h3 className="text-xl font-bold text-secondary">For Producers</h3>
          </div>
          <details className="group bg-white rounded-md shadow-sm border border-slate-100">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-semibold text-slate-800">
              What are the requirements for farm listing?
            </summary>
            <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
              Producers must provide valid land titles, soil fertility assessment, and demonstrate at least 3 years of successful farming operations.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}