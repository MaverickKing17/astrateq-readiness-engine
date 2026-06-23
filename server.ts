import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persist leads
const LEADS_FILE = path.join(process.cwd(), "leads.json");

// Helper to read leads
function getLeads(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading leads file, returning empty array:", error);
  }
  return [];
}

// Helper to save leads
function saveLeads(leads: any[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving leads to file:", error);
  }
}

// Lazy initialization of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Get Leads (for Admin Lead Review & Campaign Panel)
app.get("/api/leads", (req, res) => {
  res.json(getLeads());
});

// API: Clear Leads (utility)
app.post("/api/leads/clear", (req, res) => {
  saveLeads([]);
  res.json({ message: "Leads database cleared successfully" });
});

// API: Update Lead Email Status (simulate sending email)
app.post("/api/leads/send-email", (req, res) => {
  const { leadEmail, emailIndex } = req.body;
  const leads = getLeads();
  const leadIdx = leads.findIndex((l) => l.email === leadEmail);
  if (leadIdx !== -1) {
    const lead = leads[leadIdx];
    if (lead.followUpCampaign && lead.followUpCampaign[emailIndex]) {
      lead.followUpCampaign[emailIndex].status = "Sent";
      lead.followUpCampaign[emailIndex].sentAt = new Date().toISOString();
      leads[leadIdx] = lead;
      saveLeads(leads);
      return res.json({ success: true, lead });
    }
  }
  res.status(404).json({ error: "Lead or email index not found" });
});

