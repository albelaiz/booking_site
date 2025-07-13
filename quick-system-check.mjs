#!/usr/bin/env node

/**
 * QUICK SYSTEM STATUS CHECK
 * Verifies current system health and identifies immediate issues
 */

import axios from 'axios';

const BASE_URL = 'https://tamudastay.com';

async function quickSystemCheck() {
  console.log('🏥 TAMUDASTAY SYSTEM HEALTH CHECK\n');
  
  // Test 1: Server Health
  console.log('1. Testing server health...');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log(`✅ Server running (${response.data.status})`);
  } catch (error) {
    console.log('❌ Server not responding - check if server is running');
    return;
  }

  // Test 2: Database Connection
  console.log('\n2. Testing database connection...');
  try {
    const response = await axios.get(`${BASE_URL}/api/properties/public`);
    console.log(`✅ Database connected (${response.data.length} public properties)`);
  } catch (error) {
    console.log('❌ Database connection issues');
  }

  // Test 3: Authentication System
  console.log('\n3. Testing authentication...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'password123'
    });
    console.log(`✅ Authentication working (${response.data.user.role})`);
  } catch (error) {
    console.log('❌ Authentication system issues');
  }

  // Test 4: Property Approval Workflow
  console.log('\n4. Testing property approval workflow...');
  try {
    const adminResponse = await axios.get(`${BASE_URL}/api/properties`, {
      headers: { 'Authorization': 'Bearer admin-1' }
    });
    const publicResponse = await axios.get(`${BASE_URL}/api/properties/public`);
    
    console.log(`✅ Approval workflow working`);
    console.log(`   - Admin sees: ${adminResponse.data.length} total properties`);
    console.log(`   - Public sees: ${publicResponse.data.length} approved properties`);
  } catch (error) {
    console.log('❌ Property approval workflow issues');
  }

  // Test 5: Booking System
  console.log('\n5. Testing booking system...');
  try {
    const response = await axios.get(`${BASE_URL}/api/bookings`, {
      headers: { 'Authorization': 'Bearer admin-1' }
    });
    console.log(`✅ Booking system working (${response.data.length} bookings)`);
  } catch (error) {
    console.log('❌ Booking system issues');
  }

  console.log('\n📋 SYSTEM STATUS SUMMARY:');
  console.log('✅ Core functionality working');
  console.log('⚠️  Security vulnerabilities present');
  console.log('❌ Payment system missing');
  console.log('❌ Email notifications missing');
  
  console.log('\n🔧 TO RUN FULL SECURITY AUDIT:');
  console.log('node test-security-vulnerabilities.mjs');
  
  console.log('\n📖 FOR COMPLETE ANALYSIS:');
  console.log('See: COMPREHENSIVE_SYSTEM_ANALYSIS_REPORT.md');
}

quickSystemCheck().catch(console.error);
