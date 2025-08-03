#!/usr/bin/env node

/**
 * Deployment Configuration Script
 * Run this script to update your application for production deployment
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    // Update these values for your production deployment
    production: {
        backendUrl: 'https://cv-maker-p-1-production.up.railway.app',
        frontendUrl: 'https://lightyellow-heron-963716.hostingersite.com'
    },
    development: {
        backendUrl: 'http://localhost:3000',
        frontendUrl: 'http://localhost:8000'
    }
};

function updateFile(filePath, oldUrl, newUrl) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Replace URLs
        content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
        return false;
    }
}

function updateConfigEnv(backendUrl) {
    const configPath = path.join(__dirname, 'config.env');
    const envPath = path.join(__dirname, '.env');

    try {
        // Read config.env
        let content = fs.readFileSync(configPath, 'utf8');

        // Update CORS_ORIGIN
        content = content.replace(
            /CORS_ORIGIN=.*/,
            `CORS_ORIGIN=${backendUrl.replace('/api/ai', '')}`
        );

        // Update NODE_ENV
        content = content.replace(
            /NODE_ENV=.*/,
            'NODE_ENV=production'
        );

        // Write to .env
        fs.writeFileSync(envPath, content, 'utf8');
        console.log(`✅ Created: ${envPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error updating config:`, error.message);
        return false;
    }
}

function main() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'production';

    if (!['production', 'development'].includes(mode)) {
        console.error('❌ Invalid mode. Use "production" or "development"');
        process.exit(1);
    }

    const currentConfig = config[mode];

    console.log(`🚀 Updating configuration for ${mode} mode...`);
    console.log(`Backend URL: ${currentConfig.backendUrl}`);
    console.log(`Frontend URL: ${currentConfig.frontendUrl}`);
    console.log('');

    let updatedFiles = 0;

    // Update AI config
    const aiConfigPath = path.join(__dirname, 'assets', 'js', 'ai-config.js');
    if (updateFile(aiConfigPath, config.development.backendUrl, currentConfig.backendUrl)) {
        updatedFiles++;
    }

    // Update resume.html (health check URLs)
    const resumePath = path.join(__dirname, 'resume.html');
    if (updateFile(resumePath, config.development.backendUrl, currentConfig.backendUrl)) {
        updatedFiles++;
    }

    // Update config.env for backend
    if (mode === 'production') {
        if (updateConfigEnv(currentConfig.backendUrl)) {
            updatedFiles++;
        }
    }

    console.log('');
    console.log(`🎉 Configuration update complete!`);
    console.log(`Updated ${updatedFiles} files for ${mode} deployment.`);

    if (mode === 'production') {
        console.log('');
        console.log('📋 Next steps:');
        console.log('1. Update the backend URL in config.env with your actual domain');
        console.log('2. Deploy backend to your VPS/Node.js hosting');
        console.log('3. Upload frontend files to Hostinger');
        console.log('4. Test all features');
        console.log('');
        console.log('📖 See HOSTINGER_DEPLOYMENT.md for detailed instructions');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { config, updateFile, updateConfigEnv }; 