// API: Perform Vehicle Assessment
app.post("/api/assess", async (req, res) => {
  const {
    vehicleMake,
    vehicleModel,
    vehicleYear,
    summerHeatExposure,
    highwayUsage,
    signalComplexity,
    privacySensitivity,
  } = req.body;

  if (!vehicleMake || !vehicleModel || !vehicleYear) {
    return res.status(400).json({ error: "Make, model, and year are required." });
  }

  const year = parseInt(vehicleYear) || 2020;
  const complexity = parseInt(signalComplexity) || 3;
  const sensitivity = parseInt(privacySensitivity) || 3;

  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `Perform a Vehicle Intelligence and Security Assessment for the following vehicle:
Vehicle: ${year} ${vehicleMake} ${vehicleModel}
Driving Conditions & Inputs:
- Summer Heat Exposure Level: ${summerHeatExposure}
- Highway Usage Level: ${highwayUsage}
- Number of connected devices/gadgets: ${complexity}
- Privacy Sensitivity Index (1-5 level): ${sensitivity}

Consider the following Canadian environmental context:
- Southern Ontario (Greater Toronto Area - GTA) summer conditions, including intense seasonal heatwaves, high humidity, massive construction-related highway congestion, and stop-and-go commuter traffic.
- Astrateq Gadgets specializes in privacy-first, local-only vehicle intelligence, driver awareness, and edge diagnostics.

Evaluate the vehicle across the following areas and return EXACTLY a JSON response adhering to this schema:
{
  "readinessScore": number (0-100),
  "summerDrivingRiskProfile": {
    "riskLevel": string (Low, Moderate, High, Critical),
    "gtaSpecificNotes": string (GTA Ontario summer driving details),
    "thermalExposures": string (Engine/battery heat vulnerabilities)
  },
  "eligibilityClassification": {
    "cohortTier": string (High Readiness, Moderate Readiness, Low Readiness),
    "cohortName": string (Founding Early Allocation, Priority Evaluation Cohort, Standard Validation Queue),
    "perceivedExclusivity": string (Exclusivity positioning/framing),
    "explanation": string (A 2-sentence explanation of why they belong in this tier)
  },
  "signals": {
    "summerHeatExposure": number (0-100),
    "highwayUsagePattern": number (0-100),
    "vehicleSignalComplexity": number (0-100),
    "privacySensitivityIndex": number (0-100),
    "compatibilityConfidence": number (0-100)
  },
  "customRecommendations": string[] (3-4 highly personalized GTA-specific summer recommendations)
}

Ensure the response contains ONLY the valid JSON object. Do not wrap in markdown block, just return raw JSON string.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "";
      const result = JSON.parse(responseText.trim());
      return res.json(result);
    } catch (apiError) {
      console.error("Gemini API call failed, using rule-based assessment generator:", apiError);
      // Fallback to high-quality local generator
    }
  }

  // --- LOCAL RULE-BASED GENERATOR (Fallback & Development) ---
  // Calculates realistic scores based on vehicle metadata and inputs
  let readinessScore = 75;
  if (year < 2005) readinessScore = 45; // obd1, sparse sensors
  else if (year < 2015) readinessScore = 65; // standard obd2, low telemetry
  else if (year > 2022) readinessScore = 88; // modern digital, complex telemetry

  // Adjust score slightly based on complexity
  readinessScore += (complexity - 3) * 3;
  if (readinessScore > 100) readinessScore = 100;
  if (readinessScore < 15) readinessScore = 15;

  let cohortTier = "Moderate Readiness";
  let cohortName = "Priority Evaluation Cohort";
  let exclusivity = "Next 50% of validated drivers in Southern Ontario. Offers premium priority evaluation queues.";
  let explanation = `With your ${year} ${vehicleMake} ${vehicleModel}'s OBD-II architecture, your vehicle is highly responsive to edge intelligence overlays. You qualify for our Priority Evaluation Cohort.`;

  if (readinessScore >= 85) {
    cohortTier = "High Readiness";
    cohortName = "Founding Early Allocation";
    exclusivity = "Top 20% of eligible drivers in Ontario. Limited founding slots remaining for local-only diagnostic hardware.";
    explanation = `Your modern ${year} ${vehicleMake} digital logs provide an optimal environment for instant local-first edge integration. We have reserved an Early Allocation for you.`;
  } else if (readinessScore < 60) {
    cohortTier = "Low Readiness";
    cohortName = "Standard Validation Queue";
    exclusivity = "Standard validation queue. Standard verification speeds and custom validation hardware queues.";
    explanation = `Your ${year} ${vehicleMake} requires custom wiring parameters or older OBD-II firmware protocols. You have been placed in our Standard Validation Queue.`;
  }

  // GTA risk
  let riskLevel = "Moderate";
  if (summerHeatExposure === "High" || highwayUsage === "Heavy") riskLevel = "High";
  if (summerHeatExposure === "High" && highwayUsage === "Heavy") riskLevel = "Critical";

  const result = {
    readinessScore,
    summerDrivingRiskProfile: {
      riskLevel,
      gtaSpecificNotes: `Southern Ontario summers feature extreme relative humidity and temperature swings. On routes like the DVP, QEW, or Highway 401, stop-and-go gridlock combined with ${summerHeatExposure.toLowerCase()} ambient exposure places heavy mechanical loads on your ${vehicleMake}'s digital monitoring modules.`,
      thermalExposures: `Under-hood temperatures rise significantly during bumper-to-bumper GTA commuter queues. Edge diagnostics monitors battery voltages and thermal load variables to prevent breakdown before ignition failure.`,
    },
    eligibilityClassification: {
      cohortTier,
      cohortName,
      perceivedExclusivity: exclusivity,
      explanation,
    },
    signals: {
      summerHeatExposure: summerHeatExposure === "High" ? 88 : summerHeatExposure === "Medium" ? 55 : 25,
      highwayUsagePattern: highwayUsage === "Heavy" ? 90 : highwayUsage === "Moderate" ? 60 : 30,
      vehicleSignalComplexity: complexity * 20,
      privacySensitivityIndex: sensitivity * 20,
      compatibilityConfidence: readinessScore,
    },
    customRecommendations: [
      `Monitor real-time engine intake temperatures during peak Highway 401 bumper-to-bumper construction delays.`,
      `Configure local-first notifications to trigger voltage dip alerts before stop-start commuter cycles strain your alternator.`,
      `Shield cabin and OBD-II telemetry signals from cloud-bound commercial data scraping during active urban driving.`,
      `Schedule a secondary thermal sensor calibration if cabin ambient heat cycles regularly exceed 32°C.`,
    ],
  };

  res.json(result);
});

