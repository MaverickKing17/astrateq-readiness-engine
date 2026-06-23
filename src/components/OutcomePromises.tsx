import { Gauge, Flame, Award } from "lucide-react";

export default function OutcomePromises() {
  const outcomes = [
    {
      icon: <Gauge className="w-8 h-8 text-red-500" />,
      metric: "85",
      label: "Vehicle Readiness Score",
      range: "0-100 Gauge",
      desc: "A real-time structural score based on your vehicle model's electronic signal compatibility with edge intelligence."
    },
    {
      icon: <Flame className="w-8 h-8 text-rose-500 animate-pulse" />,
      metric: "GTA Profile",
      label: "Summer Driving Risk Profile",
      range: "Thermal & Congestion",
      desc: "Understand how Southern Ontario heatwaves and Highway 401 bumper-to-bumper delays strain your vehicle core."
    },
    {
      icon: <Award className="w-8 h-8 text-red-500" />,
      metric: "Cohort Eligibility",
      label: "Founding Cohort Classification",
      range: "Instant Tiering",
      desc: "Receive instant verification for Founding Member access, securing priority diagnostic hardware allocations."
    }
  ];

  return (
    <div id="outcome-promises" className="w-full mt-10">
      <div className="text-center mb-6">
        <h4 className="text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase">
          Pre-Launch Verification Metrics
        </h4>
        <h3 className="text-xl font-display font-black text-white mt-1 uppercase tracking-tight">
          What you will receive in 60 seconds
        </h3>
        <p className="text-xs text-slate-400 mt-1">This initial pre-launch assessment maps your hardware footprint and safety index.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {outcomes.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#111218] rounded-2xl p-6 border border-white/10 shadow-2xl hover:border-red-500/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top row with icon & metric badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/20">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full font-bold border border-red-500/20">
                {item.range}
              </span>
            </div>

            {/* Middle body */}
            <div>
              <h4 className="text-lg font-display font-bold text-white leading-snug">
                {item.label}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            {/* Subtle bottom detail */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider">Instant Delivery</span>
              <span className="text-[10px] text-slate-500">Zero Obligation</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
