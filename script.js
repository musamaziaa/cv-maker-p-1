let currentStep = 1;
const totalSteps = 5; // Updated to 5 steps

// Add at the top of the file (after any imports or variable declarations)
const BASE_URL =
    location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://cv-maker-p-1-production.up.railway.app';

// Form data storage - EXPANDED
let formData = {
    // Basic Info
    name: '',
    title: '',
    phone: '',
    email: '',
    location: '',
    summary: '',
    // Links (all optional)
    linkedin: '',
    github: '',
    portfolio: '',
    // Photo
    photo: null,
    // Skills
    soft_skills: '',
    spoken_languages: '',
    // Work Experience
    role: '',
    company: '',
    start_date: '',
    end_date: '',
    work: '',
    // Education
    degree: '',
    school: '',
    graduation_year: '',
    // Projects (no tech stack)
    project1_title: '',
    project1_link: '',
    project1_description: '',
    project2_title: '',
    project2_link: '',
    project2_description: '',
};

// Add global variable for selected template
let selectedTemplate = 'template1';

// Add Choose a Template button to the UI
function addChooseTemplateButton() {
    const previewArea = document.getElementById('cvPreviewArea');
    if (!previewArea) return;
    let btn = document.getElementById('chooseTemplateBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'chooseTemplateBtn';
        btn.className = 'btn-generate';
        btn.style = 'margin-bottom: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; border: none; border-radius: 25px; cursor: pointer; font-size: 16px;';
        btn.innerText = 'Choose a template';
        btn.onclick = showTemplateModal;
        previewArea.parentNode.insertBefore(btn, previewArea);
    }
}

// Show template selection modal
function showTemplateModal() {
    let modal = document.getElementById('templateModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'templateModal';
        modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:white;padding:32px 24px;border-radius:12px;min-width:320px;max-width:90vw;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;">
                <h2 style='margin-bottom:20px;'>Choose a CV Template</h2>
                <div style='display:flex;flex-direction:column;gap:16px;'>
                    <button class='template-btn' data-template='template1'>Template 1</button>
                    <button class='template-btn' data-template='template2'>Template 2</button>
                    <button class='template-btn' data-template='template3'>Template 3</button>
                    <button class='template-btn' data-template='template4'>Template 4</button>
                    <button class='template-btn' data-template='template5'>Template 5</button>
                </div>
                <button style='margin-top:24px;' onclick='document.getElementById("templateModal").remove()'>Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Add event listeners
        modal.querySelectorAll('.template-btn').forEach(btn => {
            btn.onclick = function () {
                selectedTemplate = this.getAttribute('data-template');
                document.getElementById('templateModal').remove();
                alert('Selected ' + selectedTemplate.replace('template', 'Template '));
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');

    // Handle photo upload
    photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            formData.photo = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 8px;">`;
                reader.readAsDataURL(file);
            }
        } else {
            formData.photo = null;
            photoPreview.innerHTML = '';
        }
    });
    // Handle all form inputs
    const formFields = [
        'name', 'title', 'phone', 'email', 'location', 'summary',
        'linkedin', 'github', 'portfolio',
        'soft_skills', 'spoken_languages',
        'role', 'company', 'start_date', 'end_date', 'work',
        'degree', 'school', 'graduation_year',
        'project1_title', 'project1_link', 'project1_description',
        'project2_title', 'project2_link', 'project2_description'
    ];

    formFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('input', function (e) {
                formData[fieldId] = e.target.value;
            });
        }
    });
});

// Navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

function updateStep() {
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = progressPercentage + '%';

    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });

    // Show/hide wizard steps
    const wizardSteps = document.querySelectorAll('.wizard-step');
    wizardSteps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    // If we're on the final step, populate confirmation
    if (currentStep === 4) {
        populateConfirmation();
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            const name = document.getElementById('name').value.trim();
            const title = document.getElementById('title').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const location = document.getElementById('location').value.trim();
            const summary = document.getElementById('summary').value.trim();
            if (!name) {
                alert('Please enter your full name');
                return false;
            }
            if (!title) {
                alert('Please enter your professional title');
                return false;
            }
            if (!phone) {
                alert('Please enter your phone number');
                return false;
            }
            if (!email) {
                alert('Please enter your email address');
                return false;
            }
            if (!location) {
                alert('Please enter your location');
                return false;
            }
            if (!summary) {
                alert('Please enter your personal summary');
                return false;
            }
            // Links are optional
            break;
        case 2:
            // Photo, soft_skills, spoken_languages are all optional
            break;
        case 3:
            const role = document.getElementById('role').value.trim();
            const work = document.getElementById('work').value.trim();
            const degree = document.getElementById('degree').value.trim();
            const school = document.getElementById('school').value.trim();
            if (!role) {
                alert('Please enter your role/position');
                return false;
            }
            if (!work) {
                alert('Please describe your work experience');
                return false;
            }
            if (!degree) {
                alert('Please enter your degree/certificate');
                return false;
            }
            if (!school) {
                alert('Please enter your school/university');
                return false;
            }
            break;
    }
    return true;
}

