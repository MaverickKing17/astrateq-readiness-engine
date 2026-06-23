import { useState } from "react";
import { Users, Mail, BarChart3, Database, Trash2, Send, ExternalLink, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Lead, EmailCampaignItem } from "../types";

interface AdminPanelProps {
  leads: Lead[];
  onRefresh: () => void;
  onClearLeads: () => void;
  onTriggerEmail: (leadEmail: string, emailIndex: number) => void;
}

export default function AdminPanel({ leads, onRefresh, onClearLeads, onTriggerEmail }: AdminPanelProps) {
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "campaigns">("leads");

  // Metrics
  const totalLeads = leads.length;
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((sum, l) => sum + l.readinessScore, 0) / totalLeads) : 0;
  
  const highCohort = leads.filter((l) => l.cohortTier === "High Readiness").length;
  const moderateCohort = leads.filter((l) => l.cohortTier === "Moderate Readiness").length;
  const lowCohort = leads.filter((l) => l.cohortTier === "Low Readiness").length;

  // Calculate simulated open/click rates
  const totalEmailsSent = leads.reduce((sum, l) => {
    return sum + (l.followUpCampaign?.filter(e => e.status === "Sent").length || 0);
  }, 0);

  const toggleLead = (email: string) => {
    setExpandedLead(expandedLead === email ? null : email);
  };

  return (
    <div id="admin-lead-campaign-panel" className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs mt-12 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-semibold uppercase">
            Validation Dashboard
          </span>
          <h3 className="text-xl font-display font-bold text-slate-800 mt-2 flex items-center gap-2">
            Astrateq Campaign Operations Desk <ShieldCheck className="w-5 h-5 text-brand-cyan" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Analyze pre-launch validation cohorts and verify automated follow-up sequences.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={onRefresh}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition"
          >
            Refresh Database
          </button>
          <button
            onClick={onClearLeads}
            className="text-xs bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-1.5 rounded-lg hover:bg-rose-100 font-medium transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Database
          </button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="p-3 bg-brand-navy rounded-lg text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Subscribers</div>
            <div className="text-2xl font-display font-bold text-slate-800">{totalLeads}</div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="p-3 bg-brand-cyan rounded-lg text-slate-950">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Avg Readiness</div>
            <div className="text-2xl font-display font-bold text-slate-800">{avgScore}/100</div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-lg text-white">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Simulated Dispatches</div>
            <div className="text-2xl font-display font-bold text-slate-800">{totalEmailsSent} <span className="text-[11px] text-slate-400 font-normal">sent</span></div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 text-center">Cohort Segmentation</div>
          <div className="flex items-center justify-around text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> High: {highCohort}
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Mod: {moderateCohort}
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Low: {lowCohort}
            </span>
          </div>
        </div>
      </div>

      {totalLeads === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-600">No Pre-Launch Subscribers Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Complete the vehicle configurator and secure a founding driver allocation to populate this subscriber database.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200/60 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-2.5 text-xs font-semibold transition ${
                activeTab === "leads" ? "bg-white border-r border-slate-200 text-brand-navy" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Captured Lead Database ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-4 py-2.5 text-xs font-semibold transition ${
                activeTab === "campaigns" ? "bg-white border-r border-slate-200 text-brand-navy" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Automated Follow-Up Campaign Monitoring
            </button>
          </div>

          {activeTab === "leads" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <th className="p-3 pl-4">Subscriber Info</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3">Assigned Cohort</th>
                    <th className="p-3">Follow-Ups</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const isExpanded = expandedLead === lead.email;
                    const sentCount = lead.followUpCampaign?.filter(e => e.status === "Sent").length || 0;
                    const totalCount = lead.followUpCampaign?.length || 0;

                    return (
                      <>
                        <tr
                          key={lead.email}
                          className="hover:bg-slate-50/40 text-xs text-slate-700 transition-colors"
                        >
                          <td className="p-3 pl-4">
                            <div className="font-semibold text-slate-800">{lead.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{lead.email}</div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-slate-800">{lead.vehicleYear} {lead.vehicleMake}</span>
                            <span className="text-slate-400 font-mono block text-[10px]">{lead.vehicleModel}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-block w-8 py-0.5 text-center font-mono font-bold rounded-md ${
                              lead.readinessScore >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              lead.readinessScore >= 60 ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {lead.readinessScore}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 font-semibold ${
                              lead.cohortTier === "High Readiness" ? "text-emerald-600" :
                              lead.cohortTier === "Moderate Readiness" ? "text-amber-600" :
                              "text-blue-600"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                lead.cohortTier === "High Readiness" ? "bg-emerald-500" :
                                lead.cohortTier === "Moderate Readiness" ? "bg-amber-500" :
                                "bg-blue-500"
                              }`} />
                              {lead.cohortName}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px]">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <span className="font-semibold text-slate-800">{sentCount}/{totalCount}</span>
                              <span>Dispatched</span>
                            </div>
                            <div className="w-16 bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
                              <div
                                className="bg-brand-cyan h-full"
                                style={{ width: `${(sentCount / totalCount) * 100}%` }}
                              />
                            </div>
                          </td>
                          <td className="p-3 text-right pr-4">
                            <button
                              onClick={() => toggleLead(lead.email)}
                              className="text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-semibold transition inline-flex items-center gap-1"
                            >
                              {isExpanded ? "Close Detail" : "Inspect Emails"}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded details row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/50">
                            <td colSpan={6} className="p-4 pl-6 pr-6">
                              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                                <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                                  Generated follow-up email funnel (Personalized via Gemini)
                                </h5>
                                
                                <div className="space-y-4">
                                  {lead.followUpCampaign?.map((emailItem, index) => (
                                    <div
                                      key={index}
                                      className="border border-slate-100 rounded-lg p-3 hover:border-slate-200 transition-colors bg-slate-50/30"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                            Stage {index + 1} (Day {emailItem.delayDays})
                                          </span>
                                          <span className="text-xs font-semibold text-slate-700">
                                            {emailItem.subject}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                                            emailItem.status === "Sent"
                                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                              : "bg-amber-50 text-amber-600 border-amber-200 animate-pulse"
                                          }`}>
                                            {emailItem.status}
                                          </span>
                                          {emailItem.status === "Scheduled" && (
                                            <button
                                              onClick={() => onTriggerEmail(lead.email, index)}
                                              className="bg-brand-navy hover:bg-slate-800 text-white font-semibold text-[10px] px-2 py-1 rounded-md transition flex items-center gap-1"
                                            >
                                              <Send className="w-3 h-3" /> Send Mock Email
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div
                                        className="text-[11px] text-slate-600 font-mono overflow-y-auto max-h-36 bg-slate-950 text-slate-300 p-2.5 rounded-md"
                                        dangerouslySetInnerHTML={{ __html: emailItem.body }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800">Pre-Launch Progression Psychology and Conversion Funnel</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Our system operates on structured psychological escalation, taking the user on a continuous momentum path:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block">1. Anonymous Visitor</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-1">
                      Attracted by premium Apple-level UI and the instant promise of three core outputs.
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block">2. Classified Participant</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-1">
                      Engages in assessment. Receives exact scores and regional summer risk profiles.
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block">3. Cohort Candidate</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-1">
                      Converts by securing zero-payment reservations. Enters the automated campaign funnel.
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-brand-cyan" />
                  <h4 className="text-sm font-semibold text-slate-800">Automated Follow-Up Sequences Info</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  When a driver completes their founding cohort application, our Express backend generates three highly tailored follow-up campaigns. The first email, a **Welcome and vehicle-specific risk report**, is dispatched instantly. The subsequent emails are scheduled for **Day 2 (Telemetry and privacy deep dive)** and **Day 5 (Priority launch activation)**. 
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  *Tip: Use the "Inspect Emails" button on the database tab to view the custom emails generated by the Gemini model for each driver, and click "Send Mock Email" to simulate instant trigger delivery.*
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
