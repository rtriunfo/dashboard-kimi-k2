# Performance Report Dashboard

A modern, responsive dashboard application for visualizing and analyzing Gatling load testing results. Built with React, TypeScript, and Vite, featuring comprehensive data visualization, theme support, and extensive testing coverage.

[Performance Dashboard](https://performance-dash.netlify.app/)

## 🚀 Features

- **📊 Comprehensive Analytics**: Visualize test scenarios with detailed metrics, response times, and request statistics
- **🎨 Modern UI**: Clean, responsive design with dark/light theme support
- **📈 Interactive Charts**: Powered by ECharts for rich data visualization
- **🔄 Multiple Views**: Summary, Response Times, Requests, and Metadata tabs
- **🎯 Scenario Management**: Switch between different test scenarios seamlessly
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **♿ Accessibility**: Built with accessibility best practices
- **🧪 Extensive Testing**: Jest unit tests, Playwright E2E tests, and Storybook component tests

## 🛠️ Tech Stack

### Core Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS processing and optimization

### Data Visualization
- **ECharts** - Powerful charting library for complex visualizations

### Development & Testing
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **Storybook** - Component documentation and testing
- **ESLint** - Code linting and formatting
- **Vitest** - Fast unit testing with Vite integration

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AssertionStats/     # Test assertion statistics
│   ├── CompactMetricCard/  # Metric display cards
│   ├── DashboardHeader/    # Main dashboard header
│   ├── LineGraph/         # Line chart component
│   ├── PieChart/          # Pie chart component
│   ├── RequestsTable/     # Data table for requests
│   ├── ResponseTimeChart/ # Response time visualizations
│   ├── TabNavigation/     # Tab switching component
│   ├── ThemeToggle/       # Dark/light theme switcher
│   └── ui/               # Base UI components
├── config/              # Configuration and data adapters
├── contexts/            # React contexts (Theme, etc.)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── stories/             # Storybook stories
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard-kimi-k2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run Jest unit tests |
| `npm run lint` | Run ESLint |
| `npm run storybook` | Start Storybook development server |
| `npm run build-storybook` | Build Storybook for deployment |

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npx playwright test
```

### Component Tests (Storybook)
```bash
npm run storybook
```

## 🎨 Component Development

This project uses Storybook for component development and documentation. Each component includes:

- **Stories**: Interactive examples
- **Tests**: Unit tests with Jest
- **Documentation**: Auto-generated from TypeScript types

### Adding a New Component

1. Create component in `src/components/YourComponent/`
2. Add `YourComponent.tsx`, `YourComponent.test.tsx`, `YourComponent.stories.tsx`
3. Export from `index.ts`
4. Add to Storybook configuration if needed

## 🎯 Usage

### Loading Test Data

The dashboard loads test scenarios from the `src/config/` directory. To add new test data:

1. Add your Gatling simulation results to `src/config/`
2. Update the scenario configuration in the data adapter
3. The dashboard will automatically detect and display new scenarios

### Switching Scenarios

Use the scenario dropdown in the header to switch between different test runs and compare results.

## 🌙 Theme Support

The application includes both light and dark themes:

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for extended use
- **Auto-detection**: Respects system theme preferences
- **Manual Toggle**: Theme switcher in the top-right corner

## 📊 Dashboard Views

### Summary Tab
- Key performance metrics
- Response time overview
- Error rate statistics
- Test duration and throughput

### Response Times Tab
- Detailed response time charts
- Percentile analysis
- Performance trends over time

### Requests Tab
- Request statistics table
- Filtering and sorting capabilities
- Detailed request information

### Metadata Tab
- Test configuration details
- Environment information
- Gatling version and settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Charts powered by [ECharts](https://echarts.apache.org/)
- Icons from [Lucide](https://lucide.dev/)
- UI components inspired by modern design systems