import React, { useState, useEffect } from 'react';
import { getTestScenario, getAvailableScenarios, TestScenario } from './config/testReportAdapter';
import TabNavigation, { TabType } from './components/TabNavigation';
import LoadingSpinner from './components/LoadingSpinner';
import DashboardHeader from './components/DashboardHeader';
import SummaryTab from './components/SummaryTab';
import ResponseTimesTab from './components/ResponseTimesTab';
import MetadataTab from './components/MetadataTab';
import RequestsTab from './components/RequestsTab';
import DashboardFooter from './components/DashboardFooter';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedScenario, setSelectedScenario] = useState<string>('test-report-data');
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<TestScenario | null>(null);
  const [availableScenarios, setAvailableScenarios] = useState<TestScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScenarios = async () => {
      console.log('🔍 [App] Starting to load scenarios...');
      console.log('🔍 [App] Selected scenario ID:', selectedScenario);
      
      setIsLoading(true);
      try {
        console.log('🔍 [App] Fetching available scenarios...');
        const scenarios = await getAvailableScenarios();
        console.log('✅ [App] Available scenarios:', scenarios.map(s => ({
          id: s.id,
          name: s.name,
          hasData: !!s.data
        })));
        
        setAvailableScenarios(scenarios);
        
        if (scenarios.length === 0) {
          console.warn('⚠️ [App] No scenarios found!');
          return;
        }
        
        console.log(`🔍 [App] Loading scenario with ID: ${selectedScenario}`);
        const scenario = await getTestScenario(selectedScenario);
        console.log('✅ [App] Loaded scenario:', {
          id: scenario?.id,
          name: scenario?.name,
          hasData: !!scenario?.data,
          dataKeys: scenario?.data ? Object.keys(scenario.data) : 'no data'
        });
        
        if (!scenario) {
          console.error('❌ [App] Failed to load scenario:', selectedScenario);
          return;
        }
        
        setCurrentScenario(scenario);
        console.log('✅ [App] Scenario state updated in component');
      } catch (error) {
        console.error('❌ [App] Failed to load scenarios:', error);
      } finally {
        console.log('🔍 [App] Finished loading scenarios');
        setIsLoading(false);
      }
    };
    
    loadScenarios().catch(error => {
      console.error('❌ [App] Unhandled error in loadScenarios:', error);
    });
  }, [selectedScenario]);

  const testData = currentScenario?.data;

  // Debug: Log when testData changes
  useEffect(() => {
    if (testData) {
      console.log('🔄 Header cards re-rendering with scenario:', selectedScenario);
      console.log('📊 Current data metrics:', {
        totalRequests: testData.totalRequests,
        duration: testData.duration,
        errorRate: testData.errorRate,
        rate: testData.rate,
        severityMinor: testData.severityStats?.minor
      });
    }
  }, [testData, selectedScenario]);




  // Show loading state
  if (isLoading || !testData) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        <DashboardHeader
          testData={testData}
          selectedScenario={selectedScenario}
          currentScenario={currentScenario}
          availableScenarios={availableScenarios}
          isLoading={isLoading}
          isScenarioDropdownOpen={isScenarioDropdownOpen}
          onScenarioChange={setSelectedScenario}
          onToggleDropdown={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
          onCloseDropdown={() => setIsScenarioDropdownOpen(false)}
        />

        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          {activeTab === 'summary' && <SummaryTab testData={testData} />}
          {activeTab === 'responseTimes' && <ResponseTimesTab testData={testData} />}
          {activeTab === 'requests' && <RequestsTab testData={testData} />}
          {activeTab === 'metadata' && <MetadataTab testData={testData} />}

          {/* Footer */}
          <DashboardFooter
            gatlingVersion={testData.gatlingVersion}
            parserVersion={testData.parserVersion}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
