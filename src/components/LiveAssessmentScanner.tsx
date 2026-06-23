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
      return { text: "Completed", color: "text-red-400 font-bold" };
    }
    if (activeStep === index) {
      return { text: "Active...", color: "text-red-400 animate-pulse font-semibold" };
    }
    return { text: "Pending", color: "text-slate-500" };
  };

  return (
    <div id="live-readiness-preview" className="w-full bg-[#111218] text-white rounded-2xl border border-white/10 p-6 md:p-8 mt-12 relative overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-red-500 uppercase">Active Scanner Terminal</span>
          <h2 className="text-2xl font-display font-black mt-1 text-white uppercase tracking-tight">Live Vehicle Intelligence Assessment</h2>
        </div>
        <div className="mt-2 md:mt-0 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-slate-400">
          Target: {vehicleYear} {vehicleMake} {vehicleModel || "OBD-II vehicle"}
        </div>
      </div>

      {!hasStartedScan ? (
        <div className="text-center py-10 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-red-950/40 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin-slow" />
          </div>
          <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Awaiting Diagnostics Trigger</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Please configure your vehicle parameters in the configurator above, then trigger the analysis engine to evaluate compatibility, thermal summer risks, and privacy indexes.
          </p>
          <button
            onClick={startScan}
            className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-mono uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-red-500/20 active:scale-98 cursor-pointer"
          >
            Start Vehicle Readiness Analysis <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Radar Chassis Map */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-white/5 p-6 relative h-[280px]">
            {/* Visual Scan Ping Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-48 h-48 rounded-full border border-red-500/10 flex items-center justify-center transition-all ${isLoading ? 'animate-ping-slow' : ''}`}>
                <div className="w-32 h-32 rounded-full border border-red-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/30" />
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
                className={`${isLoading ? "stroke-red-500" : "stroke-red-500"} transition-all duration-500`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Wheels */}
              <rect x="24" y="22" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              <rect x="70" y="22" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              <rect x="24" y="66" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              <rect x="70" y="66" width="6" height="12" rx="2" className="fill-slate-800 stroke-slate-700" />
              
              {/* Internal Signal Core */}
              <circle cx="50" cy="50" r="4" className={`${isLoading ? "fill-red-500 animate-ping" : "fill-red-500"}`} />
              <line x1="50" y1="30" x2="50" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="2" />
              <line x1="35" y1="50" x2="65" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="2" />

              {/* Dynamic Scanning Laser Bar */}
              {isLoading && (
                <line
                  x1="20"
                  y1={15 + (70 * (progress / 100))}
                  x2="80"
                  y2={15 + (70 * (progress / 100))}
                  stroke="#ef4444"
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
                        ? "bg-black border-red-500/40 shadow-xs"
                        : activeStep > idx || progress === 100
                        ? "bg-black/40 border-red-500/20"
                        : "bg-black/10 border-white/5"
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
              <div className="w-full bg-[#111218] h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-100"
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