// Add a function to filter out empty fields (except required ones)
function getFilteredFormData() {
    // List of required fields
    const requiredFields = [
        'name', 'title', 'phone', 'email', 'location', 'summary',
        'role', 'work', 'degree', 'school'
    ];
    const filtered = {};
    for (const [key, value] of Object.entries(formData)) {
        if (requiredFields.includes(key)) {
            filtered[key] = value;
        } else if ((typeof value === 'string' && value.trim() !== '') || (typeof value !== 'string' && value)) {
            filtered[key] = value;
        }
    }
    return filtered;
}

function populateConfirmation() {
    // Basic Info
    document.getElementById('confirmName').textContent = formData.name || '--';
    document.getElementById('confirmTitle').textContent = formData.title || '--';
    document.getElementById('confirmPhone').textContent = formData.phone || '--';
    document.getElementById('confirmEmail').textContent = formData.email || '--';
    document.getElementById('confirmLocation').textContent = formData.location || '--';
    // Photo (optional)
    const confirmPhotoRow = document.getElementById('confirmPhoto').parentElement;
    if (formData.photo) {
        document.getElementById('confirmPhoto').textContent = 'Uploaded';
        confirmPhotoRow.style.display = '';
    } else {
        confirmPhotoRow.style.display = 'none';
    }
    // Summary
    document.getElementById('confirmSummary').textContent = formData.summary || '--';
    // Links (optional)
    const linkedinRow = document.getElementById('confirmLinkedin').parentElement;
    const githubRow = document.getElementById('confirmGithub').parentElement;
    const portfolioRow = document.getElementById('confirmPortfolio').parentElement;
    if (formData.linkedin && formData.linkedin.trim() !== '') {
        document.getElementById('confirmLinkedin').textContent = formData.linkedin;
        linkedinRow.style.display = '';
    } else {
        linkedinRow.style.display = 'none';
    }
    if (formData.github && formData.github.trim() !== '') {
        document.getElementById('confirmGithub').textContent = formData.github;
        githubRow.style.display = '';
    } else {
        githubRow.style.display = 'none';
    }
    if (formData.portfolio && formData.portfolio.trim() !== '') {
        document.getElementById('confirmPortfolio').textContent = formData.portfolio;
        portfolioRow.style.display = '';
    } else {
        portfolioRow.style.display = 'none';
    }
    // Skills (optional)
    const softSkillsRow = document.getElementById('confirmSoftSkills').parentElement;
    if (formData.soft_skills && formData.soft_skills.trim() !== '') {
        document.getElementById('confirmSoftSkills').textContent = formData.soft_skills;
        softSkillsRow.style.display = '';
    } else {
        softSkillsRow.style.display = 'none';
    }
    const languagesRow = document.getElementById('confirmLanguages').parentElement;
    if (formData.spoken_languages && formData.spoken_languages.trim() !== '') {
        document.getElementById('confirmLanguages').textContent = formData.spoken_languages;
        languagesRow.style.display = '';
    } else {
        languagesRow.style.display = 'none';
    }
    // Frameworks and Tools are not in minimal form, so hide them
    document.getElementById('confirmFrameworks').parentElement.style.display = 'none';
    document.getElementById('confirmTools').parentElement.style.display = 'none';
    // Work Experience
    document.getElementById('confirmRole').textContent = formData.role || '--';
    document.getElementById('confirmCompany').textContent = formData.company || '--';
    // Duration
    let duration = '';
    if (formData.start_date && formData.end_date) {
        duration = `${formData.start_date} - ${formData.end_date}`;
    } else if (formData.start_date) {
        duration = `${formData.start_date} - Present`;
    } else {
        duration = '';
    }
    document.getElementById('confirmDuration').textContent = duration || '--';
    document.getElementById('confirmWork').innerHTML = formData.work ? formData.work.replace(/\n/g, '<br>') : '--';
    // Education
    document.getElementById('confirmDegree').textContent = formData.degree || '--';
    document.getElementById('confirmSchool').textContent = formData.school || '--';
    document.getElementById('confirmGradYear').textContent = formData.graduation_year || '--';
}



// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate AI work experience points
async function generateAIWorkExperience() {
    const role = formData.role.trim();
    if (!role) {
        alert('Please enter your role/position first');
        return;
    }

    const generateBtn = document.getElementById('generateAIBtn');
    const aiStatus = document.getElementById('aiStatus');
    const workTextarea = document.getElementById('work');

    try {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = 'Generating AI points...';
        aiStatus.textContent = 'Generating work experience points...';
        aiStatus.className = 'ai-status loading';

        // Build a prompt for the AI
        const prompt = `Generate 6 strong, professional, resume-style bullet points for the following job role. Do NOT include headings, name, summary, or any intro—only bullet points. Each bullet should start with a powerful action verb, be under 25 words, and describe impact or value. Do not number the bullets. Use actions words like "Led, Built, Made, etc" \n\nRole: ${role}\nName: ${formData.name || '--'}\nSummary: ${formData.summary || '--'}\nKey Skills: ${formData.soft_skills || ''}, ${formData.spoken_languages || ''}`;

        // Call backend proxy
        const response = await fetch(`${BASE_URL}/api/generateWorkExperience`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = data.workExperience;
        if (aiMessage) {
            // Update the textarea with AI-generated content
            workTextarea.value = aiMessage.trim();
            formData.work = aiMessage.trim();

            aiStatus.textContent = 'AI work experience generated successfully!';
            aiStatus.className = 'ai-status success';
        } else {
            throw new Error('No work experience returned from AI');
        }

    } catch (error) {
        console.error('Error generating AI work experience:', error);

        aiStatus.textContent = `Error: ${error.message}`;
        aiStatus.className = 'ai-status error';

        // Show fallback options
        setTimeout(() => {
            if (confirm('AI generation failed. Would you like to see some example work experience points for your role?')) {
                showExampleWorkExperience(role);
            }
        }, 1000);

    } finally {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Generate AI points for <span id="rolePlaceholder">' + (role || 'your role') + '</span>';
    }
}

// Show example work experience points
function showExampleWorkExperience(role) {
    const examples = getExampleWorkExperience(role);
    const workTextarea = document.getElementById('work');

    if (examples) {
        workTextarea.value = examples;
        formData.work = examples;

        const aiStatus = document.getElementById('aiStatus');
        aiStatus.textContent = 'Example work experience points loaded. Feel free to edit!';
        aiStatus.className = 'ai-status success';
    }
}

// Get example work experience based on role
function getExampleWorkExperience(role) {
    const roleLower = role.toLowerCase();

    if (roleLower.includes('student')) {
        return `• Demonstrated strong academic performance with consistent high grades across all subjects
• Developed excellent time management skills while balancing coursework, extracurricular activities, and part-time work
• Collaborated effectively in team projects, contributing innovative ideas and supporting peers
• Utilized various software applications and digital tools to enhance learning and productivity
• Participated in school clubs and organizations, developing leadership and communication skills
• Completed coursework in [relevant subjects] with practical applications in real-world scenarios
• Maintained excellent attendance record and punctuality throughout academic career`;
    } else if (roleLower.includes('developer') || roleLower.includes('programmer') || roleLower.includes('software')) {
        return `• Developed and maintained web applications using modern technologies including HTML, CSS, JavaScript, and React
• Collaborated with cross-functional teams to design, implement, and deploy software solutions
• Debugged and resolved complex technical issues, improving application performance and user experience
• Participated in code reviews and contributed to team coding standards and best practices
• Utilized version control systems (Git) for collaborative development and project management
• Implemented responsive design principles to ensure applications work across multiple devices
• Stayed current with emerging technologies and industry trends through continuous learning`;
    } else if (roleLower.includes('manager') || roleLower.includes('lead')) {
        return `• Led and managed a team of [X] professionals, providing guidance, mentorship, and performance feedback
• Developed and implemented strategic initiatives that improved operational efficiency by [X]%
• Collaborated with stakeholders across departments to ensure project alignment and successful delivery
• Analyzed market trends and competitor activities to identify business opportunities and risks
• Managed budgets of [X] amount while ensuring optimal resource allocation and cost control
• Established and maintained strong relationships with clients, vendors, and business partners
• Created and executed training programs to enhance team skills and professional development`;
    } else if (roleLower.includes('teacher') || roleLower.includes('educator') || roleLower.includes('instructor')) {
        return `• Designed and delivered engaging lesson plans for [X] students across multiple grade levels
• Implemented differentiated instruction strategies to meet diverse learning needs and abilities
• Utilized technology and multimedia resources to enhance student engagement and learning outcomes
• Collaborated with parents, administrators, and colleagues to support student success
• Assessed student progress through various evaluation methods and provided constructive feedback
• Participated in professional development opportunities to stay current with educational best practices
• Maintained a positive and inclusive classroom environment that promoted student growth and development`;
    } else if (roleLower.includes('marketing') || roleLower.includes('advertising')) {
        return `• Developed and executed comprehensive marketing campaigns that increased brand awareness by [X]%
• Managed social media presence across multiple platforms, growing follower base by [X]%
• Conducted market research and competitive analysis to inform strategic marketing decisions
• Created compelling content for various marketing channels including email, social media, and web
• Collaborated with creative teams to develop marketing materials and promotional campaigns
• Analyzed campaign performance metrics and provided detailed reports to stakeholders
• Built and maintained relationships with media outlets, influencers, and industry partners`;
    } else {
        return `• Demonstrated strong problem-solving skills while handling complex tasks and projects
• Collaborated effectively with team members to achieve common goals and objectives
• Developed excellent communication skills through regular interaction with clients and stakeholders
• Utilized various software applications and tools to improve productivity and workflow efficiency
• Maintained high standards of quality and attention to detail in all work assignments
• Adapted quickly to changing priorities and requirements in a fast-paced environment
• Contributed innovative ideas and solutions that improved processes and outcomes`;
    }
}

// Add a function to generate and show the CV
async function generateAndShowCV() {
    try {
        const preview = document.getElementById('cvPreviewArea');
        preview.innerHTML = '<div style="text-align:center;padding:40px;">Generating your CV...</div>';

        // Prepare prompt base from filtered formData (excluding photo)
        const dataToSend = getFilteredFormData();
        delete dataToSend.photo;
        // Send selectedTemplate to backend
        const response = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userData: dataToSend,
                templateName: selectedTemplate
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const aiHtml = data.html;
        if (aiHtml) {
            window.cvHtmlData = cleanAIHtml(aiHtml);
            renderCVImagePreview(window.cvHtmlData, document.getElementById('cvSinglePreview') || preview);
            preview.innerHTML = `<div style='text-align:center; padding: 20px;'><h2 style="margin-bottom: 20px; color: #333;">Your CV Preview</h2><div id='cvSinglePreview' style='margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;'></div></div>`;
            renderCVImagePreview(window.cvHtmlData, document.getElementById('cvSinglePreview'));
            // Remove any existing button before adding
            const oldBtn = document.getElementById('regenerateCVBtn');
            if (oldBtn) oldBtn.remove();
            addRegenerateCVButton();
        } else {
            throw new Error('No CV returned from AI');
        }

    } catch (error) {
        const preview = document.getElementById('cvPreviewArea');
        preview.innerHTML = `<div style='color:red;text-align:center;'>${error.message}</div>`;
    }
}

// Add Regenerate CV button below the preview
function addRegenerateCVButton() {
    const previewArea = document.getElementById('cvPreviewArea');
    if (!previewArea) return;
    let btn = document.getElementById('regenerateCVBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'regenerateCVBtn';
        btn.className = 'btn-generate';
        btn.style = 'margin: 20px 0 0 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 25px; cursor: pointer; font-size: 16px;';
        btn.innerText = 'Regenerate CV (Next Template)';
        btn.onclick = function () {
            // Cycle to next template
            const templates = ['template1', 'template2', 'template3', 'template4', 'template5'];
            let idx = templates.indexOf(selectedTemplate);
            selectedTemplate = templates[(idx + 1) % templates.length];
            generateAndShowCV();
        };
        previewArea.parentNode.insertBefore(btn, previewArea.nextSibling);
    }
}

// Utility to clean AI HTML output (remove <pre>, <code>, and code block wrappers)
function cleanAIHtml(html) {
    if (!html) return '';
    // Remove triple backtick code blocks
    html = html.replace(/^```(?:html)?[\r\n]+([\s\S]*?)```$/im, '$1');
    // Remove <pre> and <code> wrappers
    html = html.replace(/^<pre[^>]*>/i, '').replace(/<\/pre>$/i, '');
    html = html.replace(/^<code[^>]*>/i, '').replace(/<\/code>$/i, '');
    return html.trim();
}

function renderCVImagePreview(html, previewDiv) {
    // Remove any previous image or content
    previewDiv.innerHTML = '<div style="padding: 40px; text-align: center;">Rendering your beautiful CV...</div>';

    // Create a hidden container for rendering with A4 dimensions
    const hidden = document.createElement('div');
    hidden.innerHTML = html;
    // A4 dimensions: 210mm x 297mm, using 794px x 1123px for screen rendering
    hidden.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 794px; height: 1123px; background: white; overflow: hidden; z-index: -1000;';
    document.body.appendChild(hidden);

    // Wait for DOM to render and styles to apply
    setTimeout(() => {
        html2canvas(hidden, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            width: 794,
            height: 1123,
            windowWidth: 794,
            windowHeight: 1123
        }).then(canvas => {
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');
            img.alt = 'CV Preview';
            img.style.cssText = `
                max-width: 100%;
                max-height: 80vh;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                border-radius: 8px;
                margin: 0 auto;
                display: block;
                border: 1px solid #e0e0e0;
            `;
            previewDiv.innerHTML = '';
            previewDiv.appendChild(img);

            // Store the image data for PDF download
            window.cvImageData = img.src;

            // Clean up
            document.body.removeChild(hidden);
        }).catch((error) => {
            console.error('Error rendering CV:', error);
            previewDiv.innerHTML = '<div style="color:red; padding: 40px;">Failed to render preview. Please try regenerating.</div>';
            if (document.body.contains(hidden)) {
                document.body.removeChild(hidden);
            }
        });
    }, 1000); // Increased timeout to 1 second to ensure content is rendered
}

