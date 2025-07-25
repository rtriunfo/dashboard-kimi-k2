import { TestResults } from '../types';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  data: TestResults;
}

export const testScenarios: Record<string, TestScenario> = {
  'peak-hour-load': {
    id: 'peak-hour-load',
    name: 'Peak Hour Load Test',
    description: 'High traffic load test during peak hours',
    data: {
      id: 1,
      test: {
        id: 1,
        description: "Peak Hour Load Test",
        type: "LOAD",
        simulationName: "underwriteme.teamA.simulation.loadtest"
      },
      status: "FAIL",
      startTime: "2022-04-01T13:36:40.447+00:00",
      duration: 4201,
      branch: null,
      gatlingVersion: "3.7.3",
      parserVersion: "3.6.1",
      environment: null,
      gitHash: null,
      totalRequests: 309623,
      errorRate: 0.013887857168233625,
      rate: 4422.132825517734,
      rateGranularity: "PER_MINUTE",
      responseTimes: {
        min: 3,
        max: 7977,
        percentiles: {
          "50.0": 30,
          "90.0": 582,
          "95.0": 783,
          "99.0": 1460,
          "99.9": 2690,
          "100.0": 7977
        }
      },
      requestStats: {
        total: 75,
        passed: 54,
        failed: 20,
        unavailable: 1
      },
      assertionStats: {
        total: 225,
        passed: 197,
        failed: 25,
        unavailable: 3
      },
      severityStats: {
        blocker: 0,
        critical: 0,
        major: 4,
        minor: 36,
        none: 110
      },
      gatlingReportLocation: "1/1/2025071819215992a7b91225/GATLING_REPORT",
      gatlingLogLocation: "1/1/2025071819215992a7b91225/GATLING_LOG/simulation-V373-01042022.log.gz",
      testRequirements: true,
      requirementsFileLocation: "1/1/2025071819215992a7b91225/REQUIREMENTS/requirementsV1_AllPassing.csv",
      createdTime: "2025-07-18T18:21:59.826+00:00",
      severityVersion: "V2",
      requirementsVersion: "V1"
    }
  },

  'stress-test': {
    id: 'stress-test',
    name: 'Stress Test',
    description: 'High-intensity stress test with extreme load',
    data: {
      id: 2,
      test: {
        id: 2,
        description: "Extreme Stress Test",
        type: "STRESS",
        simulationName: "underwriteme.teamA.simulation.stresstest"
      },
      status: "FAIL",
      startTime: "2022-04-02T09:15:30.123+00:00",
      duration: 7200,
      branch: "feature/stress-testing",
      gatlingVersion: "3.7.3",
      parserVersion: "3.6.1",
      environment: "staging",
      gitHash: "a1b2c3d4e5f6",
      totalRequests: 850000,
      errorRate: 0.045,
      rate: 7083.33,
      rateGranularity: "PER_MINUTE",
      responseTimes: {
        min: 5,
        max: 15000,
        percentiles: {
          "50.0": 120,
          "90.0": 2500,
          "95.0": 4200,
          "99.0": 8500,
          "99.9": 12000,
          "100.0": 15000
        }
      },
      requestStats: {
        total: 120,
        passed: 68,
        failed: 48,
        unavailable: 4
      },
      assertionStats: {
        total: 360,
        passed: 204,
        failed: 144,
        unavailable: 12
      },
      severityStats: {
        blocker: 8,
        critical: 15,
        major: 25,
        minor: 42,
        none: 30
      },
      gatlingReportLocation: "2/2/2025071820123456b7c91225/GATLING_REPORT",
      gatlingLogLocation: "2/2/2025071820123456b7c91225/GATLING_LOG/simulation-V373-02042022.log.gz",
      testRequirements: true,
      requirementsFileLocation: "2/2/2025071820123456b7c91225/REQUIREMENTS/requirementsV1_StressTest.csv",
      createdTime: "2025-07-18T20:12:34.567+00:00",
      severityVersion: "V2",
      requirementsVersion: "V1"
    }
  },

    'stress-test2': {
    id: 'stress-test-2',
    name: 'Stress Test 2',
    description: 'High-intensity stress test with extreme load',
    data: {
      id: 5,
      test: {
        id: 2,
        description: "Extreme Stress Test",
        type: "STRESS",
        simulationName: "underwriteme.teamA.simulation.stresstest"
      },
      status: "FAIL",
      startTime: "2022-04-02T09:15:30.123+00:00",
      duration: 7200,
      branch: "feature/stress-testing",
      gatlingVersion: "3.7.3",
      parserVersion: "3.6.1",
      environment: "staging",
      gitHash: "a1b2c3d4e5f6",
      totalRequests: 850000,
      errorRate: 0.045,
      rate: 7083.33,
      rateGranularity: "PER_MINUTE",
      responseTimes: {
        min: 5,
        max: 15000,
        percentiles: {
          "50.0": 120,
          "90.0": 2500,
          "95.0": 4200,
          "99.0": 8500,
          "99.9": 12000,
          "100.0": 15000
        }
      },
      requestStats: {
        total: 120,
        passed: 68,
        failed: 48,
        unavailable: 4
      },
      assertionStats: {
        total: 360,
        passed: 204,
        failed: 144,
        unavailable: 12
      },
      severityStats: {
        blocker: 8,
        critical: 15,
        major: 25,
        minor: 42,
        none: 30
      },
      gatlingReportLocation: "2/2/2025071820123456b7c91225/GATLING_REPORT",
      gatlingLogLocation: "2/2/2025071820123456b7c91225/GATLING_LOG/simulation-V373-02042022.log.gz",
      testRequirements: true,
      requirementsFileLocation: "2/2/2025071820123456b7c91225/REQUIREMENTS/requirementsV1_StressTest.csv",
      createdTime: "2025-07-18T20:12:34.567+00:00",
      severityVersion: "V2",
      requirementsVersion: "V1"
    }
  },

  'baseline-performance': {
    id: 'baseline-performance',
    name: 'Baseline Performance',
    description: 'Normal load baseline performance test',
    data: {
      id: 3,
      test: {
        id: 3,
        description: "Baseline Performance Test",
        type: "BASELINE",
        simulationName: "underwriteme.teamA.simulation.baseline"
      },
      status: "PASS",
      startTime: "2022-04-03T14:20:15.789+00:00",
      duration: 1800,
      branch: "main",
      gatlingVersion: "3.7.3",
      parserVersion: "3.6.1",
      environment: "production",
      gitHash: "f1e2d3c4b5a6",
      totalRequests: 54000,
      errorRate: 0.002,
      rate: 1800,
      rateGranularity: "PER_MINUTE",
      responseTimes: {
        min: 2,
        max: 1200,
        percentiles: {
          "50.0": 15,
          "90.0": 85,
          "95.0": 150,
          "99.0": 350,
          "99.9": 800,
          "100.0": 1200
        }
      },
      requestStats: {
        total: 45,
        passed: 44,
        failed: 1,
        unavailable: 0
      },
      assertionStats: {
        total: 135,
        passed: 132,
        failed: 3,
        unavailable: 0
      },
      severityStats: {
        blocker: 0,
        critical: 0,
        major: 0,
        minor: 3,
        none: 132
      },
      gatlingReportLocation: "3/3/2025071821456789c8d91225/GATLING_REPORT",
      gatlingLogLocation: "3/3/2025071821456789c8d91225/GATLING_LOG/simulation-V373-03042022.log.gz",
      testRequirements: true,
      requirementsFileLocation: "3/3/2025071821456789c8d91225/REQUIREMENTS/requirementsV1_Baseline.csv",
      createdTime: "2025-07-18T21:45:67.890+00:00",
      severityVersion: "V2",
      requirementsVersion: "V1"
    }
  },

  'baseline-performance': {
    id: 'baseline-performance',
    name: 'Baseline Performance',
    description: 'Normal load baseline performance test',
    data: {
      id: 3,
      test: {
        id: 3,
        description: "Baseline Performance Test",
        type: "BASELINE",
        simulationName: "underwriteme.teamA.simulation.baseline"
      },
      status: "PASS",
      startTime: "2022-04-03T14:20:15.789+00:00",
      duration: 1800,
      branch: "main",
      gatlingVersion: "3.7.3",
      parserVersion: "3.6.1",
      environment: "production",
      gitHash: "f1e2d3c4b5a6",
      totalRequests: 54000,
      errorRate: 0.002,
      rate: 1800,
      rateGranularity: "PER_MINUTE",
      responseTimes: {
        min: 2,
        max: 1200,
        percentiles: {
          "50.0": 15,
          "90.0": 85,
          "95.0": 150,
          "99.0": 350,
          "99.9": 800,
          "100.0": 1200
        }
      },
      requestStats: {
        total: 45,
        passed: 44,
        failed: 1,
        unavailable: 0
      },
      assertionStats: {
        total: 135,
        passed: 132,
        failed: 3,
        unavailable: 0
      },
      severityStats: {
        blocker: 0,
        critical: 0,
        major: 0,
        minor: 3,
        none: 132
      },
      gatlingReportLocation: "3/3/2025071821456789c8d91225/GATLING_REPORT",
      gatlingLogLocation: "3/3/2025071821456789c8d91225/GATLING_LOG/simulation-V373-03042022.log.gz",
      testRequirements: true,
      requirementsFileLocation: "3/3/2025071821456789c8d91225/REQUIREMENTS/requirementsV1_Baseline.csv",
      createdTime: "2025-07-18T21:45:67.890+00:00",
      severityVersion: "V2",
      requirementsVersion: "V1"
    }
  },

  'spike-test': {
    id: 'spike-test',
    name: 'Spike Test',
    description: 'Sudden traffic spike simulation',
    data: {
      id: 4,
      test: {
        id: 4,
        description: "Traffic Spike Test",
        type: "SPIKE",
        simulationName: "underwriteme.teamA.simulation.spiketest"
      },
      status: "WARN",
      startTime: "2022-04-04T16:45:22.456+00:00",
      duration: 900,
      branch: "feature/spike-handling",
      gatlingVersion: "3.7.3",
      parserVersion: "3.6.1",
      environment: "staging",
      gitHash: "9z8y7x6w5v4u",
      totalRequests: 125000,
      errorRate: 0.018,
      rate: 8333.33,
      rateGranularity: "PER_MINUTE",
      responseTimes: {
        min: 1,
        max: 5500,
        percentiles: {
          "50.0": 45,
          "90.0": 850,
          "95.0": 1400,
          "99.0": 2800,
          "99.9": 4200,
          "100.0": 5500
        }
      },
      requestStats: {
        total: 60,
        passed: 49,
        failed: 10,
        unavailable: 1
      },
      assertionStats: {
        total: 180,
        passed: 147,
        failed: 30,
        unavailable: 3
      },
      severityStats: {
        blocker: 1,
        critical: 2,
        major: 7,
        minor: 20,
        none: 150
      },
      gatlingReportLocation: "4/4/2025071822789012d9e91225/GATLING_REPORT",
      gatlingLogLocation: "4/4/2025071822789012d9e91225/GATLING_LOG/simulation-V373-04042022.log.gz",
      testRequirements: true,
      requirementsFileLocation: "4/4/2025071822789012d9e91225/REQUIREMENTS/requirementsV1_SpikeTest.csv",
      createdTime: "2025-07-18T22:78:90.123+00:00",
      severityVersion: "V2",
      requirementsVersion: "V1"
    }
  }
};

export const getTestScenario = (scenarioId: string = 'baseline-performance'): TestScenario => {
  return testScenarios[scenarioId] || testScenarios['baseline-performance'];
};

export const getAvailableScenarios = (): TestScenario[] => {
  return Object.values(testScenarios);
};