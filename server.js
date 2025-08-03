const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const { RateLimiterMemory } = require('rate-limiter-flexible');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check for required environment variables
if (!process.env.OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY is required but not set');
    process.exit(1);
}

if (!process.env.OPENROUTER_BASE_URL) {
    console.error('❌ OPENROUTER_BASE_URL is required but not set');
    process.exit(1);
}

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://lightyellow-heron-963716.hostingersite.com',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (rejRes) {
        res.status(429).json({
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.round(rejRes.msBeforeNext / 1000)
        });
    }
};

// Apply rate limiting to AI endpoints
app.use('/api/ai', rateLimiterMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Resume Builder AI Proxy'
    });
});

// AI Proxy endpoints
app.post('/api/ai/achievements', async (req, res) => {
    try {
        const { achievementTitle } = req.body;

        if (!achievementTitle || typeof achievementTitle !== 'string') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Achievement title is required and must be a string'
            });
        }

        const prompt = `Generate exactly 4 powerful, resume-ready achievement points for: "${achievementTitle}". 
        
        Requirements:
        - Use strong action verbs like "Led", "Built", "Developed", "Implemented", "Managed", "Created", "Optimized", "Increased", "Reduced", "Established"
        - Make each point specific and measurable with numbers/percentages where possible
        - Keep each point concise and impactful (1 sentence max)
        - Focus on quantifiable results and business impact
        - Use professional resume language
        - Make points powerful but realistic
        - The generated points should be in the same language as the achievement title
        - The points should be small and concise, maximum 15 words, and should contain numbers/percentages where possible
        
        Format: Return exactly 4 points, each on a new line, starting with "• " (bullet point). Example:
        • Led a team of 5 developers to deliver project 30% under budget
        • Implemented new process that increased efficiency by 25%
        • Reduced customer complaints by 40% through improved systems
        • Established new workflow that saved 15 hours per week`;

        const response = await axios.post(process.env.OPENROUTER_BASE_URL + '/chat/completions', {
            model: process.env.AI_MODEL,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.CORS_ORIGIN,
                'X-Title': 'Resume Builder AI'
            }
        });

        const aiResponse = response.data.choices[0].message.content;
        res.json({ success: true, data: aiResponse });

    } catch (error) {
        console.error('AI Achievement Generation Error:', error);

        if (error.response) {
            const status = error.response.status;
            let message = 'AI service error';

            if (status === 401) {
                message = 'Invalid API key';
            } else if (status === 429) {
                message = 'Rate limit exceeded';
            } else if (status >= 500) {
                message = 'AI service temporarily unavailable';
            }

            return res.status(status).json({
                error: 'AI Service Error',
                message: message
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to generate achievement points'
        });
    }
});

app.post('/api/ai/experience', async (req, res) => {
    try {
        const { expTitle, expOrganization } = req.body;

        if (!expTitle || !expOrganization || typeof expTitle !== 'string' || typeof expOrganization !== 'string') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Job title and organization are required and must be strings'
            });
        }

        const prompt = `Generate exactly 4 powerful, resume-ready experience points for: "${expTitle}" at "${expOrganization}". 
        
        Requirements:
        - Use strong action verbs like "Led", "Built", "Developed", "Implemented", "Managed", "Created", "Optimized", "Increased", "Reduced", "Established"
        - Make each point specific and measurable with numbers/percentages where possible
        - Keep each point concise and impactful (1 sentence max)
        - Focus on quantifiable results and business impact
        - Use professional resume language
        - Make points powerful but realistic
        - The generated points should be in the same language as the job title
        - The points should be small and concise, maximum 15 words, and should contain numbers/percentages where possible
        
        Format: Return exactly 4 points, each on a new line, starting with "• " (bullet point). Example:
        • Led a team of 8 developers to deliver 3 major projects on time
        • Implemented CI/CD pipeline that reduced deployment time by 60%
        • Optimized database queries resulting in 40% faster load times
        • Mentored 5 junior developers and improved team productivity by 25%`;

        const response = await axios.post(process.env.OPENROUTER_BASE_URL + '/chat/completions', {
            model: process.env.AI_MODEL,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.CORS_ORIGIN,
                'X-Title': 'Resume Builder AI'
            }
        });

        const aiResponse = response.data.choices[0].message.content;
        res.json({ success: true, data: aiResponse });

    } catch (error) {
        console.error('AI Experience Generation Error:', error);

        if (error.response) {
            const status = error.response.status;
            let message = 'AI service error';

            if (status === 401) {
                message = 'Invalid API key';
            } else if (status === 429) {
                message = 'Rate limit exceeded';
            } else if (status >= 500) {
                message = 'AI service temporarily unavailable';
            }

            return res.status(status).json({
                error: 'AI Service Error',
                message: message
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to generate experience points'
        });
    }
});

app.post('/api/ai/education', async (req, res) => {
    try {
        const { eduSchool, eduDegree } = req.body;

        if (!eduSchool || !eduDegree || typeof eduSchool !== 'string' || typeof eduDegree !== 'string') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'School name and degree are required and must be strings'
            });
        }

        const prompt = `Generate exactly 4 powerful, resume-ready education points for: "${eduDegree}" at "${eduSchool}". 
        
        Requirements:
        - Focus on academic achievements, projects, research, leadership roles, and relevant activities
        - Use strong action verbs like "Completed", "Led", "Developed", "Researched", "Organized", "Achieved", "Graduated", "Participated"
        - Make each point specific and measurable with numbers/percentages where possible
        - Keep each point concise and impactful (1 sentence max)
        - Use professional resume language
        - Make points powerful but realistic
        - The generated points should be in the same language as the degree/school
        - The points should be small and concise, maximum 15 words, and should contain numbers/percentages where possible
        
        Format: Return exactly 4 points, each on a new line, starting with "• " (bullet point). Example:
        • Graduated with First Class Honours (GPA 3.8/4.0) in Computer Science
        • Led student council as President and organized 15+ campus events
        • Completed capstone project developing AI-powered recommendation system
        • Published research paper on machine learning algorithms in university journal`;

        const response = await axios.post(process.env.OPENROUTER_BASE_URL + '/chat/completions', {
            model: process.env.AI_MODEL,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.CORS_ORIGIN,
                'X-Title': 'Resume Builder AI'
            }
        });

        const aiResponse = response.data.choices[0].message.content;
        res.json({ success: true, data: aiResponse });

    } catch (error) {
        console.error('AI Education Generation Error:', error);

        if (error.response) {
            const status = error.response.status;
            let message = 'AI service error';

            if (status === 401) {
                message = 'Invalid API key';
            } else if (status === 429) {
                message = 'Rate limit exceeded';
            } else if (status >= 500) {
                message = 'AI service temporarily unavailable';
            }

            return res.status(status).json({
                error: 'AI Service Error',
                message: message
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to generate education points'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Resume Builder AI Proxy Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} requests per ${(process.env.RATE_LIMIT_WINDOW_MS || 900000) / 1000 / 60} minutes`);
    console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'https://lightyellow-heron-963716.hostingersite.com'}`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
}); 