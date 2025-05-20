import { CohereClient } from 'cohere-ai';

// Initialize Cohere
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function getJobRecommendations(userProfile: any, jobList: any[]) {
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
    
    for (const line of recommendationLines) {
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
        if (Object.keys(currentRecommendation).length > 0) {
          parsedRecommendations.push(currentRecommendation);
        }
        currentRecommendation = { job: line.substring(3).trim() };
      } else if (line.includes('Company:')) {
        currentRecommendation.company = line.split('Company:')[1].trim();
      } else if (line.includes('Reason:')) {
        currentRecommendation.reason = line.split('Reason:')[1].trim();
      } else {
        // If it's not a structured line, add it to the reason
        if (currentRecommendation.reason) {
          currentRecommendation.reason += ' ' + line.trim();
        } else {
          currentRecommendation.reason = line.trim();
        }
      }
    }
    
    // Add the last recommendation
    if (Object.keys(currentRecommendation).length > 0) {
      parsedRecommendations.push(currentRecommendation);
    }
    
    return parsedRecommendations;
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    throw error;
  }
}