// Helper to download a PDF from HTML with proper A4 formatting
function downloadCVFromHtml(html) {
    if (!html) {
        alert('CV not available. Please generate first.');
        return;
    }

    // Create a container with A4 dimensions
    const container = document.createElement('div');
    container.innerHTML = html;
    // Set to A4 size: 210mm x 297mm
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 210mm;
        min-height: 297mm;
        background: white;
        padding: 20px;
        overflow: visible;
        z-index: 10000;
        color: black;
        display: block;
    `;
    document.body.appendChild(container);

    // Wait for content to render and check length
    setTimeout(() => {
        if (container.innerText.trim().length < 10) {
            alert('CV content is empty or not fully loaded. Please try again.');
            document.body.removeChild(container);
            return;
        }
        const userName = formData.name ? formData.name.replace(/\s+/g, '_') : 'CV';
        const options = {
            margin: 0.5, // Small margin
            filename: `${userName}_CV.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: container.scrollWidth,
                height: container.scrollHeight
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        html2pdf().set(options).from(container).save().then(() => {
            document.body.removeChild(container);
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;
            successMsg.textContent = '✅ PDF downloaded successfully!';
            document.body.appendChild(successMsg);
            setTimeout(() => document.body.removeChild(successMsg), 3000);
        }).catch((error) => {
            console.error('PDF generation error:', error);
            if (document.body.contains(container)) document.body.removeChild(container);
            alert('PDF generation failed. Please try again or use the print option.');
        });
    }, 500);
}

// Escape HTML for safe insertion
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Main download function - uses HTML to PDF
function downloadCV() {
    if (!window.cvHtmlData) {
        alert('Please generate your CV first.');
        return;
    }
    downloadCVFromHtml(window.cvHtmlData);
}



// Update openPrintWindow to use the single CV
function openPrintWindow() {
    if (!window.cvHtmlData) {
        alert('Please generate your CV first.');
        return;
    }
    const userName = formData.name || 'CV';
    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${userName} CV</title>
            <style>
                body { font-family: Arial; margin: 20px; color: #000; }
                @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
                .instructions { background: #f0f9ff; padding: 20px; margin-bottom: 20px; border-radius: 8px; text-align: center; }
                .btn { background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
            </style>
        </head>
        <body>
            <div class="instructions no-print">
                <h3>Save as PDF</h3>
                <p>Click Print below, then choose "Save as PDF"</p>
                <button class="btn" onclick="window.print()">Print</button>
                <button class="btn" onclick="window.close()">Close</button>
            </div>
            <div>${window.cvHtmlData}</div>
        </body>
        </html>
    `);
    printWin.document.close();
    printWin.focus();
}

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        nextStep();
    } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        prevStep();
    }
});