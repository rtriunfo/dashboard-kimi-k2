export const getTestScenario = jest.fn();
export const getAvailableScenarios = jest.fn();

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  data: any;
}
