import { Shield, Database, Lock, EyeOff, CircleCheck as CheckCircle } from "lucide-react";

export default function TrustModule() {
  const trustItems = [
    {
      icon: <Shield className="w-5 h-5 text-[#0062ff]" />,
      title: "Local-First Intelligence",
      description: "Designed to reduce unnecessary cloud dependency."
    },
    {
      icon: <EyeOff className="w-5 h-5 text-[#0062ff]" />,
      title: "No Data Resale Model",
      description: "Your driving profile is not being built for advertising resale."
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-[#0062ff]" />,
      title: "Canadian Validation",
      description: "Built around Canadian roads, weather, and driver expectations."
    },
    {
      icon: <Database className="w-5 h-5 text-[#0062ff]" />,
      title: "User-Controlled Data",
      description: "You choose what information you share during validation."
    },
    {
      icon: <Lock className="w-5 h-5 text-[#0062ff]" />,
      title: "Privacy by Design",
      description: "Privacy expectations are considered from the beginning, not added later."
    }
  ];

  return (
    <div id="trust-privacy-module" className="py-12 bg-white text-slate-800 rounded-2xl overflow-hidden mt-12 border border-slate-200/80 shadow-md">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-[#0062ff] uppercase font-bold">Privacy Foundation</span>
          <h3 className="text-2xl font-display font-black uppercase tracking-tight mt-2 text-slate-900">Privacy-First Foundation</h3>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-2">
            Astrateq is designed to keep your vehicle's readiness data local — away from commercial data networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50/50 border border-slate-200/60 hover:border-[#0062ff]/30 transition-all shadow-xs hover:shadow-md">
              <div className="mb-3 p-3 bg-blue-50 rounded-full border border-blue-100">
                {item.icon}
              </div>
              <h4 className="text-xs font-display font-bold tracking-wide text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
