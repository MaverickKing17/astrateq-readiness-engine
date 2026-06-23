import { Gauge, Flame, Award } from "lucide-react";

export default function OutcomePromises() {
  const outcomes = [
    {
      icon: <Gauge className="w-8 h-8 text-[#0062ff]" />,
      label: "Vehicle Readiness Score",
      range: "Instant preview",
      desc: "A quick score based on your vehicle profile and driving conditions."
    },
    {
      icon: <Flame className="w-8 h-8 text-[#0062ff]" />,
      label: "Summer Driving Risk Profile",
      range: "Shown after completion",
      desc: "Understand how heat, traffic, and highway usage may affect your driving context."
    },
    {
      icon: <Award className="w-8 h-8 text-[#0062ff]" />,
      label: "Founding Cohort Classification",
      range: "Instant preview",
      desc: "See whether your profile may qualify for early access consideration."
    }
  ];

  return (
    <div id="outcome-promises" className="w-full mt-10">
      <div className="text-center mb-6">
        <h4 className="text-xs font-mono font-semibold tracking-widest text-slate-500 uppercase">
          Pre-Launch Verification
        </h4>
        <h3 className="text-xl font-display font-black text-slate-900 mt-1 uppercase tracking-tight">
          What you will receive in 60 seconds
        </h3>
        <p className="text-xs text-slate-500 mt-1">Complete the readiness check and get your results right away.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {outcomes.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-[#0062ff]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-100">
                {item.range}
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

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#0062ff] font-bold uppercase tracking-wider">No obligation</span>
              <span className="text-[10px] text-slate-500">Zero payment required</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
