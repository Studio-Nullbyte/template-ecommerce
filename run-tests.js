#!/usr/bin/env node

// Test runner for Studio Nullbyte test suite
import { spawn } from 'child_process'
import { readdir } from 'fs/promises'
import path from 'path'

const testDir = 'tests'
const testFiles = [
  'featured-products-status.js',
  'test-slug.js',
  'test-featured-products.js',
  'test-loading-fix.js',
  'test-conditional-rendering.js'
]

console.log('🧪 Studio Nullbyte Test Suite Runner\n')

async function runTest(testFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔍 Running ${testFile}...`)
    console.log('='.repeat(50))
    
    const testPath = path.join(testDir, testFile)
    const child = spawn('node', [testPath], { stdio: 'inherit' })
    
    child.on('close', (code) => {
      console.log('='.repeat(50))
      if (code === 0) {
        console.log(`✅ ${testFile} completed successfully`)
        resolve()
      } else {
        console.log(`❌ ${testFile} failed with code ${code}`)
        reject(new Error(`Test failed: ${testFile}`))
      }
    })
    
    child.on('error', (error) => {
      console.log(`💥 Error running ${testFile}:`, error.message)
      reject(error)
    })
  })
}

async function runAllTests() {
  console.log('📋 Running all test files...\n')
  
  let passed = 0
  let failed = 0
  
  for (const testFile of testFiles) {
    try {
      await runTest(testFile)
      passed++
    } catch (error) {
      failed++
      console.error(`Failed to run ${testFile}:`, error.message)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Suite Results:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Total: ${passed + failed}`)
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check the output above for details.')
    process.exit(1)
  } else {
    console.log('\n🎉 All tests passed!')
    process.exit(0)
  }
}

// Check command line arguments
const args = process.argv.slice(2)
if (args.length > 0 && args[0] === '--list') {
  console.log('Available tests:')
  testFiles.forEach(file => console.log(`  - ${file}`))
  process.exit(0)
}

if (args.length > 0 && args[0] === '--help') {
  console.log('Usage:')
  console.log('  node run-tests.js          Run all tests')
  console.log('  node run-tests.js --list   List available tests')
  console.log('  node run-tests.js --help   Show this help')
  process.exit(0)
}

// Run all tests
runAllTests().catch(console.error)
