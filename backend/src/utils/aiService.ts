import { CohereClient } from 'cohere-ai';

// Check if API key is available
if (!process.env.COHERE_API_KEY) {
  console.error('COHERE_API_KEY is not defined in environment variables');
}

// Initialize Cohere
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export async function getJobRecommendations(userProfile: any, jobList: any[]) {
  // Validate inputs
  if (!userProfile) {
    throw new Error('User profile is required for job recommendations');
  }
  
  if (!jobList || jobList.length === 0) {
    throw new Error('Job list is empty. Cannot generate recommendations without jobs.');
  }
  
  if (!process.env.COHERE_API_KEY) {
    // If API key is missing, return mock recommendations instead of failing
    console.warn('Using mock recommendations because COHERE_API_KEY is missing');
    return getMockRecommendations(userProfile, jobList);
  }
  try {
    const prompt = `
Based on this user profile:
Name: ${userProfile.name}
Location: ${userProfile.location}
Skills: ${userProfile.skills.join(', ')}
Experience: ${userProfile.yearsOfExperience} years
Preferred Job Type: ${userProfile.preferredJobType}

Suggest the top 3 matching jobs from the following list:
${JSON.stringify(jobList)}

Provide job title, company, and one-line reason for each match.
`;

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: 'You are a helpful job matching assistant. ' + prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    const generations = response.generations || [];
    const recommendations = generations.length > 0 ? generations[0].text : '';
    
    // Parse the recommendations to extract structured data
    // This is a simple implementation - you might want to improve this parsing
    const recommendationLines = recommendations?.split('\n').filter(line => line.trim() !== '') || [];
    
    const parsedRecommendations = [];
    let currentRecommendation: any = {};
    
    try {
      // First try to parse as JSON if the response is in JSON format
      try {
        // Look for JSON array pattern, using a more compatible regex approach
        const jsonMatch = recommendations.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            return jsonData.map(item => ({
              job: item.job || item.title || '',
              company: item.company || '',
              reason: item.reason || ''
            })).filter(item => item.job && item.company);
          }
        }
      } catch (jsonError) {
        console.log('Response not in JSON format, trying line-by-line parsing');
      }
      
      // Fall back to line-by-line parsing
      for (const line of recommendationLines) {
        // Check for numbered list items (1., 2., etc.)
        if (/^\d+\./.test(line)) {
          if (Object.keys(currentRecommendation).length > 0) {
            parsedRecommendations.push(currentRecommendation);
          }
          // Extract job title - everything after the number
          currentRecommendation = { job: line.replace(/^\d+\.\s*/, '').trim() };
        } 
        // Look for company information
        else if (line.toLowerCase().includes('company:')) {
          currentRecommendation.company = line.split(/company:\s*/i)[1]?.trim() || '';
        } 
        // Look for reason information
        else if (line.toLowerCase().includes('reason:')) {
          currentRecommendation.reason = line.split(/reason:\s*/i)[1]?.trim() || '';
        } 
        // If job title is in the format "Job Title - Company Name"
        else if (currentRecommendation.job && !currentRecommendation.company && line.includes(' - ')) {
          const parts = line.split(' - ');
          if (parts.length === 2) {
            currentRecommendation.job = parts[0].trim();
            currentRecommendation.company = parts[1].trim();
          }
        }
        // If it's not a structured line, add it to the reason
        else if (currentRecommendation.job) {
          if (currentRecommendation.reason) {
            currentRecommendation.reason += ' ' + line.trim();
          } else {
            currentRecommendation.reason = line.trim();
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI recommendations');
    }
    
    // Add the last recommendation
    if (Object.keys(currentRecommendation).length > 0 && currentRecommendation.job) {
      // Ensure all recommendations have the required fields
      if (!currentRecommendation.company) {
        currentRecommendation.company = 'Unknown Company';
      }
      if (!currentRecommendation.reason) {
        currentRecommendation.reason = 'This job matches your profile.';
      }
      parsedRecommendations.push(currentRecommendation);
    }
    
    // Validate we have at least one recommendation
    if (parsedRecommendations.length === 0) {
      console.warn('No recommendations could be parsed from AI response');
      return getMockRecommendations(userProfile, jobList);
    }
    
    return parsedRecommendations;
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    // Return mock recommendations instead of failing completely
    return getMockRecommendations(userProfile, jobList);
  }
}

// Fallback function to generate mock recommendations when AI service fails
function getMockRecommendations(userProfile: any, jobList: any[]) {
  console.log('Generating mock recommendations based on user profile');
  
  // Extract skills from user profile
  const userSkills = userProfile.skills || [];
  
  // Filter jobs that match user skills
  let matchingJobs = jobList.filter(job => {
    const jobSkills = job.skills || [];
    // Check if any of the user's skills match the job skills
    return jobSkills.some((skill: string) => 
      userSkills.some((userSkill: string) => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  });
  
  // If no matching jobs, just take the first few jobs
  if (matchingJobs.length === 0) {
    matchingJobs = jobList.slice(0, 3);
  }
  
  // Limit to 3 recommendations
  matchingJobs = matchingJobs.slice(0, 3);
  
  // Format the recommendations
  return matchingJobs.map(job => ({
    job: job.title,
    company: job.company,
    reason: `This job matches your ${userSkills.length > 0 ? userSkills[0] : 'profile'} skills.`
  }));
}
