#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive mapping of all theme class test fixes needed
const testUpdates = [
  // RequestsTableContainer
  {
    file: 'src/components/RequestsTableContainer/RequestsTableContainer.test.tsx',
    changes: [
      {
        from: "expect(table).toHaveClass('w-full', 'border-collapse', 'bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl', 'border', 'border-slate-700');",
        to: "expect(table).toHaveClass('w-full', 'border-collapse', 'bg-white', 'backdrop-blur-sm', 'rounded-xl', 'border', 'border-gray-200');"
      }
    ]
  },
  
  // RequestStats
  {
    file: 'src/components/RequestStats/RequestStats.test.tsx',
    changes: [
      {
        from: "expect(mainContainer).toHaveClass('bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl', 'p-6', 'border', 'border-slate-700');",
        to: "expect(mainContainer).toHaveClass('bg-white', 'backdrop-blur-sm', 'rounded-xl', 'p-6', 'border', 'border-gray-200');"
      }
    ]
  },
  
  // AssertionStats
  {
    file: 'src/components/AssertionStats/AssertionStats.test.tsx',
    changes: [
      {
        from: "expect(mainContainer).toHaveClass('bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl');",
        to: "expect(mainContainer).toHaveClass('bg-white', 'backdrop-blur-sm', 'rounded-xl');"
      },
      {
        from: "const greenIcon = container.querySelector('.text-green-400');",
        to: "const greenIcon = container.querySelector('.text-green-500');"
      },
      {
        from: "const redIcon = container.querySelector('.text-red-400');",
        to: "const redIcon = container.querySelector('.text-red-500');"
      },
      {
        from: "const yellowIcon = container.querySelector('.text-yellow-400');",
        to: "const yellowIcon = container.querySelector('.text-yellow-500');"
      }
    ]
  },
  
  // CompactMetricCard
  {
    file: 'src/components/CompactMetricCard/CompactMetricCard.test.tsx',
    changes: [
      {
        from: "expect(cardElement).toHaveClass('border-slate-700/50');",
        to: "expect(cardElement).toHaveClass('border-gray-200');"
      }
    ]
  },
  
  // RequestsTab
  {
    file: 'src/components/RequestsTab/RequestsTab.test.tsx',
    changes: [
      {
        from: "expect(heading).toHaveClass('mb-6', 'text-2xl', 'font-bold', 'text-white');",
        to: "expect(heading).toHaveClass('mb-6', 'text-2xl', 'font-bold', 'text-gray-900');"
      }
    ]
  },
  
  // DashboardHeader
  {
    file: 'src/components/DashboardHeader/DashboardHeader.test.tsx',
    changes: [
      {
        from: "expect(header).toHaveClass('relative', 'z-20', 'border-b', 'bg-slate-800/50', 'backdrop-blur-sm', 'border-slate-700');",
        to: "expect(header).toHaveClass('relative', 'z-20', 'border-b', 'bg-white/90', 'backdrop-blur-sm', 'border-gray-200');"
      }
    ]
  },
  
  // SeverityStats
  {
    file: 'src/components/SeverityStats/SeverityStats.test.tsx',
    changes: [
      {
        from: "expect(blockerValue).toHaveClass('text-white', 'font-medium');",
        to: "expect(blockerValue).toHaveClass('text-gray-900', 'font-medium');"
      },
      {
        from: "expect(criticalValue).toHaveClass('text-white', 'font-medium');",
        to: "expect(criticalValue).toHaveClass('text-gray-900', 'font-medium');"
      },
      {
        from: "expect(majorValue).toHaveClass('text-white', 'font-medium');",
        to: "expect(majorValue).toHaveClass('text-gray-900', 'font-medium');"
      },
      {
        from: "expect(minorValue).toHaveClass('text-white', 'font-medium');",
        to: "expect(minorValue).toHaveClass('text-gray-900', 'font-medium');"
      },
      {
        from: "el.classList.contains('text-white')",
        to: "el.classList.contains('text-gray-900')"
      },
      {
        from: "const redIcons = container?.querySelectorAll('.text-red-400');",
        to: "const redIcons = container?.querySelectorAll('.text-red-500');"
      },
      {
        from: "const orangeIcons = container?.querySelectorAll('.text-orange-400');",
        to: "const orangeIcons = container?.querySelectorAll('.text-orange-500');"
      },
      {
        from: "const yellowIcons = container?.querySelectorAll('.text-yellow-400');",
        to: "const yellowIcons = container?.querySelectorAll('.text-yellow-500');"
      },
      {
        from: "const blueIcons = container?.querySelectorAll('.text-blue-400');",
        to: "const blueIcons = container?.querySelectorAll('.text-blue-600');"
      },
      {
        from: "const greenIcons = container?.querySelectorAll('.text-green-400');",
        to: "const greenIcons = container?.querySelectorAll('.text-green-500');"
      }
    ]
  },
  
  // ResponseTimesDetailChart
  {
    file: 'src/components/ResponseTimesDetailChart/ResponseTimesDetailChart.test.tsx',
    changes: [
      {
        from: "expect(barButton).toHaveClass('bg-slate-700');",
        to: "expect(barButton).toHaveClass('bg-gray-200');"
      },
      {
        from: "expect(screen.getByRole('button', { name: 'Line' })).toHaveClass('bg-slate-700');",
        to: "expect(screen.getByRole('button', { name: 'Line' })).toHaveClass('bg-gray-200');"
      }
    ]
  },
  
  // TabNavigation
  {
    file: 'src/components/TabNavigation/TabNavigation.test.tsx',
    changes: [
      {
        from: "expect(summaryTab).toHaveClass('border-blue-500', 'text-blue-400');",
        to: "expect(summaryTab).toHaveClass('border-blue-500', 'text-blue-600');"
      },
      {
        from: "expect(responseTimesTab).toHaveClass('border-transparent', 'text-slate-400');",
        to: "expect(responseTimesTab).toHaveClass('border-transparent', 'text-gray-500');"
      },
      {
        from: "expect(borderDiv).toHaveClass('border-b', 'border-slate-700');",
        to: "expect(borderDiv).toHaveClass('border-b', 'border-gray-200');"
      },
      {
        from: "expect(activeTab).toHaveClass('border-blue-500', 'text-blue-400');",
        to: "expect(activeTab).toHaveClass('border-blue-500', 'text-blue-600');"
      },
      {
        from: "expect(responseTimesTab).toHaveClass('hover:text-slate-300');",
        to: "expect(responseTimesTab).toHaveClass('hover:text-gray-700');"
      },
      {
        from: "expect(tab).toHaveClass('border-transparent', 'text-slate-400');",
        to: "expect(tab).toHaveClass('border-transparent', 'text-gray-500');"
      },
      {
        from: "expect(tab).not.toHaveClass('border-blue-500', 'text-blue-400');",
        to: "expect(tab).not.toHaveClass('border-blue-500', 'text-blue-600');"
      },
      {
        from: "expect(summaryTab).toHaveClass('border-blue-500', 'text-blue-400');",
        to: "expect(summaryTab).toHaveClass('border-blue-500', 'text-blue-600');"
      }
    ]
  },
  
  // RequestsTableFilters
  {
    file: 'src/components/RequestsTableFilters/RequestsTableFilters.test.tsx',
    changes: [
      {
        from: "expect(expandBtn).toHaveClass('bg-slate-800/50');",
        to: "expect(expandBtn).toHaveClass('bg-white');"
      }
    ]
  },
  
  // MetadataTab
  {
    file: 'src/components/MetadataTab/MetadataTab.test.tsx',
    changes: [
      {
        from: "expect(enabledText).toHaveClass('text-green-400');",
        to: "expect(enabledText).toHaveClass('text-green-500');"
      },
      {
        from: "expect(disabledText).toHaveClass('text-red-400');",
        to: "expect(disabledText).toHaveClass('text-red-500');"
      }
    ]
  },
  
  // RequestTableRow error percentage tests
  {
    file: 'src/components/RequestTableRow/RequestTableRow.test.tsx',
    changes: [
      {
        from: "expect(errorElement).toHaveClass('text-green-400');",
        to: "expect(errorElement).toHaveClass('text-green-500');"
      },
      {
        from: "expect(errorElement).toHaveClass('text-red-400');",
        to: "expect(errorElement).toHaveClass('text-red-500');"
      }
    ]
  }
];

function updateTestFile(fileInfo) {
  const filePath = path.join(__dirname, fileInfo.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fileInfo.file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  fileInfo.changes.forEach(change => {
    if (content.includes(change.from)) {
      content = content.replace(new RegExp(escapeRegExp(change.from), 'g'), change.to);
      modified = true;
      console.log(`  ✅ Updated: ${change.from.substring(0, 50)}...`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${fileInfo.file}`);
  } else {
    console.log(`⏭️  No changes needed for ${fileInfo.file}`);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log('🔧 Fixing remaining theme class test expectations...\n');

testUpdates.forEach(fileInfo => {
  console.log(`Processing ${fileInfo.file}:`);
  updateTestFile(fileInfo);
  console.log('');
});

console.log('✅ Theme class test fixes completed!');
