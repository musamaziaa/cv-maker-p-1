// regex for validation
const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

const mainForm = document.getElementById('cv-form');
const validType = {
    TEXT: 'text',
    TEXT_EMP: 'text_emp',
    EMAIL: 'email',
    DIGIT: 'digit',
    PHONENO: 'phoneno',
    ANY: 'any',
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;

    // Play sound based on notification type
    try {
        const audio = new Audio();
        if (type === 'success') {
            audio.src = 'assets/sounds/success_sound.mp3';
        } else if (type === 'error') {
            audio.src = 'assets/sounds/error_sound.mp3';
        }
        audio.volume = 0.5; // Set volume to 50%
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
        console.log('Audio not available:', error);
    }

    // Set colors based on notification type
    let backgroundColor, borderColor;
    switch (type) {
        case 'success':
            backgroundColor = '#4CAF50';
            borderColor = '#45a049';
            break;
        case 'error':
            backgroundColor = '#f44336';
            borderColor = '#d32f2f';
            break;
        default:
            backgroundColor = '#2196F3';
            borderColor = '#1976D2';
    }

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: -400px;
        background: ${backgroundColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 1.4rem;
        font-weight: 500;
        z-index: 9999;
        transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        max-width: 350px;
        border-left: 4px solid ${borderColor};
    `;

    document.body.appendChild(notification);

    // Slide in from left
    setTimeout(() => {
        notification.style.left = '20px';
    }, 100);

    // Slide out after 4 seconds
    setTimeout(() => {
        notification.style.left = '-400px';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// user inputs elements
let firstnameElem = mainForm.firstname,
    middlenameElem = mainForm.middlename,
    lastnameElem = mainForm.lastname,
    imageElem = mainForm.image,
    designationElem = mainForm.designation,
    addressElem = mainForm.address,
    emailElem = mainForm.email,
    phonenoElem = mainForm.phoneno,
    summaryElem = mainForm.summary;

// display elements
let nameDsp = document.getElementById('fullname_dsp'),
    imageDsp = document.getElementById('image_dsp'),
    phonenoDsp = document.getElementById('phoneno_dsp'),
    emailDsp = document.getElementById('email_dsp'),
    addressDsp = document.getElementById('address_dsp'),
    designationDsp = document.getElementById('designation_dsp'),
    summaryDsp = document.getElementById('summary_dsp'),
    projectsDsp = document.getElementById('projects_dsp'),
    achievementsDsp = document.getElementById('achievements_dsp'),
    skillsDsp = document.getElementById('skills_dsp'),
    educationsDsp = document.getElementById('educations_dsp'),
    experiencesDsp = document.getElementById('experiences_dsp');

// first value is for the attributes and second one passes the nodelists
const fetchValues = (attrs, ...nodeLists) => {
    let elemsAttrsCount = nodeLists.length;
    let elemsDataCount = nodeLists[0].length;
    let tempDataArr = [];

    // first loop deals with the no of repeaters value
    for (let i = 0; i < elemsDataCount; i++) {
        let dataObj = {}; // creating an empty object to fill the data
        // second loop fetches the data for each repeaters value or attributes 
        for (let j = 0; j < elemsAttrsCount; j++) {
            // setting the key name for the object and fill it with data
            dataObj[`${attrs[j]}`] = nodeLists[j][i].value;
        }
        tempDataArr.push(dataObj);
    }

    return tempDataArr;
}

const getUserInputs = () => {

    // achivements 
    let achievementsTitleElem = document.querySelectorAll('.achieve_title'),
        achievementsDescriptionElem = document.querySelectorAll('.achieve_description');

    // experiences
    let expTitleElem = document.querySelectorAll('.exp_title'),
        expOrganizationElem = document.querySelectorAll('.exp_organization'),
        expLocationElem = document.querySelectorAll('.exp_location'),
        expStartDateElem = document.querySelectorAll('.exp_start_date'),
        expEndDateElem = document.querySelectorAll('.exp_end_date'),
        expDescriptionElem = document.querySelectorAll('.exp_description');

    // education
    let eduSchoolElem = document.querySelectorAll('.edu_school'),
        eduDegreeElem = document.querySelectorAll('.edu_degree'),
        eduCityElem = document.querySelectorAll('.edu_city'),
        eduStartDateElem = document.querySelectorAll('.edu_start_date'),
        eduGraduationDateElem = document.querySelectorAll('.edu_graduation_date'),
        eduDescriptionElem = document.querySelectorAll('.edu_description');

    let projTitleElem = document.querySelectorAll('.proj_title'),
        projLinkElem = document.querySelectorAll('.proj_link'),
        projDescriptionElem = document.querySelectorAll('.proj_description');

    let skillElem = document.querySelectorAll('.skill');

    // event listeners for form validation
    firstnameElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.TEXT, 'First Name'));
    middlenameElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.TEXT_EMP, 'Middle Name'));
    lastnameElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.TEXT, 'Last Name'));
    phonenoElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.PHONENO, 'Phone Number'));
    emailElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.EMAIL, 'Email'));
    addressElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Address'));
    designationElem.addEventListener('keyup', (e) => validateFormData(e.target, validType.TEXT, 'Designation'));

    achievementsTitleElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Title')));
    achievementsDescriptionElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Description')));
    expTitleElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Title')));
    expOrganizationElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Organization')));
    expLocationElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, "Location")));
    expStartDateElem.forEach(item => item.addEventListener('blur', (e) => validateFormData(e.target, validType.ANY, 'End Date')));
    expEndDateElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'End Date')));
    expDescriptionElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Description')));
    eduSchoolElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'School')));
    eduDegreeElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Degree')));
    eduCityElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'City')));
    eduStartDateElem.forEach(item => item.addEventListener('blur', (e) => validateFormData(e.target, validType.ANY, 'Start Date')));
    eduGraduationDateElem.forEach(item => item.addEventListener('blur', (e) => validateFormData(e.target, validType.ANY, 'Graduation Date')));
    eduDescriptionElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Description')));
    projTitleElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Title')));
    projLinkElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Link')));
    projDescriptionElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'Description')));
    skillElem.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, validType.ANY, 'skill')));

    return {
        firstname: firstnameElem.value,
        middlename: middlenameElem.value,
        lastname: lastnameElem.value,
        designation: designationElem.value,
        address: addressElem.value,
        email: emailElem.value,
        phoneno: phonenoElem.value,
        summary: summaryElem.value,
        achievements: fetchValues(['achieve_title', 'achieve_description'], achievementsTitleElem, achievementsDescriptionElem),
        experiences: fetchValues(['exp_title', 'exp_organization', 'exp_location', 'exp_start_date', 'exp_end_date', 'exp_description'], expTitleElem, expOrganizationElem, expLocationElem, expStartDateElem, expEndDateElem, expDescriptionElem),
        educations: fetchValues(['edu_school', 'edu_degree', 'edu_city', 'edu_start_date', 'edu_graduation_date', 'edu_description'], eduSchoolElem, eduDegreeElem, eduCityElem, eduStartDateElem, eduGraduationDateElem, eduDescriptionElem),
        projects: fetchValues(['proj_title', 'proj_link', 'proj_description'], projTitleElem, projLinkElem, projDescriptionElem),
        skills: fetchValues(['skill'], skillElem)
    }
};

function validateFormData(elem, elemType, elemName) {
    // checking for text string and non empty string
    if (elemType == validType.TEXT) {
        if (!strRegex.test(elem.value) || elem.value.trim().length == 0) addErrMsg(elem, elemName);
        else removeErrMsg(elem);
    }

    // checking for only text string
    if (elemType == validType.TEXT_EMP) {
        if (!strRegex.test(elem.value)) addErrMsg(elem, elemName);
        else removeErrMsg(elem);
    }

    // checking for email
    if (elemType == validType.EMAIL) {
        if (!emailRegex.test(elem.value) || elem.value.trim().length == 0) addErrMsg(elem, elemName);
        else removeErrMsg(elem);
    }

    // checking for phone number
    if (elemType == validType.PHONENO) {
        if (!phoneRegex.test(elem.value) || elem.value.trim().length == 0) addErrMsg(elem, elemName);
        else removeErrMsg(elem);
    }

    // checking for only empty
    if (elemType == validType.ANY) {
        if (elem.value.trim().length == 0) addErrMsg(elem, elemName);
        else removeErrMsg(elem);
    }
}

// adding the invalid text
function addErrMsg(formElem, formElemName) {
    formElem.nextElementSibling.innerHTML = `${formElemName} is invalid`;
}

// removing the invalid text 
function removeErrMsg(formElem) {
    formElem.nextElementSibling.innerHTML = "";
}

// show the list data
const showListData = (listData, listContainer) => {
    listContainer.innerHTML = "";

    // Special handling for achievements
    if (listContainer.id === 'achievements_dsp') {
        listData.forEach(listItem => {
            let itemElem = document.createElement('div');
            itemElem.classList.add('preview-item');

            // Create title element
            if (listItem.achieve_title) {
                let titleElem = document.createElement('div');
                titleElem.classList.add('preview-item-title');
                titleElem.innerHTML = `<strong>${listItem.achieve_title}</strong>`;
                itemElem.appendChild(titleElem);
            }

            // Create bullet points from description
            if (listItem.achieve_description) {
                let pointsContainer = document.createElement('div');
                pointsContainer.classList.add('preview-item-points');

                // Split description by bullet points or new lines
                let points = listItem.achieve_description
                    .split(/[•\n]/)
                    .map(point => point.trim())
                    .filter(point => point.length > 0)
                    .slice(0, 4); // Limit to 4 points as requested

                // If no bullet points found, split by sentences
                if (points.length === 0) {
                    points = listItem.achieve_description
                        .split(/[.!?]+/)
                        .map(point => point.trim())
                        .filter(point => point.length > 0)
                        .slice(0, 4);
                }

                // Create bullet points
                points.forEach(point => {
                    let pointElem = document.createElement('div');
                    pointElem.classList.add('preview-item-point');
                    pointElem.innerHTML = `• ${point}`;
                    pointsContainer.appendChild(pointElem);
                });

                itemElem.appendChild(pointsContainer);
            }

            listContainer.appendChild(itemElem);
        });
    }
    // Special handling for experiences
    else if (listContainer.id === 'experiences_dsp') {
        listData.forEach(listItem => {
            let itemElem = document.createElement('div');
            itemElem.classList.add('preview-item');

            // Create header with title, organization, location, and dates
            let headerElem = document.createElement('div');
            headerElem.classList.add('preview-item-header');

            if (listItem.exp_title) {
                let titleElem = document.createElement('span');
                titleElem.classList.add('preview-item-title');
                titleElem.innerHTML = `<strong>${listItem.exp_title}</strong>`;
                headerElem.appendChild(titleElem);
            }

            if (listItem.exp_organization) {
                let orgElem = document.createElement('span');
                orgElem.classList.add('preview-item-organization');
                orgElem.innerHTML = listItem.exp_organization;
                headerElem.appendChild(orgElem);
            }

            if (listItem.exp_location) {
                let locElem = document.createElement('span');
                locElem.classList.add('preview-item-location');
                locElem.innerHTML = listItem.exp_location;
                headerElem.appendChild(locElem);
            }

            if (listItem.exp_start_date || listItem.exp_end_date) {
                let dateElem = document.createElement('span');
                dateElem.classList.add('preview-item-dates');
                let startDate = listItem.exp_start_date ? new Date(listItem.exp_start_date).getFullYear() : '';
                let endDate = listItem.exp_end_date ? new Date(listItem.exp_end_date).getFullYear() : 'Present';
                dateElem.innerHTML = `${startDate} - ${endDate}`;
                headerElem.appendChild(dateElem);
            }

            itemElem.appendChild(headerElem);

            // Create bullet points from description
            if (listItem.exp_description) {
                let pointsContainer = document.createElement('div');
                pointsContainer.classList.add('preview-item-points');

                // Split description by bullet points or new lines
                let points = listItem.exp_description
                    .split(/[•\n]/)
                    .map(point => point.trim())
                    .filter(point => point.length > 0)
                    .slice(0, 4); // Limit to 4 points

                // If no bullet points found, split by sentences
                if (points.length === 0) {
                    points = listItem.exp_description
                        .split(/[.!?]+/)
                        .map(point => point.trim())
                        .filter(point => point.length > 0)
                        .slice(0, 4);
                }

                // Create bullet points
                points.forEach(point => {
                    let pointElem = document.createElement('div');
                    pointElem.classList.add('preview-item-point');
                    pointElem.innerHTML = `• ${point}`;
                    pointsContainer.appendChild(pointElem);
                });

                itemElem.appendChild(pointsContainer);
            }

            listContainer.appendChild(itemElem);
        });
    }
    // Special handling for education
    else if (listContainer.id === 'educations_dsp') {
        listData.forEach(listItem => {
            let itemElem = document.createElement('div');
            itemElem.classList.add('preview-item');

            // Create header with school, degree, city, and dates
            let headerElem = document.createElement('div');
            headerElem.classList.add('preview-item-header');

            if (listItem.edu_school) {
                let schoolElem = document.createElement('span');
                schoolElem.classList.add('preview-item-title');
                schoolElem.innerHTML = `<strong>${listItem.edu_school}</strong>`;
                headerElem.appendChild(schoolElem);
            }

            if (listItem.edu_degree) {
                let degreeElem = document.createElement('span');
                degreeElem.classList.add('preview-item-degree');
                degreeElem.innerHTML = listItem.edu_degree;
                headerElem.appendChild(degreeElem);
            }

            if (listItem.edu_city) {
                let cityElem = document.createElement('span');
                cityElem.classList.add('preview-item-location');
                cityElem.innerHTML = listItem.edu_city;
                headerElem.appendChild(cityElem);
            }

            if (listItem.edu_start_date || listItem.edu_graduation_date) {
                let dateElem = document.createElement('span');
                dateElem.classList.add('preview-item-dates');
                let startDate = listItem.edu_start_date ? new Date(listItem.edu_start_date).getFullYear() : '';
                let endDate = listItem.edu_graduation_date ? new Date(listItem.edu_graduation_date).getFullYear() : 'Present';
                dateElem.innerHTML = `${startDate} - ${endDate}`;
                headerElem.appendChild(dateElem);
            }

            itemElem.appendChild(headerElem);

            // Create bullet points from description
            if (listItem.edu_description) {
                let pointsContainer = document.createElement('div');
                pointsContainer.classList.add('preview-item-points');

                // Split description by bullet points or new lines
                let points = listItem.edu_description
                    .split(/[•\n]/)
                    .map(point => point.trim())
                    .filter(point => point.length > 0)
                    .slice(0, 4); // Limit to 4 points

                // If no bullet points found, split by sentences
                if (points.length === 0) {
                    points = listItem.edu_description
                        .split(/[.!?]+/)
                        .map(point => point.trim())
                        .filter(point => point.length > 0)
                        .slice(0, 4);
                }

                // Create bullet points
                points.forEach(point => {
                    let pointElem = document.createElement('div');
                    pointElem.classList.add('preview-item-point');
                    pointElem.innerHTML = `• ${point}`;
                    pointsContainer.appendChild(pointElem);
                });

                itemElem.appendChild(pointsContainer);
            }

            listContainer.appendChild(itemElem);
        });
    } else {
        // Original handling for other sections
        listData.forEach(listItem => {
            let itemElem = document.createElement('div');
            itemElem.classList.add('preview-item');

            for (const key in listItem) {
                let subItemElem = document.createElement('span');
                subItemElem.classList.add('preview-item-val');
                subItemElem.innerHTML = `${listItem[key]}`;
                itemElem.appendChild(subItemElem);
            }

            listContainer.appendChild(itemElem);
        });
    }
}

const displayCV = (userData) => {
    nameDsp.innerHTML = userData.firstname + " " + userData.middlename + " " + userData.lastname;
    phonenoDsp.innerHTML = userData.phoneno;
    emailDsp.innerHTML = userData.email;
    addressDsp.innerHTML = userData.address;
    designationDsp.innerHTML = userData.designation;
    summaryDsp.innerHTML = userData.summary;
    showListData(userData.projects, projectsDsp);
    showListData(userData.achievements, achievementsDsp);
    showListData(userData.skills, skillsDsp);
    showListData(userData.educations, educationsDsp);
    showListData(userData.experiences, experiencesDsp);
}

// generate CV
const generateCV = () => {
    let userData = getUserInputs();
    displayCV(userData);
    console.log(userData);
}

function previewImage() {
    let oFReader = new FileReader();
    oFReader.readAsDataURL(imageElem.files[0]);
    oFReader.onload = function (ofEvent) {
        imageDsp.src = ofEvent.target.result;
    }
}

// print CV
function printCV() {
    window.print();
}

// Firebase save draft logic
if (window.location.pathname.includes('resume.html')) {
    document.addEventListener('DOMContentLoaded', async function () {
        // Wait for Firebase auth and Firestore to be available
        async function waitForFirebase() {
            while (!window.auth || !window.db) {
                await new Promise(res => setTimeout(res, 100));
            }
            return { auth: window.auth, db: window.db };
        }
        const { auth, db } = await waitForFirebase();
        const saveDraftBtn = document.getElementById('save-draft-btn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', async function () {
                const user = auth.currentUser;
                if (!user) {
                    showNotification('You must be logged in to save a draft.', 'error');
                    return;
                }
                const draftData = getUserInputs();
                // Use the first and last name as title if available
                const title = (draftData.firstname || '') + ' ' + (draftData.lastname || '');
                try {
                    const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                    await addDoc(collection(db, 'cvs'), {
                        ...draftData,
                        title: title.trim() || 'Untitled CV',
                        uid: user.uid,
                        createdAt: serverTimestamp(),
                        isDraft: true
                    });
                    showNotification('Draft saved! You can find it in your dashboard.', 'success');
                } catch (err) {
                    showNotification('Error saving draft: ' + err.message, 'error');
                }
            });
        }
        // Load draft logic
        const urlParams = new URLSearchParams(window.location.search);
        const draftId = urlParams.get('draftId');
        if (draftId) {
            async function waitForFirebase() {
                while (!window.auth || !window.db) {
                    await new Promise(res => setTimeout(res, 100));
                }
                return { auth: window.auth, db: window.db };
            }
            const { db } = await waitForFirebase();
            try {
                const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const draftRef = doc(db, 'cvs', draftId);
                const draftSnap = await getDoc(draftRef);
                if (draftSnap.exists()) {
                    const data = draftSnap.data();
                    // Fill simple form fields
                    for (const key in data) {
                        if (mainForm[key] && typeof mainForm[key].value !== 'undefined') {
                            mainForm[key].value = data[key];
                        }
                    }
                    // Handle repeaters (achievements, experiences, educations, projects, skills)
                    // Helper to fill repeater
                    function fillRepeater(groupSelector, dataArray, fieldMap) {
                        const repeaterList = document.querySelector(`${groupSelector} .repeater[data-repeater-list]`);
                        if (!repeaterList || !Array.isArray(dataArray)) return;
                        // Remove all but the first item (which is the template)
                        let items = repeaterList.querySelectorAll('[data-repeater-item]');
                        // Remove extra items
                        while (items.length > 1) {
                            items[items.length - 1].querySelector('[data-repeater-delete]').click();
                            items = repeaterList.querySelectorAll('[data-repeater-item]');
                        }
                        // Fill the first item
                        if (dataArray.length > 0) {
                            const firstItem = items[0];
                            Object.entries(fieldMap).forEach(([field, selector]) => {
                                if (firstItem.querySelector(selector)) {
                                    firstItem.querySelector(selector).value = dataArray[0][field] || '';
                                }
                            });
                        }
                        // Add and fill the rest
                        for (let i = 1; i < dataArray.length; i++) {
                            const addBtn = repeaterList.parentElement.querySelector('[data-repeater-create]');
                            if (addBtn) addBtn.click();
                            items = repeaterList.querySelectorAll('[data-repeater-item]');
                            const newItem = items[i];
                            Object.entries(fieldMap).forEach(([field, selector]) => {
                                if (newItem && newItem.querySelector(selector)) {
                                    newItem.querySelector(selector).value = dataArray[i][field] || '';
                                }
                            });
                        }
                    }
                    // Achievements
                    fillRepeater('[data-repeater-list="group-a"]', data.achievements, {
                        achieve_title: '.achieve_title',
                        achieve_description: '.achieve_description',
                    });
                    // Experiences
                    fillRepeater('[data-repeater-list="group-b"]', data.experiences, {
                        exp_title: '.exp_title',
                        exp_organization: '.exp_organization',
                        exp_location: '.exp_location',
                        exp_start_date: '.exp_start_date',
                        exp_end_date: '.exp_end_date',
                        exp_description: '.exp_description',
                    });
                    // Educations
                    fillRepeater('[data-repeater-list="group-c"]', data.educations, {
                        edu_school: '.edu_school',
                        edu_degree: '.edu_degree',
                        edu_city: '.edu_city',
                        edu_start_date: '.edu_start_date',
                        edu_graduation_date: '.edu_graduation_date',
                        edu_description: '.edu_description',
                    });
                    // Projects
                    fillRepeater('[data-repeater-list="group-d"]', data.projects, {
                        proj_title: '.proj_title',
                        proj_link: '.proj_link',
                        proj_description: '.proj_description',
                    });
                    // Skills
                    fillRepeater('[data-repeater-list="group-e"]', data.skills, {
                        skill: '.skill',
                    });
                    generateCV();
                }
            } catch (err) {
                showNotification('Error loading draft: ' + err.message, 'error');
            }
        }
    });
}