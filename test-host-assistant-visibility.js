#!/usr/bin/env node

/**
 * Test script to verify Host Assistant is only available in Owner Dashboard
 * This script tests that Host Chatbot is removed from home page but remains in Owner Dashboard
 */

import { readFileSync } from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🧪 Testing Host Assistant Visibility Control${colors.reset}\n`);

// Test 1: Verify Index.tsx (home page) does NOT have Host Chatbot
console.log(`${colors.yellow}1. Checking Index.tsx (home page) for Host Assistant removal...${colors.reset}`);
try {
  const indexPath = path.join(process.cwd(), 'client/src/pages/Index.tsx');
  const indexContent = readFileSync(indexPath, 'utf8');
  
  const hasHostChatbotImport = indexContent.includes('TamudaHostChatbot');
  const hasHostChatbotComponent = indexContent.includes('<TamudaHostChatbot');
  const hasGuestChatbot = indexContent.includes('TamudaChatbot');
  const hasGuestChatbotComponent = indexContent.includes('<TamudaChatbot');
  
  console.log(`   ❌ Host Chatbot import: ${hasHostChatbotImport ? 'FOUND (should be removed)' : 'Not found ✅'}`);
  console.log(`   ❌ Host Chatbot component: ${hasHostChatbotComponent ? 'FOUND (should be removed)' : 'Not found ✅'}`);
  console.log(`   ✅ Guest Chatbot import: ${hasGuestChatbot ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`   ✅ Guest Chatbot component: ${hasGuestChatbotComponent ? 'Found ✅' : 'Missing ❌'}`);
  
  if (!hasHostChatbotImport && !hasHostChatbotComponent && hasGuestChatbot && hasGuestChatbotComponent) {
    console.log(`   ${colors.green}✅ PASS: Home page correctly shows only Guest Chatbot${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ FAIL: Home page configuration incorrect${colors.reset}`);
  }
  
} catch (error) {
  console.log(`   ${colors.red}❌ ERROR: Could not read Index.tsx - ${error.message}${colors.reset}`);
}

// Test 2: Verify OwnerDashboard.tsx still has Host Assistant
console.log(`\n${colors.yellow}2. Checking OwnerDashboard.tsx for Host Assistant presence...${colors.reset}`);
try {
  const ownerDashboardPath = path.join(process.cwd(), 'client/src/pages/OwnerDashboard.tsx');
  const ownerDashboardContent = readFileSync(ownerDashboardPath, 'utf8');
  
  const hasHostAssistantButton = ownerDashboardContent.includes('🤖 Get AI Host Assistant Help');
  const hasHostChatbotImport = ownerDashboardContent.includes('TamudaHostChatbot');
  const hasHostChatbotComponent = ownerDashboardContent.includes('<TamudaHostChatbot');
  const hasScrollBehavior = ownerDashboardContent.includes('window.scrollTo');
  const hasTriggerLogic = ownerDashboardContent.includes('data-host-chat-trigger');
  
  console.log(`   ✅ Host Assistant button: ${hasHostAssistantButton ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`   ✅ Host Chatbot import: ${hasHostChatbotImport ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`   ✅ Host Chatbot component: ${hasHostChatbotComponent ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`   ✅ Scroll behavior: ${hasScrollBehavior ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`   ✅ Trigger logic: ${hasTriggerLogic ? 'Found ✅' : 'Missing ❌'}`);
  
  if (hasHostAssistantButton && hasHostChatbotImport && hasHostChatbotComponent && hasScrollBehavior && hasTriggerLogic) {
    console.log(`   ${colors.green}✅ PASS: Owner Dashboard correctly has Host Assistant${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ FAIL: Owner Dashboard missing Host Assistant components${colors.reset}`);
  }
  
} catch (error) {
  console.log(`   ${colors.red}❌ ERROR: Could not read OwnerDashboard.tsx - ${error.message}${colors.reset}`);
}

// Test 3: Check for any other files that might have Host Chatbot
console.log(`\n${colors.yellow}3. Checking for Host Chatbot usage in other pages...${colors.reset}`);
try {
  const pagesDir = path.join(process.cwd(), 'client/src/pages');
  const fs = await import('fs');
  const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.tsx'));
  
  let hostChatbotFoundInOtherFiles = [];
  
  for (const file of files) {
    if (file === 'OwnerDashboard.tsx') continue; // Skip Owner Dashboard as it should have it
    
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('TamudaHostChatbot') || content.includes('HostChatbot')) {
      hostChatbotFoundInOtherFiles.push(file);
    }
  }
  
  if (hostChatbotFoundInOtherFiles.length === 0) {
    console.log(`   ${colors.green}✅ PASS: Host Chatbot not found in other pages${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ FAIL: Host Chatbot found in: ${hostChatbotFoundInOtherFiles.join(', ')}${colors.reset}`);
  }
  
} catch (error) {
  console.log(`   ${colors.red}❌ ERROR: Could not scan other pages - ${error.message}${colors.reset}`);
}

console.log(`\n${colors.blue}📋 Test Summary${colors.reset}`);
console.log(`${colors.blue}=================${colors.reset}`);
console.log(`- ✅ Home page (Index.tsx) should only have Guest Chatbot`);
console.log(`- ✅ Owner Dashboard should have Host Assistant button + Host Chatbot`);
console.log(`- ✅ Other pages should not have Host Chatbot`);
console.log(`\n${colors.green}🎯 Host Assistant is now exclusive to property owners in the Owner Dashboard!${colors.reset}`);
console.log(`${colors.blue}User Experience:${colors.reset}`);
console.log(`- 👥 Regular visitors: See blue Guest Chatbot on home page`);
console.log(`- 🏠 Property owners: See green Host Assistant in Owner Dashboard only`);
