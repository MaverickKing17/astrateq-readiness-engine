import { Mail, Calendar, Eye, Inbox, User, ShieldAlert, Sparkles, Send, CircleCheck as CheckCircle } from "lucide-react";
import { EmailCampaignItem } from "../types";
import { BRAND } from "../config/brand";

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

export default function PersonalInbox({ name, email, vehicleMake, vehicleModel, vehicleYear, score, cohortName, campaign, onTriggerEmail }: PersonalInboxProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md">
        <div className="border-b border-slate-200 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-500">
              <div>
                <span className="text-slate-400 font-mono">From:</span> <span className="font-semibold text-slate-800">{BRAND.name} &lt;no-reply@astrateq.ca&gt;</span>
              </div>
              <div className="mt-1">
                <span className="text-slate-400 font-mono">To:</span> <span className="font-mono font-bold text-[#0062ff]">{email}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><Inbox className="w-3.5 h-3.5" /> {campaign.length} campaign sequence</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center text-blue-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-slate-900">Your Personal {BRAND.name} Driver Portal</h4>
            <p className="text-xs text-slate-500 font-mono">{vehicleYear} {vehicleMake} {vehicleModel} · Score: {score}/100</p>
          </div>
        </div>

        <div className="space-y-3">
          {campaign.map((email, index) => {
            const isScheduled = email.status === "Scheduled";
            return (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${isScheduled ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
                      {email.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Day {email.delayDays}</span>
                  </div>
                  {isScheduled && (
                    <button
                      onClick={() => onTriggerEmail(index)}
                      className="text-xs text-[#0062ff] font-mono font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Simulate send
                    </button>
                  )}
                  {email.status === "Sent" && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Delivered
                    </span>
                  )}
                </div>
                <h5 className="text-sm font-semibold text-slate-800 mt-2">{email.subject}</h5>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: email.body }} />
                <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {email.status === "Sent" ? "Sent" : "Scheduled"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
