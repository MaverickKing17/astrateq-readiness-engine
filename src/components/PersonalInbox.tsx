import { useState } from "react";
import { Mail, Calendar, Eye, Inbox, User, ShieldAlert, Sparkles, Send, CheckCircle } from "lucide-react";
import { EmailCampaignItem } from "../types";

interface PersonalInboxProps {
  name: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  score: number;
  cohortName: string;
  campaign: EmailCampaignItem[];
  onTriggerEmail: (emailIndex: number) => void;
}

export default function PersonalInbox({
  name,
  email,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  score,
  cohortName,
  campaign,
  onTriggerEmail
}: PersonalInboxProps) {
  const [selectedEmailIdx, setSelectedEmailIdx] = useState<number>(0);

  const selectedEmail = campaign[selectedEmailIdx];

  return (
    <div id="personalized-inbox-simulator" className="w-full bg-[#111218] border border-white/10 rounded-2xl text-white p-6 md:p-8 mt-12 relative overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5 w-max">
            <Sparkles className="w-3.5 h-3.5" /> Portal Activated
          </span>
          <h3 className="text-2xl font-display font-black uppercase tracking-tight mt-2 text-white">
            Your Personal Astrateq Driver Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Securely connected to <span className="text-red-400 font-mono font-bold">{email}</span>. View your tailored campaign.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-red-950/40 rounded-lg border border-red-500/20">
            <User className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Candidate Allocation</div>
            <div className="text-xs font-bold text-slate-200">{name} ({vehicleYear} {vehicleMake})</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: Email list in campaign */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Inbox className="w-4 h-4 text-red-500" /> Follow-Up Sequence Funnel
          </h4>

          <div className="space-y-2">
            {campaign.map((item, idx) => {
              const isSelected = selectedEmailIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedEmailIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-black border-red-500/50 text-white shadow-lg shadow-red-500/10"
                      : "bg-black/20 border-white/10 hover:bg-black/40 hover:border-white/20 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      idx === 0 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/10 text-slate-300 border border-white/10"
                    }`}>
                      Stage {idx + 1} (Day {item.delayDays})
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      item.status === "Sent" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400 animate-pulse"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h5 className={`text-xs font-semibold truncate ${isSelected ? "text-white font-bold" : "text-slate-300"}`}>
                    {item.subject}
                  </h5>

                  <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {idx === 0 ? "Dispatched Instantly" : `Scheduled Day +${item.delayDays}`}
                    </span>
                    {item.status === "Scheduled" && (
                      <span className="text-red-400 hover:underline font-bold flex items-center gap-1 z-10">
                        Trigger Send <Send className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right pane: Reading email details */}
        <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col h-[400px]">
          {selectedEmail ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500 font-mono">From:</span> <span className="font-semibold text-slate-200">Astrateq Canada &lt;no-reply@astrateq.ca&gt;</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-slate-500 font-mono">To:</span> <span className="font-mono font-bold text-red-400">{email}</span>
                    </div>
                  </div>
                  {selectedEmail.status === "Scheduled" && (
                    <button
                      onClick={() => onTriggerEmail(selectedEmailIdx)}
                      className="bg-red-600 hover:bg-red-500 text-white font-mono uppercase tracking-wider text-[10px] px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 self-start sm:self-center active:scale-95 shadow-lg shadow-red-600/20 cursor-pointer"
                    >
                      <Send className="w-3 h-3" /> Simulate Trigger (Fast-Forward)
                    </button>
                  )}
                </div>
                
                <h4 className="text-sm font-display font-bold text-slate-100 mt-3 border-t border-white/5 pt-3">
                  Subject: {selectedEmail.subject}
                </h4>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto text-xs text-slate-300 font-mono space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed max-h-[220px]">
                <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
              </div>

              {/* Bottom footer note */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Secure Canadian Server Sandbox
                </span>
                <span>Pre-Launch Validation Model 1.0</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
              <Mail className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs">Select an email from your campaign sequence to inspect contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
