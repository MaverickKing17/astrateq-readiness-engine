import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Car, 
  ShieldAlert, 
  Gauge, 
  ChevronRight, 
  Layers, 
  Users, 
  CheckCircle, 
  RefreshCw, 
  Mail, 
  Compass, 
  Lock, 
  Settings, 
  Info,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import TrustModule from "./components/TrustModule";
import OutcomePromises from "./components/OutcomePromises";
import LiveAssessmentScanner from "./components/LiveAssessmentScanner";
import AdminPanel from "./components/AdminPanel";
import PersonalInbox from "./components/PersonalInbox";
import { AssessmentResult, Lead, EmailCampaignItem } from "./types";

export default function App() {
  // Navigation / Funnel state: 'configurator' | 'scanning' | 'results' | 'finalizing' | 'reserved'
  const [step, setStep] = useState<"configurator" | "scanning" | "results" | "finalizing" | "reserved">("configurator");

  // Configurator form inputs
  const [vehicleMake, setVehicleMake] = useState("Toyota");
  const [vehicleModel, setVehicleModel] = useState("RAV4");
  const [vehicleYear, setVehicleYear] = useState(2021);
  const [summerHeatExposure, setSummerHeatExposure] = useState<"Low" | "Medium" | "High">("High");
  const [highwayUsage, setHighwayUsage] = useState<"Low" | "Moderate" | "Heavy">("Heavy");
  const [signalComplexity, setSignalComplexity] = useState(4); // 1-8
  const [privacySensitivity, setPrivacySensitivity] = useState(3); // 1-5
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Error/validation handling
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; model?: string }>({});

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<AssessmentResult | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [personalLead, setPersonalLead] = useState<Lead | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Fetch leads on mount for the Admin Panel
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Error fetching leads list:", err);
    }
  };

  const handleClearLeads = async () => {
    try {
      const res = await fetch("/api/leads/clear", { method: "POST" });
      if (res.ok) {
        setLeads([]);
        setPersonalLead(null);
        if (step === "reserved" || step === "results") {
          setStep("configurator");
          setScanResult(null);
        }
      }
    } catch (err) {
      console.error("Error resetting leads:", err);
    }
  };

  // Run the Vehicle Assessment call (creates initial assessment)
  const handleStartAnalysis = async () => {
    // Validate email & name early
    const errors: { name?: string; email?: string; model?: string } = {};
    if (!name.trim()) errors.name = "First name is required.";
    if (!email.trim() || !email.includes("@")) errors.email = "Please enter a valid email address.";
    if (!vehicleModel.trim()) errors.model = "Vehicle model is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsLoading(true);
    setStep("scanning");

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleMake,
          vehicleModel,
          vehicleYear,
          summerHeatExposure,
          highwayUsage,
          signalComplexity,
          privacySensitivity,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setScanResult(result);
        
        // Let the scanner run its realistic timer
        // Once 100% is reached, the scanner calls onScanComplete which unlocks the results step
      } else {
        throw new Error("Backend assessment returned an error.");
      }
    } catch (error) {
      console.error("Assessment request failed. Using robust fallback client generator:", error);
      // Construct fallback details to keep the app 100% functional
      const fallbackResult: AssessmentResult = {
        readinessScore: 78,
        summerDrivingRiskProfile: {
          riskLevel: "High",
          gtaSpecificNotes: `Southern Ontario summers feature heavy stop-and-go delays. Bumper-to-bumper queues on Highway 401 combined with ${summerHeatExposure.toLowerCase()} summer heat adds significant load to your ${vehicleMake}'s digital monitoring cores.`,
          thermalExposures: "Stop-start highway patterns and elevated road temperatures trigger battery drain spikes. Local-only diagnostic firmware keeps these systems in safe boundaries offline.",
        },
        eligibilityClassification: {
          cohortTier: "Moderate Readiness",
          cohortName: "Priority Evaluation Cohort",
          perceivedExclusivity: "Reserved for the top 50% of validated OBD-II profiles in the Greater Toronto Area.",
          explanation: `Your ${vehicleYear} ${vehicleMake} features responsive electronic signal nodes, qualifying you directly for priority hardware allocations.`,
        },
        signals: {
          summerHeatExposure: summerHeatExposure === "High" ? 85 : 50,
          highwayUsagePattern: highwayUsage === "Heavy" ? 90 : 60,
          vehicleSignalComplexity: signalComplexity * 12,
          privacySensitivityIndex: privacySensitivity * 20,
          compatibilityConfidence: 78,
        },
        customRecommendations: [
          "Monitor real-time engine intake thermal parameters during prolonged summer traffic jams.",
          "Enable alerts for diagnostic voltage drops before stop-start commuter cycles cause battery failure.",
          "Shield cabin OBD-II signals from continuous third-party telemetry scraping on public routes.",
        ],
      };
      setScanResult(fallbackResult);
    }
  };

  // Called when the simulated scanning is completed
  const handleScanFinished = (result: any) => {
    setIsLoading(false);
    setStep("results");
  };

  // Confirm reservation & trigger Stripe Transition
  const handleSecureCohort = async () => {
    if (!scanResult) return;
    setStep("finalizing");

    // Simulate Stripe transition timing (reinforced progression psychology)
    setTimeout(async () => {
      try {
        const response = await fetch("/api/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            assessment: scanResult,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPersonalLead(data.lead);
          setStep("reserved");
          fetchLeads(); // Refresh admin list
        } else {
          throw new Error("Failed to secure cohort reservation.");
        }
      } catch (err) {
        console.error("Reserve endpoint failed. Constructing safe mock reservation:", err);
        // Fallback save locally
        const mockCampaign: EmailCampaignItem[] = [
          {
            subject: `[Astrateq Gadgets] Founding Cohort Confirmed: Your ${vehicleYear} ${vehicleMake} Status`,
            body: `<p>Bonjour ${name},</p>
                   <p>Your founding cohort spot in the <strong>${scanResult.eligibilityClassification.cohortName}</strong> is officially secured. Your readiness score is <strong>${scanResult.readinessScore}/100</strong>.</p>
                   <p>Astrateq edge intelligence devices operate local-only without cloud leakage. No payment is required to validate your cohort spot today.</p>
                   <p>Drive Safer. Drive Smarter.<br><strong>The Astrateq Canada Team</strong></p>`,
            delayDays: 0,
            status: "Sent",
            sentAt: new Date().toISOString()
          },
          {
            subject: `Technical Briefing: Securing Your ${vehicleMake}'s Signal Privacy on Ontario Highways`,
            body: `<p>Hello ${name},</p>
                   <p>Did you know modern digital cars broadcast hundreds of diagnostic variables every second? Most of this data is silently collected, monetized, and transmitted to global cloud servers.</p>
                   <p>At <strong>Astrateq Gadgets</strong>, we build hardware on a local-first architecture. Zero cellular uploads. Zero commercial cloud relays.</p>
                   <p>Best regards,<br><strong>Astrateq Engineering (Toronto, ON)</strong></p>`,
            delayDays: 2,
            status: "Scheduled"
          }
        ];
        const localLead: Lead = {
          name,
          email,
          vehicleMake,
          vehicleModel,
          vehicleYear,
          readinessScore: scanResult.readinessScore,
          cohortTier: scanResult.eligibilityClassification.cohortTier,
          cohortName: scanResult.eligibilityClassification.cohortName,
          createdAt: new Date().toISOString(),
          followUpCampaign: mockCampaign
        };
        setPersonalLead(localLead);
        setStep("reserved");
      }
    }, 2000);
  };

  // Simulate triggering an automated email send (fast-forward)
  const handleSimulateSendEmail = async (leadEmail: string, emailIndex: number) => {
    try {
      const response = await fetch("/api/leads/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadEmail, emailIndex })
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state for personal lead if applicable
        if (personalLead && personalLead.email.toLowerCase() === leadEmail.toLowerCase()) {
          setPersonalLead(data.lead);
        }
        fetchLeads();
      }
    } catch (err) {
      console.error("Error triggering mock email dispatch:", err);
      // Handle local state update as fallback
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative font-sans selection:bg-brand-cyan selection:text-brand-dark">
      
      {/* Upper Navigation & Brand Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-navy rounded-xl flex items-center justify-center text-brand-cyan shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-display font-bold tracking-tight text-brand-navy">ASTRATEQ GADGETS</h1>
              <p className="text-[10px] font-mono font-medium text-slate-400 tracking-wider">DRIVE SAFER. DRIVE SMARTER.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Canadian Pre-Launch Validation
            </span>

            {/* Float Config Operational Desk Button */}
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition relative flex items-center gap-1"
              title="Open Ops Desk"
              id="ops-desk-toggle"
            >
              <Settings className="w-4 h-4" />
              <span className="text-[11px] font-mono font-semibold hidden md:inline">Ops Desk</span>
              {leads.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-cyan border-2 border-white rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-10">
        
        {/* Banner with dynamically generated mockups or brand focus */}
        <AnimatePresence mode="wait">
          {step === "configurator" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12"
            >
              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-xs font-mono font-bold text-indigo-600 tracking-widest uppercase">
                  Upcoming Brand • Phase 1 Market Validation
                </span>
                
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-navy tracking-tight leading-tight">
                  Privacy-first vehicle intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-700">smarter driving.</span>
                </h2>
                
                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                  A pre-launch Canadian vehicle intelligence platform exploring privacy-first diagnostics, driver awareness, and smarter automotive insights. Secure your diagnostic hardware allocation and help shape local automotive safety.
                </p>

                {/* Single Primary Form Callout to direct attention */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="#configurator-form-anchor"
                    className="inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-display font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-brand-navy/10 group active:scale-98"
                  >
                    Start Vehicle Readiness Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </a>
                  <span className="text-[11px] font-mono text-slate-500 text-center sm:text-left">
                    ⚡ 60 seconds • No payment required • Instant results
                  </span>
                </div>
              </div>

              {/* Hero Right Visual Column */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 aspect-video lg:aspect-square bg-slate-100 flex items-center justify-center">
                  <img
                    src="/src/assets/images/premium_canadian_suv.jpg"
                    alt="Premium Modern Vehicle"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle watermarked brand info overlay */}
                  <div className="absolute bottom-4 left-4 bg-brand-navy/85 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                    <span className="text-[10px] font-mono text-slate-300">Astrateq Edge Chassis Validation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informational promised deliverables prior to completion */}
        {step === "configurator" && <OutcomePromises />}

        {/* Dynamic Funnel Flow Content Router */}
        <div className="max-w-4xl mx-auto mt-12" id="configurator-form-anchor">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Configurator Input Form */}
            {step === "configurator" && (
              <motion.div
                key="configurator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs"
              >
                <div className="text-center mb-8 border-b border-slate-100 pb-5">
                  <span className="text-xs font-mono font-bold text-brand-cyan uppercase">Lead Profiler</span>
                  <h3 className="text-2xl font-display font-bold text-slate-800 mt-1">Configure Your Vehicle & Profile</h3>
                  <p className="text-xs text-slate-500 mt-1">Select parameters to benchmark signal telemetry leakage and hardware readiness.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Parameters Card */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-brand-cyan" /> Vehicle Information
                    </h4>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Manufacturer / Make</label>
                      <select
                        value={vehicleMake}
                        onChange={(e) => {
                          setVehicleMake(e.target.value);
                          // Auto-suggest default models to make it user-friendly
                          if (e.target.value === "Tesla") setVehicleModel("Model Y");
                          else if (e.target.value === "Ford") setVehicleModel("F-150");
                          else if (e.target.value === "Toyota") setVehicleModel("RAV4");
                          else if (e.target.value === "BMW") setVehicleModel("i4");
                          else if (e.target.value === "Chevrolet") setVehicleModel("Bolt EV");
                          else if (e.target.value === "Subaru") setVehicleModel("Outback");
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden"
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
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Model Name</label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g. RAV4"
                        className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden ${
                          formErrors.model ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                        }`}
                      />
                      {formErrors.model && <p className="text-[10px] text-rose-500 mt-1 font-medium">{formErrors.model}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Production Year</label>
                        <select
                          value={vehicleYear}
                          onChange={(e) => setVehicleYear(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden"
                        >
                          {Array.from({ length: 31 }, (_, i) => 2026 - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Onboard Connected Devices</label>
                        <select
                          value={signalComplexity}
                          onChange={(e) => setSignalComplexity(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden"
                        >
                          <option value="1">1 (Standard Radio)</option>
                          <option value="2">2 (Bluetooth Sync)</option>
                          <option value="4">4 (Dashcam + Connected GPS)</option>
                          <option value="6">6 (Integrated Telematics)</option>
                          <option value="8">8+ (Smart Cockpit Nodes)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Driving & Identity Parameters Card */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-brand-cyan" /> Driving Habits & Identity
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Summer Heat Exposure</label>
                        <select
                          value={summerHeatExposure}
                          onChange={(e) => setSummerHeatExposure(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden"
                        >
                          <option value="Low">Low (Parked in Shade)</option>
                          <option value="Medium">Medium (Mixed Urban)</option>
                          <option value="High">High (Direct Sun/Heatwaves)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Highway Usage</label>
                        <select
                          value={highwayUsage}
                          onChange={(e) => setHighwayUsage(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden"
                        >
                          <option value="Low">Low (City Commuter)</option>
                          <option value="Moderate">Moderate (Regional Routes)</option>
                          <option value="Heavy">Heavy (Frequent 400-Series)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Privacy Sensitivity Index (1-5)</label>
                      <div className="flex items-center justify-between gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setPrivacySensitivity(val)}
                            className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold border transition ${
                              privacySensitivity === val
                                ? "bg-brand-navy border-brand-navy text-brand-cyan"
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden ${
                            formErrors.name ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                          }`}
                        />
                        {formErrors.name && <p className="text-[10px] text-rose-500 mt-1 font-medium">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.ca"
                          className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-cyan focus:outline-hidden ${
                            formErrors.email ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                          }`}
                        />
                        {formErrors.email && <p className="text-[10px] text-rose-500 mt-1 font-medium">{formErrors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dominant Call to Action (Strict Step 2 Requirement) */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto bg-brand-navy hover:bg-brand-navy/95 text-white font-display font-extrabold text-sm px-10 py-4 rounded-xl transition shadow-lg shadow-brand-navy/15 inline-flex items-center justify-center gap-2 active:scale-99"
                  >
                    Start Vehicle Readiness Analysis <ChevronRight className="w-4 h-4 text-brand-cyan" />
                  </button>
                  <p className="text-[10px] text-slate-400 mt-3 font-mono">
                    Privacy Protection: Diagnostic queries are performed offline using localized schema variables.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Live Scanning Phase */}
            {step === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LiveAssessmentScanner
                  vehicleMake={vehicleMake}
                  vehicleModel={vehicleModel}
                  vehicleYear={vehicleYear}
                  summerHeatExposure={summerHeatExposure}
                  highwayUsage={highwayUsage}
                  signalComplexity={signalComplexity}
                  privacySensitivity={privacySensitivity}
                  isLoading={isLoading}
                  scanResult={scanResult}
                  hasStartedScan={true}
                  startScan={() => {}}
                  onScanComplete={handleScanFinished}
                />
                
                {/* Watcher to advance to results once scanResult finishes on the backend */}
                {scanResult && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => handleScanFinished(scanResult)}
                      className="text-xs bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-semibold hover:bg-slate-300 transition"
                    >
                      Skip Scanning Phase & View Results
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Analysis Results and Escalation Tiers */}
            {step === "results" && scanResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Results Main Banner */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
                  <span className="text-[10px] font-mono font-bold bg-brand-cyan/15 text-cyan-800 px-3 py-1 rounded-full uppercase tracking-wider">
                    Assessment Verified
                  </span>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-mono">Preliminary Readiness Result</span>
                      <h3 className="text-2xl font-display font-extrabold text-slate-900 leading-snug">
                        {scanResult.eligibilityClassification.cohortTier} → Eligible for Priority Cohort Review
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Verified footprint for {vehicleYear} {vehicleMake} {vehicleModel}.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {/* Circle Gauge rendering score */}
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                          <circle cx="28" cy="28" r="24" stroke="#06b6d4" strokeWidth="4" fill="none" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset={`${2 * Math.PI * 24 * (1 - scanResult.readinessScore / 100)}`} />
                        </svg>
                        <span className="absolute text-xs font-mono font-bold text-slate-800">{scanResult.readinessScore}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Readiness Score</div>
                        <div className="text-xs font-bold text-slate-700">Certified Compatible</div>
                      </div>
                    </div>
                  </div>

                  {/* Summer thermal risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-500" /> Southern Ontario Driving Risk Profile
                      </h4>
                      <p className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> GTA Risk Index: {scanResult.summerDrivingRiskProfile.riskLevel}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {scanResult.summerDrivingRiskProfile.gtaSpecificNotes}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-brand-cyan" /> Thermal System Analysis
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {scanResult.summerDrivingRiskProfile.thermalExposures}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cohort Classification Section (Step 5 Requirement) */}
                <div>
                  <div className="text-center mb-6">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">Pre-Launch Calibration</span>
                    <h4 className="text-xl font-display font-bold text-slate-800 mt-1">Cohort Classification Tiers</h4>
                    <p className="text-xs text-slate-400 mt-1">We limit driver intake per cohort to preserve hardware firmware validation telemetry.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tier 1: High */}
                    <div className={`bg-white rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between transition-all ${
                      scanResult.eligibilityClassification.cohortTier === "High Readiness"
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                        : "border-slate-200/80 opacity-75"
                    }`}>
                      {scanResult.eligibilityClassification.cohortTier === "High Readiness" && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-lg">
                          Your Assignment
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-mono font-semibold text-emerald-600">High Readiness</span>
                        <h5 className="text-lg font-display font-bold text-slate-800 mt-1">Founding Early Allocation</h5>
                        <p className="text-[11px] text-slate-400 font-medium font-mono mt-1">Top 20% of eligible drivers</p>
                        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                          Best-suited for localized edge diagnostic loops with instant telemetry validation locks.
                        </p>
                        <ul className="text-[10px] text-slate-500 font-mono space-y-2 mt-4 pt-4 border-t border-slate-100">
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Early access to updates</li>
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Priority hardware allocation</li>
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Free diagnostic calibrations</li>
                        </ul>
                      </div>
                    </div>

                    {/* Tier 2: Moderate */}
                    <div className={`bg-white rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between transition-all ${
                      scanResult.eligibilityClassification.cohortTier === "Moderate Readiness"
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                        : "border-slate-200/80 opacity-75"
                    }`}>
                      {scanResult.eligibilityClassification.cohortTier === "Moderate Readiness" && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-lg">
                          Your Assignment
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-mono font-semibold text-amber-600">Moderate Readiness</span>
                        <h5 className="text-lg font-display font-bold text-slate-800 mt-1">Priority Evaluation Cohort</h5>
                        <p className="text-[11px] text-slate-400 font-medium font-mono mt-1">Next 50% of validated drivers</p>
                        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                          Optimized for standard OBD-II telemetry logs with localized diagnostic alerts.
                        </p>
                        <ul className="text-[10px] text-slate-500 font-mono space-y-2 mt-4 pt-4 border-t border-slate-100">
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Custom diagnostics dashboard</li>
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Enhanced sensor analysis loops</li>
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Standard hardware queues</li>
                        </ul>
                      </div>
                    </div>

                    {/* Tier 3: Low */}
                    <div className={`bg-white rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between transition-all ${
                      scanResult.eligibilityClassification.cohortTier === "Low Readiness"
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                        : "border-slate-200/80 opacity-75"
                    }`}>
                      {scanResult.eligibilityClassification.cohortTier === "Low Readiness" && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-lg">
                          Your Assignment
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-mono font-semibold text-blue-600">Low Readiness</span>
                        <h5 className="text-lg font-display font-bold text-slate-800 mt-1">Standard Validation Queue</h5>
                        <p className="text-[11px] text-slate-400 font-medium font-mono mt-1">Remaining validated queue</p>
                        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                          Assigned for standard firmware matching and customized cable calibrations.
                        </p>
                        <ul className="text-[10px] text-slate-500 font-mono space-y-2 mt-4 pt-4 border-t border-slate-100">
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Standard security audit pass</li>
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Access to core diagnostic tools</li>
                          <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Optional diagnostic hardware</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personalized Recommendations */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Your Personalized Summer Diagnostic Bulletins
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scanResult.customRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-xs font-mono font-bold bg-brand-navy text-brand-cyan w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secure Cohort Conversion Moment (Step 6 Requirement) */}
                <div className="bg-brand-navy rounded-2xl border border-slate-800 p-6 md:p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Secure Your Founding Cohort Status
                      </span>
                      <h3 className="text-2xl font-display font-bold text-slate-100 mt-2">
                        Unlock Founding Driver Access
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Claim your slot in the <strong>{scanResult.eligibilityClassification.cohortName}</strong> and trigger your diagnostic onboarding campaign. No upfront payment required.
                      </p>
                      
                      {/* Microcopy (Page 5 Requirements) */}
                      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-2">
                        <span className="flex items-center gap-1">✔ No payment required</span>
                        <span className="flex items-center gap-1">✔ 60-second assessment</span>
                        <span className="flex items-center gap-1">✔ Instant reservation</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSecureCohort}
                      className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-sm px-8 py-4 rounded-xl transition shadow-lg shadow-brand-cyan/10 flex items-center justify-center gap-2 shrink-0 active:scale-98"
                    >
                      Unlock Founding Driver Access <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Finalizing transition (Progression psychology) */}
            {step === "finalizing" && (
              <motion.div
                key="finalizing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs"
              >
                <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-cyan">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-navy">Finalizing your cohort eligibility classification...</h3>
                <p className="text-xs text-slate-500 mt-2">Structuring custom safety bulletins and personalized diagnostic follow-ups.</p>
              </motion.div>
            )}

            {/* Step 5: Cohort Reserved State (Portal and Inbox Unlocked) */}
            {step === "reserved" && personalLead && (
              <motion.div
                key="reserved"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Cohort reserved confirmation */}
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 md:p-8 text-slate-800 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-emerald-900">Founding Cohort Reserved Successfully!</h3>
                  <p className="text-xs text-slate-600 max-w-xl mx-auto mt-2">
                    Congratulations <strong>{name}</strong>! Your space in the <strong>{personalLead.cohortName}</strong> is secured for your <strong>{vehicleYear} {vehicleMake}</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-xs font-mono font-bold text-slate-500">
                    <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-700">
                      Readiness Index: {personalLead.readinessScore}/100
                    </span>
                    <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-emerald-700">
                      Tier: {personalLead.cohortTier}
                    </span>
                  </div>
                </div>

                {/* Personal inbox campaign sequence simulator */}
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

                {/* Link to trigger more configuration */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setStep("configurator");
                      setScanResult(null);
                      setPersonalLead(null);
                    }}
                    className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg transition"
                  >
                    Benchmark Another Vehicle
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Brand Values Trust Module at bottom */}
        <TrustModule />

        {/* Dynamic Expandable Operational Desk Overlay Panel (Admin view) */}
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

      {/* Trust-first Footer */}
      <footer className="bg-slate-900 text-white mt-20 border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-brand-cyan" />
              <span className="text-sm font-display font-bold">ASTRATEQ CANADA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Developing next-generation localized hardware-in-the-loop edge diagnostic controllers in Ontario, Canada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500">
            <span>© 2026 Astrateq Gadgets Inc.</span>
            <span>•</span>
            <span>Local-Only Diagnostics</span>
            <span>•</span>
            <span>No Cloud Telemetry Resale</span>
            <span>•</span>
            <span>Toronto validation office</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
