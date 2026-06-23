import { Gauge, Sun, Award } from "lucide-react";

export default function OutcomePromises() {
  const outcomes = [
    {
      icon: <Gauge className="w-7 h-7 text-[#0062ff]" />,
      label: "Vehicle Readiness Score",
      badge: "0–100 Score",
      desc: "A quick score based on your vehicle profile and driving conditions.",
      accent: "blue",
      gradient: "from-blue-50/80 to-white",
      bar: "bg-[#0062ff]",
      iconBg: "bg-blue-50 border-blue-100",
      badgeBg: "bg-blue-100/70 text-blue-700 border-blue-200",
    },
    {
      icon: <Sun className="w-7 h-7 text-amber-600" />,
      label: "Summer Driving Risk Profile",
      badge: "Ontario Summer Context",
      desc: "Understand how heat, traffic, and highway usage may affect your driving context.",
      accent: "amber",
      gradient: "from-amber-50/60 to-white",
      bar: "bg-amber-400",
      iconBg: "bg-amber-50 border-amber-100",
      badgeBg: "bg-amber-100/70 text-amber-700 border-amber-200",
    },
    {
      icon: <Award className="w-7 h-7 text-[#4f46e5]" />,
      label: "Founding Cohort Classification",
      badge: "Eligibility Signal",
      desc: "See whether your profile may qualify for early access consideration.",
      accent: "indigo",
      gradient: "from-indigo-50/60 to-white",
      bar: "bg-[#6366f1]",
      iconBg: "bg-indigo-50 border-indigo-100",
      badgeBg: "bg-indigo-100/70 text-indigo-700 border-indigo-200",
    },
  ];

  return (
    <div id="outcome-promises" className="w-full mt-16 md:mt-20">
      <div className="text-center mb-8">
        <h4 className="text-xs font-mono font-semibold tracking-widest text-slate-500 uppercase">
          Pre-Launch Verification
        </h4>
        <h3 className="text-xl font-display font-black text-slate-900 mt-1 uppercase tracking-tight">
          What you will receive in 60 seconds
        </h3>
        <p className="text-xs text-slate-500 mt-1">Complete the readiness check and get your results right away.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {outcomes.map((item, idx) => (
          <div
            key={idx}
            className={`relative bg-gradient-to-br ${item.gradient} rounded-2xl p-6 border border-blue-100/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between group`}
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${item.bar} opacity-70`} />

            <div className="flex items-start justify-between mb-5">
              <div className={`p-3.5 rounded-2xl border ${item.iconBg} transition-transform group-hover:scale-105`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>
                {item.badge}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-display font-bold text-slate-900 leading-snug">
                {item.label}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#0062ff] font-bold uppercase tracking-wider">No obligation</span>
              <span className="text-[10px] text-slate-500">Zero payment required</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
