/**
 * Test script for the free trial system
 * 
 * This script will:
 * 1. Check the free trial status for a test user
 * 2. Update the free trial usage count
 * 3. Verify the count was updated correctly
 */

const fetch = require('node-fetch');

// Replace with your actual user ID
const TEST_USER_ID = "google-oauth2|123456789";

// Base URL for API endpoints
const BASE_URL = "http://localhost:3000/api";

async function testFreeTrial() {
  console.log("Starting free trial system test...");
  
  try {
    // Step 1: Check initial free trial status
    console.log("\n1. Checking initial free trial status...");
    const initialStatus = await checkFreeTrial();
    console.log("Initial status:", initialStatus);
    
    // Step 2: Update free trial usage
    console.log("\n2. Updating free trial usage...");
    const updatedStatus = await updateFreeTrial();
    console.log("Updated status:", updatedStatus);
    
    // Step 3: Verify the count was updated correctly
    console.log("\n3. Verifying the count was updated correctly...");
    const finalStatus = await checkFreeTrial();
    console.log("Final status:", finalStatus);
    
    // Validate results
    if (finalStatus.analysesUsed === initialStatus.analysesUsed + 1) {
      console.log("\n✅ SUCCESS: Free trial usage count was updated correctly!");
    } else {
      console.log("\n❌ FAILURE: Free trial usage count was not updated correctly!");
      console.log(`Expected: ${initialStatus.analysesUsed + 1}, Actual: ${finalStatus.analysesUsed}`);
    }
    
  } catch (error) {
    console.error("Error during test:", error);
  }
}

async function checkFreeTrial() {
  const response = await fetch(`${BASE_URL}/check-free-trial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: TEST_USER_ID }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to check free trial status: ${response.statusText}`);
  }
  
  return await response.json();
}

async function updateFreeTrial() {
  const response = await fetch(`${BASE_URL}/update-free-trial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: TEST_USER_ID }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update free trial usage: ${response.statusText}`);
  }
  
  return await response.json();
}

// Run the test
testFreeTrial().catch(console.error); 