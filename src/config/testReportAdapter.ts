import { TestResults } from '../types';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  data: TestResults;
}

// Cache for loaded scenarios
let cachedScenarios: TestScenario[] | null = null;

// Function to dynamically load all JSON files from config folder
async function loadAllScenarios(): Promise<TestScenario[]> {
  if (cachedScenarios) return cachedScenarios;

  const modules = import.meta.glob('./*.json', { eager: true });
  const scenarios: TestScenario[] = [];

  for (const [path, module] of Object.entries(modules)) {
    const fileName = path.split('/').pop()?.replace('.json', '') || 'unnamed';
    const data = (module as any).testRun || (module as any);
    
    scenarios.push({
      id: fileName,
      name: data.test?.description || fileName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: `${data.test?.type || 'Test'} configuration from ${fileName}.json`,
      data: {
        ...data,
        requestResults: (module as any).requestResults || []
      }
    });
  }

  cachedScenarios = scenarios;
  return scenarios;
}

export const getTestScenario = async (scenarioId: string = 'test-report-data'): Promise<TestScenario> => {
  const scenarios = await loadAllScenarios();
  return scenarios.find(s => s.id === scenarioId) || scenarios[0];
};

export const getAvailableScenarios = async (): Promise<TestScenario[]> => {
  return await loadAllScenarios();
};

// Export the detailed request results for components that might need them
export const getRequestResults = async (scenarioId: string = 'test-report-data') => {
  const scenario = await getTestScenario(scenarioId);
  return scenario.data.requestResults || [];
};
