export interface RequestResult {
  id: number;
  request: {
    id: number;
    requestName: string;
    requestDescription: string | null;
    requestPriority: string | null;
    tags: string | null;
    createdTime: string;
  };
  severity: string;
  totalCount: number;
  passCount: number;
  failCount: number;
  errorPercentage: number;
  rate: number;
  rateGranularity: string;
  responseTimes: {
    min: number;
    max: number;
    percentiles: {
      [key: string]: number;
    };
  };
  status: string;
  testRequirements: boolean;
  statistics: boolean;
  requirements: {
    status: string;
    passed: number;
    failed: number;
    percentiles: Array<{
      status: string;
      percentile: number;
      value: number;
      difference: number;
      percentageDifference: number;
    }>;
  };
}

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
  requestResults: RequestResult[];
}
