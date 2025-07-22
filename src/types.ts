export interface TestResults {
  id: number;
  test: {
    id: number;
    description: string;
    type: string;
    simulationName: string;
  };
  status: string;
  startTime: string;
  duration: number;
  branch: string | null;
  gatlingVersion: string;
  parserVersion: string;
  environment: string | null;
  gitHash: string | null;
  totalRequests: number;
  errorRate: number;
  rate: number;
  rateGranularity: string;
  responseTimes: {
    min: number;
    max: number;
    percentiles: {
      [key: string]: number;
    };
  };
  requestStats: {
    total: number;
    passed: number;
    failed: number;
    unavailable: number;
  };
  assertionStats: {
    total: number;
    passed: number;
    failed: number;
    unavailable: number;
  };
  severityStats: {
    blocker: number;
    critical: number;
    major: number;
    minor: number;
    none: number;
  };
  gatlingReportLocation: string;
  gatlingLogLocation: string;
  testRequirements: boolean;
  requirementsFileLocation: string;
  createdTime: string;
  severityVersion: string;
  requirementsVersion: string;
}
