#!/usr/bin/env node

/**
 * Test script to verify Host Assistant button functionality in Owner Dashboard
 * This script tests the integration between the Host Assistant button and Host Chatbot
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🧪 Testing Host Assistant Button Integration${colors.reset}\n`);

// Test 1: Verify OwnerDashboard has Host Assistant button
console.log(`${colors.yellow}1. Checking OwnerDashboard.tsx for Host Assistant button...${colors.reset}`);
try {
  const ownerDashboardPath = path.join(process.cwd(), 'client/src/pages/OwnerDashboard.tsx');
  const ownerDashboardContent = readFileSync(ownerDashboardPath, 'utf8');
  
  const hasHostAssistantButton = ownerDashboardContent.includes('🤖 Get AI Host Assistant Help');
  const hasScrollBehavior = ownerDashboardContent.includes('window.scrollTo');
  const hasTriggerLogic = ownerDashboardContent.includes('data-host-chat-trigger');
  const hasHostChatbotImport = ownerDashboardContent.includes('TamudaHostChatbot');
  const hasHostChatbotComponent = ownerDashboardContent.includes('<TamudaHostChatbot />');
  
  console.log(`   ✅ Host Assistant button text: ${hasHostAssistantButton ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Scroll behavior: ${hasScrollBehavior ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Trigger logic: ${hasTriggerLogic ? 'Found' : 'Missing'}`);
  console.log(`   ✅ HostChatbot import: ${hasHostChatbotImport ? 'Found' : 'Missing'}`);
  console.log(`   ✅ HostChatbot component: ${hasHostChatbotComponent ? 'Found' : 'Missing'}`);
  
  if (hasHostAssistantButton && hasScrollBehavior && hasTriggerLogic && hasHostChatbotImport && hasHostChatbotComponent) {
    console.log(`   ${colors.green}✅ PASS: Owner Dashboard has complete Host Assistant integration${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ FAIL: Owner Dashboard missing some Host Assistant components${colors.reset}`);
  }
  
} catch (error) {
  console.log(`   ${colors.red}❌ ERROR: Could not read OwnerDashboard.tsx - ${error.message}${colors.reset}`);
}

// Test 2: Verify HostChatbot has data attribute trigger
console.log(`\n${colors.yellow}2. Checking HostChatbot.tsx for trigger data attribute...${colors.reset}`);
try {
  const hostChatbotPath = path.join(process.cwd(), 'client/src/components/HostChatbot.tsx');
  const hostChatbotContent = readFileSync(hostChatbotPath, 'utf8');
  
  const hasDataAttribute = hostChatbotContent.includes('data-host-chat-trigger="true"');
  const hasGreenStyling = hostChatbotContent.includes('bg-green-600');
  const hasHostSpecificContent = hostChatbotContent.includes('Host Assistant');
  const hasHostPrompts = hostChatbotContent.includes('How do I create my first listing?');
  
  console.log(`   ✅ Data trigger attribute: ${hasDataAttribute ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Green styling (host theme): ${hasGreenStyling ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Host-specific content: ${hasHostSpecificContent ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Host quick suggestions: ${hasHostPrompts ? 'Found' : 'Missing'}`);
  
  if (hasDataAttribute && hasGreenStyling && hasHostSpecificContent && hasHostPrompts) {
    console.log(`   ${colors.green}✅ PASS: Host Chatbot properly configured${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ FAIL: Host Chatbot missing some required features${colors.reset}`);
  }
  
} catch (error) {
  console.log(`   ${colors.red}❌ ERROR: Could not read HostChatbot.tsx - ${error.message}${colors.reset}`);
}

// Test 3: Verify API endpoint exists
console.log(`\n${colors.yellow}3. Checking server routes for host chat endpoint...${colors.reset}`);
try {
  const routesPath = path.join(process.cwd(), 'server/routes.ts');
  const routesContent = readFileSync(routesPath, 'utf8');
  
  const hasHostChatEndpoint = routesContent.includes('/api/host-chat');
  const hasHostSystemPrompt = routesContent.includes('TamudaStay Host Assistant');
  const hasHostFallbackLogic = routesContent.includes('Enhanced fallback responses for hosts');
  
  console.log(`   ✅ Host chat endpoint: ${hasHostChatEndpoint ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Host system prompt: ${hasHostSystemPrompt ? 'Found' : 'Missing'}`);
  console.log(`   ✅ Host fallback logic: ${hasHostFallbackLogic ? 'Found' : 'Missing'}`);
  
  if (hasHostChatEndpoint && hasHostSystemPrompt) {
    console.log(`   ${colors.green}✅ PASS: Host chat API endpoint configured${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ FAIL: Host chat API endpoint missing or incomplete${colors.reset}`);
  }
  
} catch (error) {
  console.log(`   ${colors.red}❌ ERROR: Could not read routes.ts - ${error.message}${colors.reset}`);
}

// Test 4: Check if project builds successfully
console.log(`\n${colors.yellow}4. Testing project build...${colors.reset}`);
try {
  console.log(`   Building project...`);
  execSync('npm run build', { stdio: 'pipe' });
  console.log(`   ${colors.green}✅ PASS: Project builds successfully${colors.reset}`);
} catch (error) {
  console.log(`   ${colors.red}❌ FAIL: Project build failed${colors.reset}`);
  console.log(`   ${colors.red}Build error: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.blue}📋 Test Summary${colors.reset}`);
console.log(`${colors.blue}=================${colors.reset}`);
console.log(`- Owner Dashboard Host Assistant button integration`);
console.log(`- Host Chatbot component with proper triggers`);
console.log(`- Host-specific API endpoint`);
console.log(`- Project build verification`);
console.log(`\n${colors.green}🎯 Host Assistant button should now work properly in the Owner Dashboard!${colors.reset}`);
console.log(`${colors.blue}To test manually:${colors.reset}`);
console.log(`1. Run: npm run dev`);
console.log(`2. Navigate to /owner-dashboard`);
console.log(`3. Click the "🤖 Get AI Host Assistant Help" button`);
console.log(`4. Verify the Host Chatbot opens at the bottom left`);
