// Simple test runner to verify App.test.tsx works
const { execSync } = require('child_process');

try {
  console.log('Running App.test.tsx...');
  
  // Try to run just the App test with no cache
  const result = execSync('npx jest src/App.test.tsx --no-cache --verbose', {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  console.log('✅ Tests passed!');
  console.log(result);
} catch (error) {
  console.log('❌ Test failed with error:');
  console.log(error.stdout);
  console.log(error.stderr);
  
  if (error.stdout.includes('import.meta')) {
    console.log('\n🔧 The issue is with import.meta.glob syntax from Vite.');
    console.log('The test file is correctly written but Jest needs configuration to handle Vite syntax.');
  }
}
