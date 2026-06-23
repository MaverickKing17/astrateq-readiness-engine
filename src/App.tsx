import { useState, useEffect, useRef } from "react";
import { Sparkles, Car, ShieldAlert, Gauge, ChevronRight, Layers, Users, CircleCheck as CheckCircle, RefreshCw, Mail, Compass, Lock, Settings, Info, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import TrustModule from "./components/TrustModule";
import OutcomePromises from "./components/OutcomePromises";
import AdminPanel from "./components/AdminPanel";
import PersonalInbox from "./components/PersonalInbox";
import { AssessmentResult, Lead, EmailCampaignItem } from "./types";

// Simple local score simulator (no backend required for result reveal)
function simulateScore(
  privacySensitivity: number,
  highwayUsage: string,
  summerHeatExposure: string
): number {
  let score = 68;
  if (privacySensitivity >= 4) score += 6;
  if (highwayUsage === "Heavy") score += 5;
  if (summerHeatExposure === "High") score += 4;
  if (summerHeatExposure === "Low") score -= 4;
  return Math.min(Math.max(score, 48), 92);
}

function getCohortFromScore(score: number) {
  if (score >= 80) return { tier: "High Readiness", name: "Founding Early Allocation" };
  if (score >= 60) return { tier: "Moderate Readiness", name: "Priority Evaluation Cohort" };
  return { tier: "Low Readiness", name: "Standard Validation Queue" };
}

// --- 3-Stage Post-Submit Result Reveal ---
type RevealStage = "idle" | "analyzing" | "result";

interface RevealProps {
  score: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  cohortTier: string;
  cohortName: string;
  onContinue: () => void;
}

function ResultReveal({ score, vehicleMake, vehicleModel, vehicleYear, cohortTier, cohortName, onContinue }: RevealProps) {
  const [stage, setStage] = useState<RevealStage>("analyzing");
  const [progress, setProgress] = useState(0);
  const [rowsVisible, setRowsVisible] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const rows = [
    { label: "Summer Heat Exposure", status: "Evaluating" },
    { label: "Highway Usage Pattern", status: "Evaluating" },
    { label: "Privacy Sensitivity", status: "Calibrating" },
    { label: "Compatibility Confidence", status: "Calculating" },
  ];

  useEffect(() => {
    const rowTimer = setInterval(() => {
      setRowsVisible((prev) => {
        if (prev >= rows.length) { clearInterval(rowTimer); return prev; }
        return prev + 1;
      });
    }, 400);
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(progressTimer); return 100; }
        return prev + 2.5;
      });
    }, 50);
    const advanceTimer = setTimeout(() => {
      setStage("result");
    }, 2200);
    return () => {
      clearInterval(rowTimer);
      clearInterval(progressTimer);
      clearTimeout(advanceTimer);
    };
  }, []);

  useEffect(() => {
    if (stage === "result") {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [stage]);

  if (stage === "analyzing") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-md">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <RefreshCw className="w-7 h-7 text-[#0062ff] animate-spin" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">
            Analyzing your summer driving profile…
          </h3>
          <div className="space-y-3 text-left">
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-500 ${
                  i < rowsVisible ? "bg-slate-50 border-slate-200 opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-xs font-medium text-slate-700">{row.label}</span>
                <span className="text-[10px] font-mono text-[#0062ff] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {row.status}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
              <span>Processing profile</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-75 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={resultRef} className="space-y-6">
      {/* Stage 2: Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-md"
      >
        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
          Assessment Complete
        </span>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-5 pb-6 border-b border-slate-100">
          <div>
            <p className="text-xs font-mono text-slate-500 mb-1">Your Vehicle Readiness Score</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-display font-black text-slate-900">{score}</span>
              <span className="text-lg font-mono text-slate-400 mb-1">/ 100</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Classification</p>
            <p className="text-sm font-display font-bold text-slate-900">{cohortName}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">{cohortTier}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-5 leading-relaxed max-w-xl">
          Your profile may qualify for founding cohort review based on your vehicle, driving pattern, and privacy preference inputs.
        </p>

        <div className="flex flex-wrap gap-3 mt-4 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> {vehicleYear} {vehicleMake} {vehicleModel}</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Ontario/GTA summer driving profile</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Pre-launch validation</span>
        </div>
      </motion.div>

      {/* Stage 3: Conversion CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 via-slate-50 to-white rounded-2xl border border-blue-200/80 p-6 md:p-8 relative overflow-hidden shadow-xs"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Founding Cohort Reservation
            </span>
            <h3 className="text-xl font-display font-bold text-slate-900 mt-2">
              Continue to Founding Cohort Reservation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              No payment required during validation · Selected interest helps shape early allocation
            </p>
          </div>
          <a
            href="https://reserve.astrateqgadgets.com?entry=summer-readiness&intent=cohort"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-[#0062ff] hover:bg-[#0052d4] text-white font-display font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            Continue to Founding Cohort Reservation <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      <div className="text-center">
        <button
          onClick={onContinue}
          className="text-xs text-slate-500 hover:text-slate-700 font-mono underline underline-offset-2 cursor-pointer transition"
        >
          View full assessment details & driving profile
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<"configurator" | "reveal" | "scanning" | "results" | "finalizing" | "reserved">("configurator");

  const [vehicleMake, setVehicleMake] = useState("Toyota");
  const [vehicleModel, setVehicleModel] = useState("RAV4");
  const [vehicleYear, setVehicleYear] = useState(2021);
  const [summerHeatExposure, setSummerHeatExposure] = useState<"Low" | "Medium" | "High">("High");
  const [highwayUsage, setHighwayUsage] = useState<"Low" | "Moderate" | "Heavy">("Heavy");
  const [signalComplexity, setSignalComplexity] = useState(4);
  const [privacySensitivity, setPrivacySensitivity] = useState(3);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [formErrors, setFormErrors] = useState<{ email?: string; model?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<AssessmentResult | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [personalLead, setPersonalLead] = useState<Lead | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [localScore, setLocalScore] = useState(68);

  const formRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) setLeads(await res.json());
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  const handleClearLeads = async () => {
    try {
      const res = await fetch("/api/leads/clear", { method: "POST" });
      if (res.ok) {
        setLeads([]);
        setPersonalLead(null);
        if (step !== "configurator") {
          setStep("configurator");
          setScanResult(null);
        }
      }
    } catch (err) {
      console.error("Error resetting leads:", err);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBackHome = () => {
    setStep("configurator");
    setScanResult(null);
    setPersonalLead(null);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Main form submit — shows 3-stage reveal, then optionally full assessment
  const handleStartAnalysis = async () => {
    const errors: { email?: string; model?: string } = {};
    if (!email.trim() || !email.includes("@")) errors.email = "Please enter a valid email address.";
    if (!vehicleModel.trim()) errors.model = "Vehicle model is required.";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});

    const score = simulateScore(privacySensitivity, highwayUsage, summerHeatExposure);
    setLocalScore(score);
    setStep("reveal");

    // Fire backend assessment in background
    setIsLoading(true);
    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleMake, vehicleModel, vehicleYear, summerHeatExposure, highwayUsage, signalComplexity, privacySensitivity }),
      });
      if (response.ok) setScanResult(await response.json());
    } catch (error) {
      console.error("Assessment request failed, using local score.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToFullResults = () => {
    if (scanResult) {
      setStep("results");
    } else {
      // Backend hasn't returned yet — build a result from local score
      const { tier, name: cohortName } = getCohortFromScore(localScore);
      const fallback: AssessmentResult = {
        readinessScore: localScore,
        summerDrivingRiskProfile: {
          riskLevel: summerHeatExposure === "High" && highwayUsage === "Heavy" ? "Critical" : summerHeatExposure === "High" ? "High" : "Moderate",
          gtaSpecificNotes: `Southern Ontario summers combine high humidity and heat with stop-and-go traffic on the 400-series highways. Your ${vehicleMake}'s driving profile places it in an elevated summer readiness category.`,
          thermalExposures: "Extended idling and direct sun exposure during peak summer months can strain battery and monitoring systems. Local-first diagnostics help keep these within safe operating ranges.",
        },
        eligibilityClassification: {
          cohortTier: tier,
          cohortName,
          perceivedExclusivity: "Pre-launch founding cohort consideration",
          explanation: `Your ${vehicleYear} ${vehicleMake} profile aligns with the ${cohortName} based on your driving habits and privacy preferences.`,
        },
        signals: {
          summerHeatExposure: summerHeatExposure === "High" ? 85 : summerHeatExposure === "Medium" ? 55 : 25,
          highwayUsagePattern: highwayUsage === "Heavy" ? 90 : highwayUsage === "Moderate" ? 60 : 30,
          vehicleSignalComplexity: signalComplexity * 12,
          privacySensitivityIndex: privacySensitivity * 20,
          compatibilityConfidence: localScore,
        },
        customRecommendations: [
          "Monitor driving conditions during peak summer heat to understand how your vehicle responds.",
          "Consider your highway patterns when evaluating privacy-first diagnostic options.",
          "Your driving profile suggests strong alignment with local-first intelligence direction.",
        ],
      };
      setScanResult(fallback);
      setStep("results");
    }
  };

  const handleSecureCohort = async () => {
    if (!scanResult) return;
    setStep("finalizing");

    setTimeout(async () => {
      try {
        const response = await fetch("/api/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, vehicleMake, vehicleModel, vehicleYear, assessment: scanResult }),
        });
        if (response.ok) {
          const data = await response.json();
          setPersonalLead(data.lead);
          setStep("reserved");
          fetchLeads();
        } else throw new Error();
      } catch (err) {
        const { tier, name: cohortName } = getCohortFromScore(localScore);
        const mockCampaign: EmailCampaignItem[] = [
          {
            subject: `[Astrateq Gadgets] Founding Cohort Reserved: Your ${vehicleYear} ${vehicleMake} Profile`,
            body: `<p>Hello ${name || "Driver"},</p><p>Your spot in the <strong>${cohortName}</strong> is secured. Your readiness score: <strong>${scanResult.readinessScore}/100</strong>.</p><p>Drive Safer. Drive Smarter.<br><strong>Astrateq Canada</strong></p>`,
            delayDays: 0, status: "Sent", sentAt: new Date().toISOString(),
          },
          {
            subject: `Privacy & Local Intelligence: What This Means for Your ${vehicleMake}`,
            body: `<p>Hello ${name || "Driver"},</p><p>Astrateq is built on a local-first architecture — your driving profile stays on your device, not in a commercial cloud.</p><p><strong>Astrateq Engineering, Toronto ON</strong></p>`,
            delayDays: 2, status: "Scheduled",
          },
        ];
        const localLead: Lead = {
          name, email, vehicleMake, vehicleModel, vehicleYear,
          readinessScore: scanResult.readinessScore,
          cohortTier: scanResult.eligibilityClassification.cohortTier,
          cohortName: scanResult.eligibilityClassification.cohortName,
          createdAt: new Date().toISOString(),
          followUpCampaign: mockCampaign,
        };
        setPersonalLead(localLead);
        setStep("reserved");
      }
    }, 2000);
  };

  const handleSimulateSendEmail = async (leadEmail: string, emailIndex: number) => {
    try {
      const response = await fetch("/api/leads/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadEmail, emailIndex }),
      });
      if (response.ok) {
        const data = await response.json();
        if (personalLead && personalLead.email.toLowerCase() === leadEmail.toLowerCase()) setPersonalLead(data.lead);
        fetchLeads();
      }
    } catch (err) {
      if (personalLead) {
        const updatedCampaign = [...personalLead.followUpCampaign];
        if (updatedCampaign[emailIndex]) {
          updatedCampaign[emailIndex].status = "Sent";
          updatedCampaign[emailIndex].sentAt = new Date().toISOString();
          setPersonalLead({ ...personalLead, followUpCampaign: updatedCampaign });
        }
      }
    }
  };

  const { tier: localTier, name: localCohortName } = getCohortFromScore(localScore);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col relative font-sans selection:bg-[#0062ff] selection:text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/j9cKyq27/Astrateq.png" alt="Astrateq Logo" className="h-9 w-auto" />
            <div>
              <h1 className="text-sm font-display font-black tracking-tighter uppercase italic text-slate-900">ASTRATEQ <span className="text-[#0062ff]">GADGETS</span></h1>
              <p className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">DRIVE SAFER. DRIVE SMARTER.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-100 border border-blue-200 text-[#0062ff] px-3 py-1 rounded-md uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Engineered for the North
            </span>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition relative flex items-center gap-1 cursor-pointer"
              title="Open Ops Desk"
            >
              <Settings className="w-4 h-4" />
              <span className="text-[11px] font-mono font-semibold hidden md:inline">Ops Desk</span>
              {leads.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0062ff] border-2 border-white rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-10">

        {/* Hero */}
        <AnimatePresence mode="wait">
          {step === "configurator" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12"
            >
              {/* Hero Left */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="px-3 py-1 bg-blue-50 rounded-md text-blue-700 text-xs font-bold uppercase tracking-widest border border-blue-200">
                  🇨🇦 Upcoming Brand · Phase 1 Market Validation
                </span>

                <h2 className="text-4xl md:text-5xl font-display font-black leading-tight tracking-tight uppercase text-slate-900">
                  Privacy-first vehicle intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-[#0062ff]">smarter driving.</span>
                </h2>

                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                  A pre-launch Canadian vehicle intelligence platform exploring privacy-first diagnostics, driver awareness, and smarter automotive insights. Check your readiness score and help shape local automotive compatibility.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={scrollToForm}
                    className="inline-flex items-center justify-center gap-2 bg-[#0062ff] hover:bg-[#0052d4] text-white font-display font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 group active:scale-98 w-full sm:w-auto"
                  >
                    Get My Readiness Score <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-500 text-center sm:text-left">
                    60 seconds · No payment required · Instant results
                  </span>
                </div>

                {/* Why Now urgency line */}
                <p className="text-[11px] text-slate-500 font-mono leading-relaxed max-w-lg border-l-2 border-blue-200 pl-3">
                  Summer validation is active for Ontario/GTA driving conditions. Early responses help shape compatibility priorities before hardware allocation decisions are made.
                </p>
              </div>

              {/* Hero Right — Vehicle Image */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-10 bg-blue-600/5 blur-[100px] rounded-full" />
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-video lg:aspect-square bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src="/images/luxury-car.png"
                    alt="Non-branded premium vehicle in a Canadian city environment"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-2 shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-mono text-slate-700 font-bold">Astrateq Readiness Validation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outcome Promises */}
        {step === "configurator" && <OutcomePromises />}

        {/* Back to Readiness Home — shown on all post-form steps */}
        {step !== "configurator" && (
          <div className="max-w-4xl mx-auto mb-4 mt-2">
            <button
              onClick={handleBackHome}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700 bg-white border border-slate-200 hover:border-blue-300 hover:text-[#0062ff] hover:shadow-sm px-3.5 py-2 rounded-full transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Readiness Home
            </button>
          </div>
        )}

        {/* Main Funnel Content */}
        <div className="max-w-4xl mx-auto mt-4" ref={formRef} id="configurator-form-anchor">
          <AnimatePresence mode="wait">

            {/* Step 1: Form */}
            {step === "configurator" && (
              <motion.div
                key="configurator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
              >
                {/* 3-Step Progress Strip */}
                <div className="flex items-center justify-center gap-2 mb-7">
                  {[
                    { label: "Vehicle Profile", step: 1 },
                    { label: "Driving Context", step: 2 },
                    { label: "Readiness Result", step: 3 },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border transition-all ${
                        s.step === 1
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}>
                        <span className={`text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                          s.step === 1 ? "bg-[#0062ff] text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                          {s.step}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{s.label}</span>
                      </div>
                      {i < 2 && (
                        <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-8 border-b border-slate-150 pb-5">
                  <span className="text-xs font-mono font-bold text-[#0062ff] uppercase tracking-widest">60-Second Readiness Check</span>
                  <h3 className="text-2xl font-display font-bold text-slate-900 mt-1 uppercase tracking-tight">Check Your Vehicle & Driving Profile</h3>
                  <p className="text-xs text-slate-500 mt-1">Answer a few quick questions to see how your vehicle and driving habits align with the Astrateq pre-launch validation program.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Vehicle Info Panel */}
                  <div className="bg-[#F8FBFF] border border-[#DCEBFA] rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-5 bg-[#0062ff] rounded-full" />
                      <h4 className="text-xs font-mono font-bold text-[#0062ff] uppercase tracking-wider flex items-center gap-1.5">
                        <Car className="w-4 h-4" /> Vehicle Information
                      </h4>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Manufacturer / Make</label>
                      <select
                        value={vehicleMake}
                        onChange={(e) => {
                          setVehicleMake(e.target.value);
                          if (e.target.value === "Tesla") setVehicleModel("Model Y");
                          else if (e.target.value === "Ford") setVehicleModel("F-150");
                          else if (e.target.value === "Toyota") setVehicleModel("RAV4");
                          else if (e.target.value === "BMW") setVehicleModel("i4");
                          else if (e.target.value === "Chevrolet") setVehicleModel("Bolt EV");
                          else if (e.target.value === "Subaru") setVehicleModel("Outback");
                        }}
                        className="w-full bg-white border border-[#DCEBFA] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden"
                      >
                        <option value="Toyota">Toyota</option>
                        <option value="Ford">Ford</option>
                        <option value="Tesla">Tesla</option>
                        <option value="BMW">BMW</option>
                        <option value="Chevrolet">Chevrolet</option>
                        <option value="Subaru">Subaru</option>
                        <option value="Honda">Honda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Model Name <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g. RAV4"
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden ${formErrors.model ? "border-red-400" : "border-[#DCEBFA]"}`}
                      />
                      {formErrors.model && <p className="text-[10px] text-red-500 mt-1 font-medium">{formErrors.model}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Production Year</label>
                        <select
                          value={vehicleYear}
                          onChange={(e) => setVehicleYear(parseInt(e.target.value))}
                          className="w-full bg-white border border-[#DCEBFA] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden"
                        >
                          {Array.from({ length: 31 }, (_, i) => 2026 - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Connected Devices <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
                        <select
                          value={signalComplexity}
                          onChange={(e) => setSignalComplexity(parseInt(e.target.value))}
                          className="w-full bg-white border border-[#DCEBFA] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden"
                        >
                          <option value="1">1 (Standard Radio)</option>
                          <option value="2">2 (Bluetooth Sync)</option>
                          <option value="4">4 (Dashcam + GPS)</option>
                          <option value="6">6 (Integrated Telematics)</option>
                          <option value="8">8+ (Smart Cockpit)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Driving Profile & Contact Panel */}
                  <div className="bg-[#F8FBFF] border border-[#DCEBFA] rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-5 bg-[#06b6d4] rounded-full" />
                      <h4 className="text-xs font-mono font-bold text-[#0062ff] uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4" /> Driving Profile & Contact
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Summer Heat Exposure</label>
                        <select
                          value={summerHeatExposure}
                          onChange={(e) => setSummerHeatExposure(e.target.value as any)}
                          className="w-full bg-white border border-[#DCEBFA] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden"
                        >
                          <option value="Low">Low (Parked in Shade)</option>
                          <option value="Medium">Medium (Mixed Urban)</option>
                          <option value="High">High (Direct Sun)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Highway Usage</label>
                        <select
                          value={highwayUsage}
                          onChange={(e) => setHighwayUsage(e.target.value as any)}
                          className="w-full bg-white border border-[#DCEBFA] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden"
                        >
                          <option value="Low">Low (City Commuter)</option>
                          <option value="Moderate">Moderate (Regional Routes)</option>
                          <option value="Heavy">Heavy (Frequent 400-Series)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Privacy Sensitivity (1–5)</label>
                      <div className="flex items-center justify-between gap-1.5 bg-white p-2.5 rounded-lg border border-[#DCEBFA]">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setPrivacySensitivity(val)}
                            className={`flex-1 py-2 rounded-md text-xs font-mono font-bold border transition cursor-pointer ${
                              privacySensitivity === val
                                ? "bg-[#0062ff] border-[#0062ff] text-white shadow-lg shadow-blue-600/20"
                                : "bg-white border-[#DCEBFA] text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-[#DCEBFA] pt-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">First Name <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full bg-white border border-[#DCEBFA] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address <span className="text-red-400">*</span></label>
                        <p className="text-[10px] text-slate-400 mb-1.5">We use your email only to send your readiness result and relevant cohort follow-up. No spam. No resale.</p>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.ca"
                          className={`w-full bg-white border rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0062ff] focus:outline-hidden ${formErrors.email ? "border-red-400" : "border-[#DCEBFA]"}`}
                        />
                        {formErrors.email && <p className="text-[10px] text-red-500 mt-1 font-medium">{formErrors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit CTA — Action Bar */}
                <div className="mt-8 pt-6 border-t border-slate-150 text-center bg-blue-50/30 -mx-6 md:-mx-8 px-6 md:px-8 pb-6 md:pb-8 rounded-b-2xl">
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto bg-[#0062ff] hover:bg-[#0052d4] text-white font-display font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl transition shadow-[0_4px_12px_rgba(0,98,255,0.15)] inline-flex items-center justify-center gap-2 active:scale-99 cursor-pointer"
                  >
                    Generate My Readiness Score <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                  <p className="text-[10px] text-slate-500 mt-3 font-mono">
                    60 seconds · No payment required · Instant preview
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: 3-Stage Result Reveal */}
            {step === "reveal" && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <ResultReveal
                  score={localScore}
                  vehicleMake={vehicleMake}
                  vehicleModel={vehicleModel}
                  vehicleYear={vehicleYear}
                  cohortTier={localTier}
                  cohortName={localCohortName}
                  onContinue={handleProceedToFullResults}
                />
              </motion.div>
            )}

            {/* Step 3: Full Results */}
            {step === "results" && scanResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md">
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
                    Assessment Verified
                  </span>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4 pb-6 border-b border-slate-150">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-mono">Readiness Result</span>
                      <h3 className="text-2xl font-display font-black text-slate-900 leading-snug uppercase tracking-tight">
                        {scanResult.eligibilityClassification.cohortTier} — Eligible for Cohort Review
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Driving profile reviewed for {vehicleYear} {vehicleMake} {vehicleModel}.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="rgba(0,0,0,0.05)" strokeWidth="4" fill="none" />
                          <circle cx="28" cy="28" r="24" stroke="#0062ff" strokeWidth="4" fill="none"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - scanResult.readinessScore / 100)}`} />
                        </svg>
                        <span className="absolute text-xs font-mono font-bold text-slate-900">{scanResult.readinessScore}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Readiness Score</div>
                        <div className="text-xs font-bold text-slate-700">Profile Reviewed</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-[#0062ff]" /> Southern Ontario Driving Risk Profile
                      </h4>
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> GTA Risk Index: {scanResult.summerDrivingRiskProfile.riskLevel}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scanResult.summerDrivingRiskProfile.gtaSpecificNotes}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#0062ff]" /> Summer Driving Analysis
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scanResult.summerDrivingRiskProfile.thermalExposures}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cohort Tiers */}
                <div>
                  <div className="text-center mb-6">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Pre-Launch Validation</span>
                    <h4 className="text-xl font-display font-black text-slate-900 mt-1 uppercase tracking-tight">Cohort Classification</h4>
                    <p className="text-xs text-slate-500 mt-1">Based on your driving profile and vehicle readiness signals.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { tier: "High Readiness", name: "Founding Early Allocation", color: "emerald", desc: "Best-suited for early access consideration in the pre-launch program.", perks: ["Early access to updates", "Priority review consideration", "Founding cohort recognition"] },
                      { tier: "Moderate Readiness", name: "Priority Evaluation Cohort", color: "amber", desc: "Strong alignment with the pre-launch validation program criteria.", perks: ["Custom readiness dashboard", "Priority evaluation queue", "Standard hardware consideration"] },
                      { tier: "Low Readiness", name: "Standard Validation Queue", color: "blue", desc: "Your profile is in the standard validation review queue.", perks: ["Standard review pass", "Access to core tools", "Validation queue status"] },
                    ].map(({ tier, name: tName, color, desc, perks }) => {
                      const isActive = scanResult.eligibilityClassification.cohortTier === tier;
                      return (
                        <div key={tier} className={`bg-white border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all ${
                          isActive ? `border-${color}-500 ring-2 ring-${color}-500/20 shadow-md bg-${color}-50/50` : "border-slate-200 opacity-60"
                        }`}>
                          {isActive && (
                            <div className={`absolute top-0 right-0 bg-${color}-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-lg`}>
                              Your Assignment
                            </div>
                          )}
                          <div>
                            <span className={`text-xs font-mono font-bold text-${color}-600 uppercase tracking-widest`}>{tier}</span>
                            <h5 className="text-lg font-display font-bold text-slate-900 mt-1">{tName}</h5>
                            <p className="text-xs text-slate-600 mt-3 leading-relaxed">{desc}</p>
                            <ul className="text-[10px] text-slate-500 font-mono space-y-2 mt-4 pt-4 border-t border-slate-150">
                              {perks.map((p) => (
                                <li key={p} className="flex items-center gap-1.5">
                                  <CheckCircle className={`w-3.5 h-3.5 text-${color}-500`} /> {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md">
                  <h4 className="text-xs font-mono font-bold text-[#0062ff] uppercase tracking-wider mb-4">
                    Your Personalized Summer Driving Notes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scanResult.customRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 shadow-xs">
                        <span className="text-xs font-mono font-bold bg-[#0062ff] text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cohort Reservation CTA */}
                <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-white rounded-2xl border border-blue-200/80 p-6 md:p-8 text-slate-800 relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Founding Cohort Reservation
                      </span>
                      <h3 className="text-2xl font-display font-bold text-slate-900 mt-2">
                        Unlock Founding Driver Access
                      </h3>
                      <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                        Claim your spot in the <strong>{scanResult.eligibilityClassification.cohortName}</strong> and receive your personalized follow-up. No payment required during validation.
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-2">
                        <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> No payment required</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Instant reservation</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSecureCohort}
                      className="w-full md:w-auto bg-[#0062ff] hover:bg-[#0052d4] text-white font-display font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 shrink-0 active:scale-98 cursor-pointer"
                    >
                      Unlock Founding Driver Access <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Finalizing */}
            {step === "finalizing" && (
              <motion.div
                key="finalizing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-md"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0062ff]">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-wider">Finalizing your cohort reservation…</h3>
                <p className="text-xs text-slate-500 mt-2">Setting up your personalized follow-up sequence.</p>
              </motion.div>
            )}

            {/* Step 5: Reserved */}
            {step === "reserved" && personalLead && (
              <motion.div
                key="reserved"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-200 p-6 md:p-8 text-slate-800 text-center relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-500/20">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-blue-600 uppercase tracking-wider">Founding Cohort Reserved</h3>
                  <p className="text-xs text-slate-600 max-w-xl mx-auto mt-2">
                    {name ? `${name}, your` : "Your"} spot in the <strong>{personalLead.cohortName}</strong> is secured for your <strong>{vehicleYear} {vehicleMake}</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-xs font-mono font-bold">
                    <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-700 shadow-xs">
                      Readiness Score: {personalLead.readinessScore}/100
                    </span>
                    <span className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg text-blue-700 shadow-xs">
                      {personalLead.cohortTier}
                    </span>
                  </div>
                </div>

                <PersonalInbox
                  name={name}
                  email={email}
                  vehicleMake={vehicleMake}
                  vehicleModel={vehicleModel}
                  vehicleYear={vehicleYear}
                  score={personalLead.readinessScore}
                  cohortName={personalLead.cohortName}
                  campaign={personalLead.followUpCampaign || []}
                  onTriggerEmail={(emailIdx) => handleSimulateSendEmail(email, emailIdx)}
                />

                <div className="text-center pt-4">
                  <button
                    onClick={() => { setStep("configurator"); setScanResult(null); setPersonalLead(null); }}
                    className="text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-mono uppercase tracking-widest px-5 py-2.5 rounded-lg transition cursor-pointer font-bold"
                  >
                    Check Another Vehicle
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 md:mt-20">
          <TrustModule />
        </div>

        {showAdmin && (
          <div className="mt-12">
            <AdminPanel
              leads={leads}
              onRefresh={fetchLeads}
              onClearLeads={handleClearLeads}
              onTriggerEmail={handleSimulateSendEmail}
            />
          </div>
        )}
      </main>

      <footer className="bg-white text-slate-700 mt-20 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <img
              src="https://i.ibb.co/GQw0m4mg/Astrateq.png"
              alt="Astrateq Gadgets logo"
              className="h-auto w-28 object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <span className="text-sm font-display font-black uppercase tracking-widest text-slate-900">ASTRATEQ CANADA</span>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Developing next-generation local-first vehicle intelligence and driver awareness tools in Ontario, Canada.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400">
            <span>© 2026 Astrateq Gadgets. Toronto, ON, Canada.</span>
            <span>•</span>
            <span>Local-first diagnostic direction</span>
            <span>•</span>
            <span>No data resale</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
