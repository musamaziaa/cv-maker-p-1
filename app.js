const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// CORS setup: allow local dev and production frontend
app.use(cors({
    origin: [
        'http://localhost:5500', // for local dev
        'https://musamaziaa.github.io/cv-maker-p-1' // GitHub Pages frontend URL (no trailing slash)
        // 'https://your-backend-host.com'   // TODO: Add your backend URL if needed
    ]
}));
app.use(express.json({ limit: '2mb' }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/', (req, res) => {
    res.status(200).send('CV Generator backend is running.');
});

// Helper: Read template HTML
function readTemplate(templateName) {
    const allowed = ['template1', 'template2', 'template3', 'template4', 'template5'];
    const safeName = allowed.includes(templateName) ? templateName : 'template1';
    const filePath = path.join(__dirname, `${safeName}.html`);
    return fs.readFileSync(filePath, 'utf8');
}

// POST /api/chat: Generate CV using AI and selected template
app.post('/api/chat', async (req, res) => {
    try {
        const { userData, templateName } = req.body;
        if (!userData || typeof userData !== 'object') {
            return res.status(400).json({ error: 'Missing or invalid userData' });
        }
        // Read template HTML
        const templateHtml = readTemplate(templateName);
        // Build prompt for AI
        const prompt = `You are a professional CV generator. Here is an HTML CV template. Using ONLY the provided user info, generate a CV in this style. The CV should cover the whole page and be exactly one full page (A4) in length. Only include fields that are provided. Do not invent data. Use the same structure and styling as the template.\n\nTEMPLATE:\n${templateHtml}\n\nUSER DATA:\n${JSON.stringify(userData, null, 2)}`;
        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    { role: 'system', content: 'You are a professional CV generator.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1800
            })
        });
        if (!response.ok) {
            const err = await response.text();
            return res.status(response.status).json({ error: err });
        }
        const data = await response.json();
        const aiHtml = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        res.json({ html: aiHtml });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// POST /api/generateWorkExperience: Generate only work experience bullet points
app.post('/api/generateWorkExperience', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    { role: 'system', content: 'You are a professional CV maker. Generate only bullet points for work experience.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 512
            })
        });
        if (!response.ok) {
            const err = await response.text();
            return res.status(response.status).json({ error: err });
        }
        const data = await response.json();
        const aiMessage = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        res.json({ workExperience: aiMessage });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// Vercel compatibility
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} 