import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetadataTab from './MetadataTab';
import { TestResults } from '../../types';

const mockTestData: TestResults = {
  id: 1,
  status: 'PASSED',
  startTime: '2024-01-15T10:00:00Z',
  duration: 300,
  totalRequests: 1000,
  rate: 200,
  errorRate: 0.02,
  responseTimes: {
    min: 50,
    max: 2000,
    percentiles: {
      '50.0': 150,
      '75.0': 250,
      '90.0': 400,
      '95.0': 600,
      '99.0': 1200
    }
  },
  requestStats: {
    total: 1000,
    passed: 980,
    failed: 20,
    unavailable: 0
  },
  assertionStats: {
    total: 1000,
    passed: 950,
    failed: 50,
    unavailable: 0
  },
  severityStats: {
    blocker: 0,
    critical: 2,
    major: 5,
    minor: 10,
    none: 0
  },
  test: {
    id: 1,
    type: 'Load Test',
    description: 'Peak Hour Load Test',
    simulationName: 'PeakHourSimulation'
  },
  gatlingVersion: '3.9.0',
  parserVersion: '1.0.0',
  severityVersion: '1.0.0',
  requirementsVersion: '1.0.0',
  gatlingReportLocation: '/path/to/report',
  gatlingLogLocation: '/path/to/log',
  requirementsFileLocation: '/path/to/requirements',
  environment: 'production',
  branch: 'main',
  gitHash: 'abc123def456',
  testRequirements: true,
  rateGranularity: 'second',
  createdTime: '2024-01-15T10:00:00Z',
  requestResults: []
};

describe('MetadataTab', () => {
  it('renders the test metadata title', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Test Metadata' })).toBeInTheDocument();
  });

  it('renders Test Information section', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Test Information' })).toBeInTheDocument();
  });

  it('displays test type correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Test Type:')).toBeInTheDocument();
    expect(screen.getByText('Load Test')).toBeInTheDocument();
  });

  it('displays simulation name correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Simulation:')).toBeInTheDocument();
    expect(screen.getByText('PeakHourSimulation')).toBeInTheDocument();
  });

  it('displays environment correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Environment:')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
  });

  it('displays branch correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Branch:')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('renders Version Information section', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Version Information' })).toBeInTheDocument();
  });

  it('displays all version information correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Gatling Version:')).toBeInTheDocument();
    expect(screen.getByText('3.9.0')).toBeInTheDocument();
    
    expect(screen.getByText('Parser Version:')).toBeInTheDocument();
    const versionSection = screen.getByRole('heading', { name: 'Version Information' }).closest('.p-6');
    expect(versionSection).toHaveTextContent('1.0.0');
    
    expect(screen.getByText('Severity Version:')).toBeInTheDocument();
    expect(screen.getByText('Requirements Version:')).toBeInTheDocument();
  });

  it('renders File Locations section', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'File Locations' })).toBeInTheDocument();
  });

  it('displays file locations correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Gatling Report:')).toBeInTheDocument();
    expect(screen.getByText('/path/to/report')).toBeInTheDocument();
    
    expect(screen.getByText('Gatling Log:')).toBeInTheDocument();
    expect(screen.getByText('/path/to/log')).toBeInTheDocument();
    
    expect(screen.getByText('Requirements File:')).toBeInTheDocument();
    expect(screen.getByText('/path/to/requirements')).toBeInTheDocument();
  });

  it('renders Git Information section', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Git Information' })).toBeInTheDocument();
  });

  it('displays git hash correctly (truncated)', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Git Hash:')).toBeInTheDocument();
    expect(screen.getByText('abc123de')).toBeInTheDocument();
  });

  it('displays test requirements status correctly when enabled', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Test Requirements:')).toBeInTheDocument();
    const enabledText = screen.getByText('Enabled');
    expect(enabledText).toBeInTheDocument();
    expect(enabledText).toHaveClass('text-green-400');
  });

  it('displays test requirements status correctly when disabled', () => {
    const disabledTestData = {
      ...mockTestData,
      testRequirements: false
    };

    render(<MetadataTab testData={disabledTestData} />);
    
    const disabledText = screen.getByText('Disabled');
    expect(disabledText).toBeInTheDocument();
    expect(disabledText).toHaveClass('text-red-400');
  });

  it('renders Test Configuration section', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Test Configuration' })).toBeInTheDocument();
  });

  it('displays rate granularity correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Rate Granularity:')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('displays created time correctly', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    expect(screen.getByText('Created:')).toBeInTheDocument();
    // The exact format depends on locale, but should contain time elements
    expect(screen.getByText(/AM|PM/)).toBeInTheDocument();
  });

  it('handles missing environment gracefully', () => {
    const testDataWithoutEnv = {
      ...mockTestData,
      environment: null
    };

    render(<MetadataTab testData={testDataWithoutEnv} />);
    
    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('handles missing branch gracefully', () => {
    const testDataWithoutBranch = {
      ...mockTestData,
      branch: null
    };

    render(<MetadataTab testData={testDataWithoutBranch} />);
    
    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('handles missing git hash gracefully', () => {
    const testDataWithoutGitHash = {
      ...mockTestData,
      gitHash: null
    };

    render(<MetadataTab testData={testDataWithoutGitHash} />);
    
    expect(screen.getByText('Git Hash:')).toBeInTheDocument();
    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    const gridContainer = screen.getByRole('heading', { name: 'Test Metadata' }).nextElementSibling;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'gap-6', 'lg:grid-cols-2');
  });

  it('applies correct CSS classes for file locations section', () => {
    render(<MetadataTab testData={mockTestData} />);
    
    const fileLocationsSection = screen.getByRole('heading', { name: 'File Locations' }).closest('.p-6');
    expect(fileLocationsSection).toHaveClass('lg:col-span-2');
  });

  it('formats different date correctly', () => {
    const customTestData = {
      ...mockTestData,
      createdTime: '2023-12-25T15:30:00Z'
    };

    render(<MetadataTab testData={customTestData} />);
    
    expect(screen.getByText('Created:')).toBeInTheDocument();
    // Should format the date and time
    expect(screen.getByText(/3:30|15:30/)).toBeInTheDocument();
  });

  it('displays different version numbers correctly', () => {
    const customTestData = {
      ...mockTestData,
      gatlingVersion: '4.0.0',
      parserVersion: '2.1.0',
      severityVersion: '1.5.0',
      requirementsVersion: '3.0.0'
    };

    render(<MetadataTab testData={customTestData} />);
    
    expect(screen.getByText('4.0.0')).toBeInTheDocument();
    expect(screen.getByText('2.1.0')).toBeInTheDocument();
    expect(screen.getByText('1.5.0')).toBeInTheDocument();
    expect(screen.getByText('3.0.0')).toBeInTheDocument();
  });
});
