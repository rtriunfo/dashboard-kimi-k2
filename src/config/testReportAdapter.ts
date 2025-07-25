import { TestResults } from '../types';
import testReportData from './testReport.json';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  data: TestResults;
}

// Convert the testReport.json data structure to match the expected TestScenario format
const reportData = testReportData as any;

export const testScenarios: Record<string, TestScenario> = {
  'test-report-data': {
    id: 'test-report-data',
    name: reportData.testRun.test.description,
    description: `${reportData.testRun.test.type} test with detailed transaction data`,
    data: {
      ...reportData.testRun,
      requestResults: reportData.requestResults
    }
  }
};

export const getTestScenario = (scenarioId: string = 'test-report-data'): TestScenario => {
  return testScenarios[scenarioId] || testScenarios['test-report-data'];
};

export const getAvailableScenarios = (): TestScenario[] => {
  return Object.values(testScenarios);
};

// Export the detailed request results for components that might need them
export const getRequestResults = () => {
  return reportData.requestResults;
};
