export interface DrivingConditions {
  summerHeatExposure: "Low" | "Medium" | "High";
  highwayUsage: "Low" | "Moderate" | "Heavy";
  signalComplexity: number; // 1 to 8+
  privacySensitivity: number; // 1 to 5
}

export interface AssessmentResult {
  readinessScore: number;
  summerDrivingRiskProfile: {
    riskLevel: "Low" | "Moderate" | "High" | "Critical";
    gtaSpecificNotes: string;
    thermalExposures: string;
  };
  eligibilityClassification: {
    cohortTier: string; // "High Readiness" | "Moderate Readiness" | "Low Readiness"
    cohortName: string; // e.g. "Founding Early Allocation"
    perceivedExclusivity: string;
    explanation: string;
  };
  signals: {
    summerHeatExposure: number;
    highwayUsagePattern: number;
    vehicleSignalComplexity: number;
    privacySensitivityIndex: number;
    compatibilityConfidence: number;
  };
  customRecommendations: string[];
}

export interface EmailCampaignItem {
  subject: string;
  body: string;
  delayDays: number;
  status: "Sent" | "Scheduled";
  sentAt?: string;
}

export interface Lead {
  name: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  readinessScore: number;
  cohortTier: string;
  cohortName: string;
  createdAt: string;
  followUpCampaign: EmailCampaignItem[];
}
