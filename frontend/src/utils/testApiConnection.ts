import axios from 'axios';

/**
 * Simple utility to test the connection to the backend API
 * Run this with: npx ts-node src/utils/testApiConnection.ts
 */
async function testApiConnection() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300/api';
  console.log('Testing connection to API at:', baseUrl);
  
  try {
    // Test jobs endpoint
    console.log('Testing /jobs endpoint...');
    const jobsResponse = await axios.get(`${baseUrl}/jobs`);
    console.log('Jobs endpoint response status:', jobsResponse.status);
    console.log('Number of jobs returned:', Array.isArray(jobsResponse.data) ? jobsResponse.data.length : 'Not an array');
    
    if (Array.isArray(jobsResponse.data) && jobsResponse.data.length > 0) {
      console.log('First job:', jobsResponse.data[0].title, 'at', jobsResponse.data[0].company);
    } else if (jobsResponse.data && jobsResponse.data.results && jobsResponse.data.results.length > 0) {
      console.log('First job:', jobsResponse.data.results[0].title, 'at', jobsResponse.data.results[0].company);
    }
    
    console.log('✅ API connection successful!');
  } catch (error: unknown) {
    console.error('❌ API connection failed!');
    const err = error as { message?: string; response?: { status?: number; data?: unknown } };
    console.error('Error details:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    
    // Provide troubleshooting tips
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure the backend server is running on port 3300');
    console.log('2. Check if there are any CORS issues');
    console.log('3. Verify the API routes are correctly defined in the backend');
    console.log('4. Check if the MongoDB connection is working properly');
  }
}

// Run the test
testApiConnection();
