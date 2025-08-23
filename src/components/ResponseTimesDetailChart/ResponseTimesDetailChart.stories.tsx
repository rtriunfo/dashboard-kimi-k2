import type { Meta, StoryObj } from '@storybook/react';
import ResponseTimesDetailChart from './ResponseTimesDetailChart';

const meta: Meta<typeof ResponseTimesDetailChart> = {
  title: 'Components/ResponseTimesDetailChart',
  component: ResponseTimesDetailChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive chart component for visualizing response time percentiles with both bar and line chart views.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    responseTimes: {
      description: 'Response time data including min, max, and percentiles',
      control: { type: 'object' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with typical response time data
export const Default: Story = {
  args: {
    responseTimes: {
      min: 45,
      max: 1200,
      percentiles: {
        '50': 150,
        '75': 280,
        '90': 450,
        '95': 680,
        '99': 950,
        '99.9': 1150
      }
    }
  }
};

// Story with fast response times (good performance)
export const FastResponseTimes: Story = {
  args: {
    responseTimes: {
      min: 10,
      max: 200,
      percentiles: {
        '50': 25,
        '75': 45,
        '90': 75,
        '95': 120,
        '99': 180,
        '99.9': 195
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a well-performing system with fast response times across all percentiles.'
      }
    }
  }
};

// Story with slow response times (performance issues)
export const SlowResponseTimes: Story = {
  args: {
    responseTimes: {
      min: 500,
      max: 15000,
      percentiles: {
        '50': 2000,
        '75': 4500,
        '90': 8000,
        '95': 11000,
        '99': 13500,
        '99.9': 14800
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a system experiencing performance issues with high response times.'
      }
    }
  }
};

// Story with wide variance in response times
export const HighVariance: Story = {
  args: {
    responseTimes: {
      min: 25,
      max: 8000,
      percentiles: {
        '50': 100,
        '75': 200,
        '90': 500,
        '95': 1500,
        '99': 5000,
        '99.9': 7500
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing high variance where most requests are fast but some outliers are very slow.'
      }
    }
  }
};

// Story with minimal percentile data
export const MinimalData: Story = {
  args: {
    responseTimes: {
      min: 80,
      max: 300,
      percentiles: {
        '50': 120,
        '95': 250
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with minimal percentile data points.'
      }
    }
  }
};

// Story with single percentile
export const SinglePercentile: Story = {
  args: {
    responseTimes: {
      min: 100,
      max: 200,
      percentiles: {
        '50': 150
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge case with only a single percentile data point.'
      }
    }
  }
};

// Story with empty percentiles (edge case)
export const EmptyPercentiles: Story = {
  args: {
    responseTimes: {
      min: 0,
      max: 0,
      percentiles: {}
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge case with no percentile data - component should handle gracefully.'
      }
    }
  }
};

// Story with very high response times (stress test)
export const ExtremeValues: Story = {
  args: {
    responseTimes: {
      min: 10000,
      max: 120000,
      percentiles: {
        '50': 25000,
        '75': 45000,
        '90': 70000,
        '95': 85000,
        '99': 105000,
        '99.9': 118000
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Stress test with extremely high response times to test component scaling.'
      }
    }
  }
};

// Story demonstrating all percentiles including edge cases
export const ComprehensivePercentiles: Story = {
  args: {
    responseTimes: {
      min: 30,
      max: 2500,
      percentiles: {
        '10': 45,
        '25': 65,
        '50': 120,
        '75': 200,
        '90': 350,
        '95': 600,
        '99': 1200,
        '99.9': 2200,
        '99.99': 2400,
        '100': 2500
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive example with many percentile data points including edge percentiles.'
      }
    }
  }
};
