export interface Request {
  id: number;
  requestName: string;
  requestDescription: string | null;
  requestPriority: string | null;
  tags: string | null;
  createdTime: string;
  // Add other request properties as needed
}

export interface ResponseTimes {
  min: number;
  max: number;
  percentiles: Record<string, number>;
  // Add other response time properties as needed
}

export interface RequestResult {
  id?: number;
  status?: string;
  severity?: string;
  request: Request;
  responseTimes?: ResponseTimes;
  totalCount?: number;
  errorPercentage?: number | string;
  passCount?: number;
  failCount?: number;
  requirements?: {
    passed: number;
    failed: number;
  };
  // Add other result properties as needed
}

export interface TestResults {
  requestResults: RequestResult[];
  testRequirements?: boolean;
  severityVersion?: string;
  // Add other test result properties as needed
}
