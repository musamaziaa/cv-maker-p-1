// AI Configuration for Secure Backend Proxy
// Update this URL to your actual backend domain
const BACKEND_API_URL = 'https://yourdomain.com/api/ai';
// For local development, use: 'http://localhost:3000/api/ai'

// AI Helper Functions
async function callBackendAPI(endpoint, data) {
    try {
        const response = await fetch(`${BACKEND_API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API request failed: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Backend API Error:', error);
        throw error;
    }
}

// Generate achievement points using AI
async function generateAchievementPoints(achievementTitle) {
    return await callBackendAPI('achievements', { achievementTitle });
}

// Generate experience points using AI
async function generateExperiencePoints(expTitle, expOrganization) {
    return await callBackendAPI('experience', { expTitle, expOrganization });
}

// Generate education points using AI
async function generateEducationPoints(eduSchool, eduDegree) {
    return await callBackendAPI('education', { eduSchool, eduDegree });
} 