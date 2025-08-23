import type { Meta, StoryObj } from '@storybook/react';
import DashboardFooter from './DashboardFooter';

const meta = {
  title: 'Components/DashboardFooter',
  component: DashboardFooter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'DashboardFooter displays version information and attribution for the performance test report dashboard.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    gatlingVersion: {
      control: 'text',
      description: 'Gatling version used for test execution',
    },
    parserVersion: {
      control: 'text',
      description: 'Parser version used for report generation',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the footer',
    },
  },
} satisfies Meta<typeof DashboardFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with typical version information
export const Default: Story = {
  args: {
    gatlingVersion: '3.9.5',
    parserVersion: '1.2.3',
  },
};

// Story with unknown versions (default fallback)
export const UnknownVersions: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Footer with default "Unknown" versions when no version information is provided.',
      },
    },
  },
};

// Story with only Gatling version
export const GatlingVersionOnly: Story = {
  args: {
    gatlingVersion: '3.9.5',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with only Gatling version specified, parser version defaults to "Unknown".',
      },
    },
  },
};

// Story with only parser version
export const ParserVersionOnly: Story = {
  args: {
    parserVersion: '1.2.3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with only parser version specified, Gatling version defaults to "Unknown".',
      },
    },
  },
};

// Story with older versions
export const OlderVersions: Story = {
  args: {
    gatlingVersion: '3.8.4',
    parserVersion: '1.0.0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer displaying older version numbers.',
      },
    },
  },
};

// Story with newer/beta versions
export const BetaVersions: Story = {
  args: {
    gatlingVersion: '4.0.0-beta1',
    parserVersion: '2.0.0-rc1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with beta/release candidate version numbers.',
      },
    },
  },
};

// Story with custom styling
export const CustomStyling: Story = {
  args: {
    gatlingVersion: '3.9.5',
    parserVersion: '1.2.3',
    className: 'bg-slate-100 p-4 rounded-lg border',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with custom CSS classes applied for different styling.',
      },
    },
  },
};

// Story with empty versions
export const EmptyVersions: Story = {
  args: {
    gatlingVersion: '',
    parserVersion: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with empty string versions (edge case).',
      },
    },
  },
};

// Story in dark theme context
export const DarkTheme: Story = {
  args: {
    gatlingVersion: '3.9.5',
    parserVersion: '1.2.3',
    className: 'bg-slate-900 text-slate-300',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Footer styled for dark theme backgrounds.',
      },
    },
  },
};

// Story with very long version strings
export const LongVersions: Story = {
  args: {
    gatlingVersion: '3.9.5.RELEASE-20231201-enterprise-edition',
    parserVersion: '1.2.3-snapshot-build-12345-feature-branch',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with unusually long version strings to test text wrapping.',
      },
    },
  },
};
