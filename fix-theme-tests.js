#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map of dark mode classes to light mode classes
const classReplacements = {
  // Background colors
  'bg-slate-800/30': 'bg-white/80',
  'bg-slate-800/50': 'bg-white',
  'bg-slate-700': 'bg-gray-200',
  
  // Text colors
  'text-white': 'text-gray-900',
  'text-slate-400': 'text-gray-600',
  'text-slate-300': 'text-gray-700',
  'text-blue-400': 'text-blue-600',
  'text-red-400': 'text-red-500',
  'text-green-400': 'text-green-500',
  'text-yellow-400': 'text-yellow-500',
  
  // Border colors
  'border-slate-700': 'border-gray-200',
  'border-slate-600/50': 'border-gray-300',
  
  // Hover effects
  'hover:bg-slate-700/30': 'hover:bg-gray-100',
  'hover:bg-slate-600': 'hover:bg-gray-300',
  'hover:text-slate-300': 'hover:text-gray-700',
  'hover:border-slate-600/50': 'hover:border-gray-300',
  
  // Specific component combinations
  'border-transparent text-slate-400': 'border-transparent text-gray-500',
  'border-blue-500 text-blue-400': 'border-blue-500 text-blue-600'
};

// Files to update
const testFiles = [
  'src/components/CompactMetricCard/CompactMetricCard.test.tsx',
  'src/components/ResponseTimesDetailChart/ResponseTimesDetailChart.test.tsx',
  'src/components/AssertionStats/AssertionStats.test.tsx',
  'src/components/TabNavigation/TabNavigation.test.tsx',
  'src/components/DashboardHeader/DashboardHeader.test.tsx',
  'src/components/SeverityStats/SeverityStats.test.tsx',
  'src/components/RequestsTableContainer/RequestsTableContainer.test.tsx',
  'src/components/RequestsTableFilters/RequestsTableFilters.test.tsx',
  'src/components/RequestsTab/RequestsTab.test.tsx',
  'src/components/RequestStats/RequestStats.test.tsx',
  'src/components/MetadataTab/MetadataTab.test.tsx'
];

function updateTestFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Replace class expectations
  for (const [darkClass, lightClass] of Object.entries(classReplacements)) {
    const regex = new RegExp(`'${darkClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
    if (content.includes(`'${darkClass}'`)) {
      content = content.replace(regex, `'${lightClass}'`);
      modified = true;
      console.log(`  Updated: ${darkClass} -> ${lightClass}`);
    }
  }
  
  // Fix specific querySelector patterns that look for dark mode classes
  const selectorReplacements = {
    '.text-white': '.text-gray-900',
    '.text-slate-400': '.text-gray-600',
    '.text-red-400': '.text-red-500',
    '.text-green-400': '.text-green-500',
    '.text-yellow-400': '.text-yellow-500'
  };
  
  for (const [darkSelector, lightSelector] of Object.entries(selectorReplacements)) {
    if (content.includes(`'${darkSelector}'`)) {
      content = content.replace(new RegExp(`'${darkSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'), `'${lightSelector}'`);
      modified = true;
      console.log(`  Updated selector: ${darkSelector} -> ${lightSelector}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`);
  }
}

console.log('🔧 Fixing theme-related test failures...\n');

testFiles.forEach(file => {
  console.log(`Processing ${file}:`);
  updateTestFile(file);
  console.log('');
});

console.log('✅ Theme test fixes completed!');
