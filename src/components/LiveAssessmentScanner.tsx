import { useState, useEffect } from "react";
import { Play, Sparkles, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LiveAssessmentScannerProps {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  summerHeatExposure: string;
  highwayUsage: string;
  signalComplexity: number;
  privacySensitivity: number;
  onScanComplete: (result: any) => void;
  isLoading: boolean;
  scanResult: any;
  startScan: () => void;
  hasStartedScan: boolean;
}

export default function LiveAssessmentScanner({
  vehicleMake,
  vehicleModel,
  vehicleYear,
  summerHeatExposure,
  highwayUsage,
  signalComplexity,
  privacySensitivity,
  onScanComplete,
  isLoading,
  scanResult,
  startScan,
  hasStartedScan
}: LiveAssessmentScannerProps) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { text: "Scanning vehicle environment...", detail: `Identifying signal buses for ${vehicleYear} ${vehicleMake} electronic systems` },
    { text: "Evaluating Canadian driving conditions...", detail: `Mapping thermal profiles for ${summerHeatExposure} summer exposure in Southern Ontario` },
    { text: "Processing diagnostic signal layers...", detail: `Interrogating digital networks for OBD-II payload handshakes` },
    { text: "Calibrating privacy sensitivity index...", detail: `Analyzing risk vector exposures for ${privacySensitivity}/5 concern rating` },
    { text: "Calculating compatibility confidence...", detail: "Processing founding cohort classification limits" }
  ];

  // Run the animated progress bar
  useEffect(() => {
    if (hasStartedScan && isLoading) {
      setProgress(0);
      setActiveStep(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1.5;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Update active step based on progress thresholds
          const stepSize = 100 / steps.length;
          const currentStep = Math.floor(next / stepSize);
          if (currentStep < steps.length) {
            setActiveStep(currentStep);
          }
          return next;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [hasStartedScan, isLoading]);

  // Helper to get status color/text of each step during scan
  const getStepStatus = (index: number) => {
    if (activeStep > index || progress === 100) {
      return { text: "Completed", color: "text-emerald-400 font-medium" };
    }
    if (activeStep === index) {
      return { text: "Active...", color: "text-brand-cyan animate-pulse font-semibold" };
    }
    return { text: "Pending", color: "text-slate-500" };
  };

  return (
    <div id="live-readiness-preview" className="w-full bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 md:p-8 mt-12 relative overflow-hidden">
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase">Active Scanner Terminal</span>
          <h2 className="text-2xl font-display font-bold mt-1 text-slate-100">Live Vehicle Intelligence Assessment</h2>
        </div>
        <div className="mt-2 md:mt-0 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-mono text-slate-400">
          Target: {vehicleYear} {vehicleMake} {vehicleModel || "OBD-II vehicle"}
        </div>
      </div>

      {!hasStartedScan ? (
        <div className="text-center py-10 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin-slow" />
          </div>
          <h3 className="text-xl font-display font-semibold text-slate-200">Awaiting Diagnostics Trigger</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Please configure your vehicle parameters in the configurator above, then trigger the analysis engine to evaluate compatibility, thermal summer risks, and privacy indexes.
          </p>
          <button
            onClick={startScan}
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-brand-cyan hover:to-blue-500 text-slate-950 font-display font-bold text-sm px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-brand-cyan/20 active:scale-98"
          >
            Start Vehicle Readiness Analysis <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Radar Chassis Map */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-6 relative h-[280px]">
            {/* Visual Scan Ping Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-48 h-48 rounded-full border border-brand-cyan/10 flex items-center justify-center transition-all ${isLoading ? 'animate-ping-slow' : ''}`}>
                <div className="w-32 h-32 rounded-full border border-brand-cyan/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-cyan/10 border border-brand-cyan/40" />
                </div>
              </div>
            </div>

            {/* Vehicle Wireframe Representation (SVG Styling) */}
            <svg
              viewBox="0 0 100 100"
              className="w-40 h-40 relative z-10"
              fill="none"
              stroke="currentColor"
            >
              {/* Outer chassis boundary */}
              <path
                d="M35 15 C35 10, 65 10, 65 15 L70 30 L72 50 L70 70 L65 85 C65 90, 35 90, 35 85 L30 70 L28 50 L30 30 Z"
                strokeWidth="1.5"
                className={`${isLoading ? "stroke-brand-cyan" : "stroke-emerald-400"} transition-all duration-500`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Wheels */}
              <rect x="24" y="22" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              <rect x="70" y="22" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              <rect x="24" y="66" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              <rect x="70" y="66" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              
              {/* Internal Signal Core */}
              <circle cx="50" cy="50" r="4" className={`${isLoading ? "fill-brand-cyan animate-ping" : "fill-emerald-400"}`} />
              <line x1="50" y1="30" x2="50" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="2" />
              <line x1="35" y1="50" x2="65" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="2" />

              {/* Dynamic Scanning Laser Bar */}
              {isLoading && (
                <line
                  x1="20"
                  y1={15 + (70 * (progress / 100))}
                  x2="80"
                  y2={15 + (70 * (progress / 100))}
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="opacity-80"
                />
              )}
            </svg>

            <div className="mt-4 text-center z-10">
              <span className="text-xs font-mono font-medium text-slate-400">
                {isLoading ? "OBD-II Interface Handshaking..." : "Telemetry Analysis Locked"}
              </span>
              <div className="text-lg font-display font-bold text-slate-100 mt-1">
                {isLoading ? `Analyzing: ${Math.floor(progress)}%` : "Ready"}
              </div>
            </div>
          </div>

          {/* Right Column: Signal Steps & Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const status = getStepStatus(idx);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activeStep === idx && isLoading
                        ? "bg-slate-900 border-brand-cyan/40 shadow-xs"
                        : activeStep > idx || progress === 100
                        ? "bg-slate-950 border-emerald-500/20"
                        : "bg-slate-950/20 border-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-semibold text-slate-300">
                        {step.text}
                      </span>
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    {(activeStep === idx || activeStep > idx || progress === 100) && (
                      <p className="text-[10px] text-slate-400 mt-1 font-mono leading-relaxed">
                        {step.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall progress bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
                <span>Signal Evaluation Queue</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-brand-cyan transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
