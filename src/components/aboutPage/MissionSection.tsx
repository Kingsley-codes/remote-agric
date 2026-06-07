"use client";

import { FaUsers, FaChartLine } from "react-icons/fa";
import { GiHighGrass } from "react-icons/gi";
import { BsBank } from "react-icons/bs";


export default function MissionSection() {
  return (
    <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-primary text-3xl font-semibold mb-6">Our Mission</h3>
          <p className="md:text-lg text-base leading-relaxed mb-6 opacity-90">
            At Agrofund Hub, we empower remote farmers and local producers by providing capital and resources to scale.
          </p>
          <p className="text-lg leading-relaxed opacity-90">
            Our mission is to create a sustainable ecosystem where urban investors and rural farmers thrive together.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-8 rounded-lg shadow text-center border-t-6 border-primary">
            <div className="text-3xl font-black text-primary mb-2"><FaUsers className="inline mr-2" /></div>
            <div className="text-3xl font-black text-primary mb-2">5k+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farmers Empowered</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow text-center border-t-6 border-[#D96C3A]">
            <div className="text-3xl font-black text-[#D96C3A] mb-2"><GiHighGrass className="inline mr-2" /></div>
            <div className="text-3xl font-black text-[#D96C3A] mb-2">12k+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hectares Cultivated</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow text-center border-t-6 border-[#F7B74A]">
            <div className="text-3xl font-black text-[#F7B74A] mb-2"><FaChartLine className="inline mr-2" /></div>
            <div className="text-3xl font-black text-[#F7B74A] mb-2">24%</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Annual Yield</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow text-center border-t-6 border-primary">
            <div className="text-3xl font-black text-primary mb-2"><BsBank className="inline mr-2" /></div>
            <div className="text-3xl font-black text-primary mb-2">₦2B+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capital Deployed</p>
          </div>
        </div>
      </div>
    </section>
  );
}