// API: Capture lead + Generate Personalized Automated Follow-up Campaigns
app.post("/api/reserve", async (req, res) => {
  const {
    name,
    email,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    assessment,
  } = req.body;

  if (!email || !name || !assessment) {
    return res.status(400).json({ error: "Name, email, and assessment result are required." });
  }

  const client = getGeminiClient();
  let campaign = [];

  const tier = assessment.eligibilityClassification.cohortTier;
  const cohort = assessment.eligibilityClassification.cohortName;
  const score = assessment.readinessScore;

  if (client) {
    try {
      const emailPrompt = `Create an automated 3-part pre-launch email follow-up sequence for this cohort candidate:
Name: ${name}
Email: ${email}
Vehicle: ${vehicleYear} ${vehicleMake} ${vehicleModel}
Readiness Score: ${score}
Cohort Tier: ${tier} (${cohort})

The brand is "Astrateq Gadgets" (Tagline: Drive Safer. Drive Smarter.). The core positioning is privacy-first, local-only vehicle intelligence, driver awareness, and edge diagnostics. The tone must be Canadian trust-first, highly professional, warm, intellectual, and exclusivity-framed (similar to Apple or Stripe marketing).

Generate three distinct emails:
1. "Welcome & Custom Vehicle Summer Analysis" (Sent immediately) - Confirm reservation, mention their GTA summer driving risk and vehicle readiness.
2. "Privacy & Local Edge Intelligence Deep Dive" (Scheduled for Day 2) - Explain how Astrateq protects their vehicle's electronic signals from telemetry harvesting and cloud-bound data trackers.
3. "Founding Cohort Activation & Launch Pass" (Scheduled for Day 5) - Exclusivity-focused final onboarding invitation with zero-payment reservation, reinforcing why they belong in their designated tier.

Return EXACTLY a JSON array of 3 objects, each with these properties:
{
  "subject": "Email Subject Line",
  "body": "HTML or Markdown body of the email with paragraphs and professional spacing",
  "delayDays": number,
  "status": "Sent" (for the first email) or "Scheduled" (for others)
}

Ensure the response contains ONLY the valid JSON array. Do not wrap in markdown block.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: emailPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "";
      campaign = JSON.parse(responseText.trim());
    } catch (apiError) {
      console.error("Gemini Email Campaign generation failed, using fallback campaigns:", apiError);
    }
  }

  // Fallback follow-up campaign if Gemini is offline or not configured
  if (!campaign || campaign.length === 0) {
    campaign = [
      {
        subject: `[Astrateq Gadgets] Founding Cohort Reserved: Your ${vehicleYear} ${vehicleMake} Status`,
        body: `<p>Bonjour ${name},</p>
               <p>Welcome to <strong>Astrateq Gadgets</strong>. Your founding cohort spot in the <strong>${cohort}</strong> is officially reserved. Your vehicle readiness score scored at a strong <strong>${score}/100</strong>.</p>
               <p>In Southern Ontario's extreme summers, bumper-to-bumper commuter delays on the DVP or Highway 401 place heavy strain on battery voltages and ignition systems. Astrateq Gadgets operates as local-only, privacy-first intelligence overlays that monitor these diagnostic logs offline—with absolutely no data resale.</p>
               <p>We are finalizing hardware production queues in Toronto. No payment is required to validate your cohort spot today.</p>
               <p>Drive Safer. Drive Smarter.<br><strong>The Astrateq Canada Team</strong></p>`,
        delayDays: 0,
        status: "Sent",
        sentAt: new Date().toISOString(),
      },
      {
        subject: `Technical Briefing: Securing Your ${vehicleMake}'s Signal Privacy on Ontario Highways`,
        body: `<p>Hello ${name},</p>
               <p>Did you know modern digital cars broadcast hundreds of diagnostic variables every second? Most of this data is silently collected, monetized, and transmitted to global cloud servers—raising insurance rates and privacy concerns.</p>
               <p>At <strong>Astrateq Gadgets</strong>, we build hardware on a local-first architecture. All diagnostic analysis, thermal sensors, and driver awareness algorithms execute directly on-device in your ${vehicleModel}. Zero cellular uploads. Zero commercial cloud relays.</p>
               <p>Your ${tier} classification unlocks early hardware firmware downloads when our private beta begins.</p>
               <p>Best regards,<br><strong>Astrateq Engineering (Toronto, ON)</strong></p>`,
        delayDays: 2,
        status: "Scheduled",
      },
      {
        subject: `Unlock Founding Driver Access: Final Onboarding Confirmation`,
        body: `<p>Hi ${name},</p>
               <p>We are preparing to dispatch our first batch of pre-launch developer diagnostic units in the Greater Toronto Area. Because you are in the <strong>${cohort}</strong>, you have high priority access.</p>
               <p>Your vehicle compatibility with our edge sensor array is certified. To confirm your launch sequence and opt-in to early-bird hardware pricing with absolute zero obligation, please keep this email thread active.</p>
               <p>Secure your spot in automotive intelligence today.</p>
               <p>Warmly,<br><strong>Astrateq Onboarding Desk</strong></p>`,
        delayDays: 5,
        status: "Scheduled",
      },
    ];
  } else {
    // Add sent timestamp for the first email which is "Sent" immediately
    if (campaign[0]) {
      campaign[0].status = "Sent";
      campaign[0].sentAt = new Date().toISOString();
    }
  }

  const newLead = {
    name,
    email,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    readinessScore: score,
    cohortTier: tier,
    cohortName: cohort,
    createdAt: new Date().toISOString(),
    followUpCampaign: campaign,
  };

  const leads = getLeads();
  // Avoid duplicate emails for clean testing
  const existingIdx = leads.findIndex((l) => l.email.toLowerCase() === email.toLowerCase());
  if (existingIdx !== -1) {
    leads[existingIdx] = newLead;
  } else {
    leads.push(newLead);
  }

  saveLeads(leads);

  res.json({
    success: true,
    message: "Cohort reservation secured successfully.",
    lead: newLead,
  });
});

// Serve static assets and bundle in production, or mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Astrateq Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();
