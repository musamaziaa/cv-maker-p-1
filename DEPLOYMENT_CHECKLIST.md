# 🚀 Quick Deployment Checklist

## Before Deployment

### ✅ Backend Setup
- [ ] Choose backend hosting (VPS, Railway, Render, etc.)
- [ ] Get your backend domain/URL: https://cv-maker-p-1-production.up.railway.app
- [ ] Update `deploy-config.js` with your backend URL ✅
- [ ] Run deployment script: `node deploy-config.js production` ✅

### ✅ Frontend Setup
- [ ] Get your Hostinger domain: https://lightyellow-heron-963716.hostingersite.com
- [ ] Enable SSL certificate on Hostinger
- [ ] Prepare all frontend files for upload

## Deployment Steps

### 🔧 Backend Deployment
1. **Upload backend files** to your server:
   - `server.js`
   - `package.json`
   - `.env` (created by deploy script)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Test backend**:
   ```bash
   curl https://your-backend-domain.com/api/health
   ```

### 🌐 Frontend Deployment
1. **Upload files** to Hostinger:
   - All HTML files
   - `assets/` folder
   - `favicon.ico`

2. **Test frontend**:
   - Visit your domain
   - Test AI generation features
   - Check browser console for errors

## 🔒 Security Checklist

- [ ] API key is in backend `.env` file only
- [ ] CORS_ORIGIN matches your frontend domain
- [ ] SSL certificates are active
- [ ] Rate limiting is configured
- [ ] All URLs use HTTPS

## 🧪 Testing Checklist

- [ ] Backend health check works
- [ ] AI generation for achievements works
- [ ] AI generation for experience works
- [ ] AI generation for education works
- [ ] No CORS errors in browser console
- [ ] No mixed content errors
- [ ] Rate limiting works properly

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Check CORS_ORIGIN in backend |
| API key errors | Verify key in backend .env |
| SSL errors | Ensure both frontend/backend use HTTPS |
| Rate limit errors | Increase limits or wait |

## 📞 Quick Commands

```bash
# Update for production
node deploy-config.js production

# Test backend health
curl https://your-backend-domain.com/api/health

# Test AI endpoint
curl -X POST https://your-backend-domain.com/api/ai/achievements \
  -H "Content-Type: application/json" \
  -d '{"achievementTitle": "Test"}'
```

## 🎯 Success Indicators

- ✅ Backend responds to health check
- ✅ AI generation works from frontend
- ✅ No errors in browser console
- ✅ SSL certificate is valid
- ✅ All features work as expected

Your Resume Builder is now live and secure! 🎉 