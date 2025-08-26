import type { Meta, StoryObj } from '@storybook/react';
import Requirements from './Requirements';
import { ThemeProvider, ThemeContext } from '../../contexts/ThemeContext';

const meta: Meta<typeof Requirements> = {
  title: 'Components/Requirements',
  component: Requirements,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Requirements>;

// Base story with both passed and failed requirements
export const Default: Story = {
  args: {
    requirements: {
      passed: 8,
      failed: 2,
      percentiles: [
        { percentile: 50, value: 200, status: 'PASS', difference: -20 },
        { percentile: 90, value: 500, status: 'FAIL', difference: 50 },
        { percentile: 95, value: 800, status: 'FAIL', difference: 150 }
      ]
    },
    resultId: 'story-1'
  },
};

// Story with only passed requirements
export const AllPassed: Story = {
  args: {
    requirements: {
      passed: 10,
      failed: 0,
      percentiles: [
        { percentile: 50, value: 180, status: 'PASS', difference: -40 },
        { percentile: 90, value: 450, status: 'PASS', difference: -50 },
        { percentile: 95, value: 650, status: 'PASS', difference: -100 }
      ]
    },
    resultId: 'story-2'
  },
};

// Story with only failed requirements
export const AllFailed: Story = {
  args: {
    requirements: {
      passed: 0,
      failed: 10,
      percentiles: [
        { percentile: 50, value: 250, status: 'FAIL', difference: 30 },
        { percentile: 90, value: 550, status: 'FAIL', difference: 100 },
        { percentile: 95, value: 950, status: 'FAIL', difference: 200 }
      ]
    },
    resultId: 'story-3'
  },
};

// Story without percentile data
export const NoPercentiles: Story = {
  args: {
    requirements: {
      passed: 5,
      failed: 3
    },
    resultId: 'story-4'
  },
};

// Story with null difference values
export const NullDifferences: Story = {
  args: {
    requirements: {
      passed: 7,
      failed: 3,
      percentiles: [
        { percentile: 50, value: 200, status: 'PASS', difference: null },
        { percentile: 90, value: 500, status: 'FAIL', difference: null }
      ]
    },
    resultId: 'story-5'
  },
};

// Dark mode story
export const DarkMode: Story = {
  args: {
    requirements: {
      passed: 8,
      failed: 2,
      percentiles: [
        { percentile: 50, value: 200, status: 'PASS', difference: -20 },
        { percentile: 90, value: 500, status: 'FAIL', difference: 50 }
      ]
    },
    resultId: 'story-6'
  },
  decorators: [
    (Story) => {
      // Create a mock theme context value for dark mode
      const darkThemeValue = {
        theme: 'dark' as 'dark', // Type assertion to match Theme type
        toggleTheme: () => {},
        setTheme: () => {}
      };
      
      return (
        <div style={{ width: '400px', background: '#1e293b', padding: '20px' }}>
          <ThemeContext.Provider value={darkThemeValue}>
            <Story />
          </ThemeContext.Provider>
        </div>
      );
    },
  ],
};

// Story with many percentiles
export const ManyPercentiles: Story = {
  args: {
    requirements: {
      passed: 12,
      failed: 8,
      percentiles: [
        { percentile: 10, value: 50, status: 'PASS', difference: -10 },
        { percentile: 25, value: 100, status: 'PASS', difference: -15 },
        { percentile: 50, value: 200, status: 'PASS', difference: -20 },
        { percentile: 75, value: 350, status: 'PASS', difference: -25 },
        { percentile: 90, value: 500, status: 'FAIL', difference: 50 },
        { percentile: 95, value: 800, status: 'FAIL', difference: 150 },
        { percentile: 99, value: 1200, status: 'FAIL', difference: 300 }
      ]
    },
    resultId: 'story-7'
  },
};
