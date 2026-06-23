import { Shield, Database, Lock, EyeOff, CheckCircle } from "lucide-react";

export default function TrustModule() {
  const trustItems = [
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      title: "Local-First Intelligence",
      description: "Diagnostics and analytics execute locally on-device. Minimizes cloud dependency."
    },
    {
      icon: <EyeOff className="w-5 h-5 text-red-500" />,
      title: "No Data Resale Model",
      description: "We will never sell or monetize your vehicle telematics or personal data. Period."
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-red-500" />,
      title: "Canadian Validation",
      description: "Optimized specifically for Canadian driving conditions, thermal profiles, and regional roads."
    },
    {
      icon: <Database className="w-5 h-5 text-red-500" />,
      title: "User-Controlled Data",
      description: "You decide what diagnostic datasets are captured, shared, or completely wiped."
    },
    {
      icon: <Lock className="w-5 h-5 text-red-500" />,
      title: "Privacy by Design",
      description: "Built from the ground up with secure hardware handshakes and localized firmware encryption."
    }
  ];

  return (
    <div id="trust-privacy-module" className="py-12 bg-gradient-to-b from-[#111218] to-black text-white rounded-2xl overflow-hidden mt-12 border border-white/10 shadow-2xl">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-red-500 uppercase">Core Architecture</span>
          <h3 className="text-2xl font-display font-black uppercase tracking-tight mt-2 text-white">Privacy-First Foundation</h3>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            Astrateq operates as a secure edge layer, safeguarding your vehicle's physical diagnostics from cloud-based tracking.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/30 transition-all">
              <div className="mb-3 p-3 bg-red-950/40 rounded-full border border-red-500/20">
                {item.icon}
              </div>
              <h4 className="text-xs font-display font-semibold tracking-wide text-slate-200">{item.title}</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
