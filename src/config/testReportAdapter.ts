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

  console.log('Loading test scenarios...');
  
  try {
    const modules = import.meta.glob('./*.json', { eager: true });
    console.log(`Found ${Object.keys(modules).length} JSON files in config directory`);
    
    const scenarios: TestScenario[] = [];

    for (const [path, module] of Object.entries(modules)) {
      try {
        console.log(`Processing file: ${path}`);
        const fileName = path.split('/').pop()?.replace('.json', '') || 'unnamed';
        const data = (module as any).testRun || (module as any);
        
        if (!data) {
          console.warn(`No data found in ${path}`);
          continue;
        }
        
        console.log(`Creating scenario from ${fileName} with data:`, data);
        
        const scenario: TestScenario = {
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
        };
        
        scenarios.push(scenario);
        console.log(`Added scenario: ${scenario.name} (${scenario.id})`);
      } catch (error) {
        console.error(`Error processing file ${path}:`, error);
      }
    }

    console.log(`Successfully loaded ${scenarios.length} scenarios`);
    cachedScenarios = scenarios;
    return scenarios;
  } catch (error) {
    console.error('Error loading scenarios:', error);
    throw error;
  }
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
