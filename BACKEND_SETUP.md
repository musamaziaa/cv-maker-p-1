# Resume Builder - Secure Backend Setup

This guide explains how to set up the secure Node.js backend proxy for the Resume Builder AI features.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the `config.env` file and update it with your settings:
```bash
cp config.env .env
```

**Important**: Update the `OPENROUTER_API_KEY` in the `.env` file with your actual API key.

### 3. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Required |
| `OPENROUTER_BASE_URL` | OpenRouter API base URL | `https://openrouter.ai/api/v1` |
| `AI_MODEL` | AI model to use | `mistralai/mistral-7b-instruct:free` |
| `PORT` | Backend server port | `3000` |
| `CORS_ORIGIN` | Frontend URL | `https://lightyellow-heron-963716.hostingersite.com` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `10` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |

## 🔒 Security Features

### 1. **API Key Protection**
- API keys are stored securely on the backend
- Frontend never sees or handles API keys directly
- Environment variables for sensitive configuration

### 2. **Rate Limiting**
- Configurable rate limiting per IP address
- Default: 10 requests per 15 minutes
- Prevents abuse and controls costs

### 3. **Input Validation**
- All inputs are validated on the backend
- Type checking and sanitization
- Prevents malicious requests

### 4. **CORS Protection**
- Configured CORS to only allow your frontend domain
- Prevents unauthorized cross-origin requests

### 5. **Security Headers**
- Helmet.js for security headers
- Protection against common web vulnerabilities

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and configuration info.

### AI Generation Endpoints

#### Achievements
```
POST /api/ai/achievements
Content-Type: application/json

{
  "achievementTitle": "Software Engineer at Google"
}
```

#### Experience
```
POST /api/ai/experience
Content-Type: application/json

{
  "expTitle": "Senior Developer",
  "expOrganization": "Microsoft"
}
```

#### Education
```
POST /api/ai/education
Content-Type: application/json

{
  "eduSchool": "Stanford University",
  "eduDegree": "Computer Science"
}
```

## 🚨 Error Handling

The backend provides detailed error messages:

- **400**: Invalid input data
- **401**: Invalid API key
- **429**: Rate limit exceeded
- **500**: Internal server error

## 🔄 Frontend Integration

The frontend has been updated to use the secure backend:

1. **Health Check**: Verifies backend availability before making requests
2. **Error Handling**: Displays user-friendly error messages
3. **Loading States**: Shows progress during AI generation

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

### Logs
Check the console for detailed logs including:
- Server startup information
- API request logs
- Error details
- Rate limiting information

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a proper `.env` file (not `config.env`)
3. Configure proper CORS origins
4. Set up reverse proxy (nginx/apache) if needed

### Security Checklist
- [ ] API key is secure and not in version control
- [ ] CORS is properly configured for production domain
- [ ] Rate limiting is appropriate for your use case
- [ ] HTTPS is enabled
- [ ] Proper logging is configured

## 🔍 Troubleshooting

### Common Issues

1. **"AI service is not available"**
   - Check if backend server is running on port 3000
   - Verify the health check endpoint: `http://localhost:3000/api/health`

2. **"Invalid API key"**
   - Verify your OpenRouter API key in the `.env` file
   - Check if the key has sufficient credits

3. **"Rate limit exceeded"**
   - Wait for the rate limit window to reset
   - Adjust rate limiting settings if needed

4. **CORS errors**
   - Verify `CORS_ORIGIN` matches your frontend URL
   - Check browser console for detailed CORS errors

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 📝 License

This backend is part of the Resume Builder project and follows the same license terms. 