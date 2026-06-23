import { Shield, Database, Lock, EyeOff, CircleCheck as CheckCircle } from "lucide-react";

export default function TrustModule() {
  const trustItems = [
    {
      icon: <Shield className="w-6 h-6 text-[#0062ff]" />,
      title: "Local-First Intelligence",
      description: "Designed to reduce unnecessary cloud dependency.",
      accentBar: "bg-[#0062ff]",
      iconBg: "bg-blue-50 border-blue-100",
    },
    {
      icon: <EyeOff className="w-6 h-6 text-[#06b6d4]" />,
      title: "No Data Resale Model",
      description: "Your driving profile is not being built for advertising resale.",
      accentBar: "bg-[#06b6d4]",
      iconBg: "bg-cyan-50 border-cyan-100",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-[#0062ff]" />,
      title: "Canadian Validation",
      description: "Built around Canadian roads, weather, and driver expectations.",
      accentBar: "bg-[#1e3a5f]",
      iconBg: "bg-blue-50/80 border-blue-100",
    },
    {
      icon: <Database className="w-6 h-6 text-[#0d9488]" />,
      title: "User-Controlled Data",
      description: "You choose what information you share during validation.",
      accentBar: "bg-[#0d9488]",
      iconBg: "bg-teal-50 border-teal-100",
    },
    {
      icon: <Lock className="w-6 h-6 text-[#6366f1]" />,
      title: "Privacy by Design",
      description: "Privacy expectations are considered from the beginning, not added later.",
      accentBar: "bg-[#6366f1]",
      iconBg: "bg-indigo-50 border-indigo-100",
    }
  ];

  return (
    <div id="trust-privacy-module" className="py-16 md:py-20 bg-white text-slate-800 rounded-2xl overflow-hidden mt-16 md:mt-20 border border-slate-200/80 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-[#0062ff] uppercase font-bold">Privacy by Design</span>
          <h3 className="text-2xl font-display font-black uppercase tracking-tight mt-2 text-slate-900">Privacy-First Foundation</h3>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-2">
            Built around local-first, driver-controlled principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
          {trustItems.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center p-5 rounded-xl bg-slate-50/50 border border-slate-200/60 hover:border-[#0062ff]/25 transition-all duration-300 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]">
              {/* Left accent line */}
              <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${item.accentBar} opacity-60`} />
              <div className={`mb-4 p-3.5 rounded-full border ${item.iconBg} transition-transform hover:scale-105`}>
                {item.icon}
              </div>
              <h4 className="text-xs font-display font-black tracking-wide text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
