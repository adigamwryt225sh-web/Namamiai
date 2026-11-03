// Sidebar Toggle with Animation
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    menuToggle.classList.toggle("menu-closed");
});

// Navigation tab switching
const navItems = document.querySelectorAll(".nav-item");
const viewSections = document.querySelectorAll(".view-section");
const pageTitle = document.getElementById("page-title");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        navItems.forEach(nav => nav.classList.remove("active"));
        viewSections.forEach(sec => sec.classList.remove("active"));

        item.classList.add("active");
        const targetId = item.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");

        const titles = {
            "view-inbox": "Inbox",
            "view-spam": "Spam Quarantine Folder",
            "view-checker": "Spam Email Check & Simulation",
            "view-logs": "System Trigger Logs & Stats",
            "view-about": "Project Details"
        };
        pageTitle.textContent = titles[targetId];
    });
});

// Unique ID generator for safe deletion
let emailIdCounter = 0;
function generateId() { return `mail_${++emailIdCounter}`; }

// Master sample email pool
const sampleEmails = [
    { senderName: "Global Prize Hub", senderEmail: "claim@lottery-winner-corp.net", subject: "Lottery Reward", text: "Congratulations! You won a free lottery prize of $10,000. Click here to claim.", fullBody: "You have won a massive cash reward in our lucky draw. Click the link to claim your funds immediately." },
    { senderName: "Prof. R. K. Sharma", senderEmail: "rk.sharma@cumail.in", subject: "Lab Submission", text: "Hi team, please find attached the meeting notes for our project sync tomorrow.", fullBody: "Dear students, please note the updated lab evaluation criteria posted on the department portal." },
    { senderName: "Express Cash", senderEmail: "bonus@instant-cash-payout.org", subject: "Bonus Alert", text: "Urgent: Claim your cash bonus right now before the offer expires!", fullBody: "Your emergency cash bonus is waiting. Act fast before it expires today." },
    { senderName: "Netflix Billing", senderEmail: "billing@netflix-support-update.com", subject: "Subscription Renewal", text: "Reminder: Your subscription renewal is due next week.", fullBody: "Your monthly membership billing failed. Update your card details to prevent service interruption." },
    { senderName: "Siddharth Roy", senderEmail: "s.roy@tech-seminar-2026.net", subject: "Giveaway Invite", text: "Exclusive offer: Free money giveaway for the first 100 subscribers!", fullBody: "Join our exclusive webinar and win free gadgets and cash rewards." },
    { senderName: "Ananya Verma", senderEmail: "ananya.v@cumail.in", subject: "Lunch Plan", text: "Hey! Are we still meeting for lunch today at 1 PM?", fullBody: "Hey, let's meet at the campus cafeteria around 1 PM today for lunch. Let me know!" },
    { senderName: "Lucky Draw Corp", senderEmail: "winner@millionaire-draw-2026.com", subject: "Winner Announcement", text: "You are selected as our lucky winner! Claim your prize immediately.", fullBody: "Your email address was selected in our weekly sweepstakes. Claim your prize now." },
    { senderName: "AWS Cloud Support", senderEmail: "no-reply@aws-billing-notifications.com", subject: "Cloud Invoice", text: "Your AWS billing statement for this month is ready for download.", fullBody: "Your monthly cloud hosting invoice is ready. Log in to your console to view charges." },
    { senderName: "Secure Bank Alert", senderEmail: "verify@bank-security-portal-auth.net", subject: "Account Suspension Warning", text: "Click here to verify your bank account details instantly to avoid suspension.", fullBody: "Suspicious login detected. Verify your account credentials immediately or your account will be locked." },
    { senderName: "CSE Dept Notice", senderEmail: "cse.notices@cumail.in", subject: "Assignment Guidelines", text: "Lab assignment submission guidelines have been updated on the university portal.", fullBody: "All B.Tech CSE students are required to submit their project documentation following the new guidelines." }
];

const spamKeywords = ["free", "win", "winner", "prize", "lottery", "cash", "urgent", "click here", "subscribe", "money", "offer", "bonus", "verify"];

// App State (Lifetime Stats & Current Arrays)
let totalScanned = 0;
let lifetimeSpamCaught = 0;
let lifetimeSafeMails = 0;
let triggerCount = 0;

let inboxEmails = [];
let spamFolderEmails = [];

// DOM Elements
const totalCountEl = document.getElementById("total-count");
const spamCountEl = document.getElementById("spam-count");
const safeCountEl = document.getElementById("safe-count");
const triggerCountEl = document.getElementById("trigger-count");

const badgeInbox = document.getElementById("badge-inbox");
const badgeSpam = document.getElementById("badge-spam");

const emailInput = document.getElementById("email-input");
const searchInput = document.getElementById("search-input");
const bulkAmountInput = document.getElementById("bulk-amount");
const analyzeBtn = document.getElementById("analyze-btn");
const simulateBtn = document.getElementById("simulate-btn");
const batchBtn = document.getElementById("batch-btn");

const inboxList = document.getElementById("inbox-list");
const spamFolderList = document.getElementById("spam-folder-list");
const logList = document.getElementById("log-list");

// Pre-Populate 5 random emails on initial page load
function populateInitialMails() {
    for(let i=0; i<5; i++) {
        // Pick a completely random mail from the pool
        const randMail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
        processEmail(randMail, true); // true = silent, no logs printed for initial batch
    }
    addLog("System initialized. Inbox pre-populated with active emails.");
    updateUI();
}

// Run immediately on script load
populateInitialMails();

// Global Search Event Listener
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderInbox(searchTerm);
    renderSpamFolder(searchTerm);
});

// Event Listeners for Buttons
analyzeBtn.addEventListener("click", () => {
    const text = emailInput.value.trim();
    if (!text) return alert("Please enter or paste email text first!");
    processEmail({ senderName: "Custom User", senderEmail: "tester@external.net", subject: "Custom Analyzed Email", text: text, fullBody: text });
    emailInput.value = "";
});

simulateBtn.addEventListener("click", () => {
    // 100% Random Pick
    const rand = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
    processEmail(rand);
});

batchBtn.addEventListener("click", () => {
    // Get user defined amount
    let amount = parseInt(bulkAmountInput.value);
    
    // Validate bounds
    if (isNaN(amount) || amount < 1) amount = 1;
    if (amount > 100) amount = 100;
    
    bulkAmountInput.value = amount; // Reset UI to actual processed number

    // Loop exactly 'amount' times, picking a totally random email each time
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const randEmailObj = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
            processEmail(randEmailObj);
        }, i * 80); // Stagger by 80ms to create a cool waterfall loading effect
    }
});

// Core Logic: Process New Email
function processEmail(mailData, isSilentInit = false) {
    totalScanned++;
    const lowerText = mailData.text.toLowerCase();
    const isSpam = spamKeywords.some(keyword => lowerText.includes(keyword));

    const emailObj = {
        id: generateId(),
        senderName: mailData.senderName || "Unknown Sender",
        senderEmail: mailData.senderEmail || "no-reply@domain.net",
        subject: mailData.subject || "Incoming Message",
        text: mailData.text,
        fullBody: mailData.fullBody || mailData.text,
        isSpam: isSpam,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    inboxEmails.unshift(emailObj);

    if (isSpam) {
        lifetimeSpamCaught++;
        triggerCount++;
        spamFolderEmails.unshift(emailObj);
        if (!isSilentInit) addLog(`🚨 SPAM TRIGGER FIRED: Quarantined email from ${emailObj.senderName}`);
    } else {
        lifetimeSafeMails++;
        if (!isSilentInit) addLog(`✅ Verified safe email received from ${emailObj.senderName}`);
    }
    
    // Only update UI fully if it's not a silent initial load
    if(!isSilentInit) updateUI();
}

// Logic: Delete Email
window.deleteEmail = function(event, id) {
    event.stopPropagation(); // Prevents modal from opening when clicking delete
    
    inboxEmails = inboxEmails.filter(mail => mail.id !== id);
    spamFolderEmails = spamFolderEmails.filter(mail => mail.id !== id);
    
    addLog(`🗑️ System: An email was permanently deleted by admin.`);
    updateUI();
};

// UI Render Updates
function updateUI() {
    totalCountEl.textContent = totalScanned;
    spamCountEl.textContent = lifetimeSpamCaught;
    safeCountEl.textContent = lifetimeSafeMails;
    triggerCountEl.textContent = triggerCount;
    
    badgeInbox.textContent = inboxEmails.length;
    badgeSpam.textContent = spamFolderEmails.length;
    
    const searchTerm = searchInput.value.toLowerCase();
    renderInbox(searchTerm);
    renderSpamFolder(searchTerm);
}

function renderInbox(filterTerm = "") {
    const filtered = inboxEmails.filter(m => m.senderName.toLowerCase().includes(filterTerm) || m.text.toLowerCase().includes(filterTerm));
    
    if (filtered.length === 0) {
        inboxList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-folder-open"></i><p>No emails found.</p></div>`;
        return;
    }

    inboxList.innerHTML = filtered.map(mail => `
        <div class="email-row" onclick="openEmailModal('${mail.id}')">
            <span class="email-sender-preview">${mail.senderName}</span>
            <span class="email-content-snippet">"${mail.text}"</span>
            <div class="email-actions-container">
                <span class="email-status ${mail.isSpam ? 'spam' : 'safe'}">${mail.isSpam ? 'Quarantined' : 'Safe'}</span>
                <button class="delete-mail-btn" title="Delete Email" onclick="deleteEmail(event, '${mail.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderSpamFolder(filterTerm = "") {
    const filtered = spamFolderEmails.filter(m => m.senderName.toLowerCase().includes(filterTerm) || m.text.toLowerCase().includes(filterTerm));
    
    if (filtered.length === 0) {
        spamFolderList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-shield-check"></i><p>No spam emails match.</p></div>`;
        return;
    }

    spamFolderList.innerHTML = filtered.map(mail => `
        <div class="email-row" onclick="openEmailModal('${mail.id}')">
            <span class="email-sender-preview">${mail.senderName}</span>
            <span class="email-content-snippet">"${mail.text}"</span>
            <div class="email-actions-container">
                <span class="email-status spam">Quarantined</span>
                <button class="delete-mail-btn" title="Delete Email" onclick="deleteEmail(event, '${mail.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Modal Elements & Logic
const emailModal = document.getElementById("email-modal");
const modalSubject = document.getElementById("modal-subject");
const modalSenderName = document.getElementById("modal-sender-name");
const modalSenderEmail = document.getElementById("modal-sender-email");
const modalTime = document.getElementById("modal-time");
const modalBodyText = document.getElementById("modal-body-text");
const modalStatusBadge = document.getElementById("modal-status-badge");
const closeModalX = document.getElementById("close-modal-x");
const closeModalBtn = document.getElementById("close-modal-btn");

window.openEmailModal = function(id) {
    const mail = inboxEmails.find(m => m.id === id);
    if (!mail) return;
    
    modalSubject.textContent = mail.subject;
    modalSenderName.textContent = mail.senderName;
    modalSenderEmail.textContent = `<${mail.senderEmail}>`;
    modalTime.textContent = mail.time;
    modalBodyText.textContent = mail.fullBody;
    
    modalStatusBadge.className = `email-status ${mail.isSpam ? 'spam' : 'safe'}`;
    modalStatusBadge.textContent = mail.isSpam ? 'Spam (Triggered & Quarantined)' : 'Verified Safe';
    emailModal.classList.add("active");
};

function closeModal() { emailModal.classList.remove("active"); }
closeModalX.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
emailModal.addEventListener("click", (e) => { if (e.target === emailModal) closeModal(); });

function addLog(message) {
    if (logList.querySelector(".log-placeholder")) logList.innerHTML = "";
    const li = document.createElement("li");
    li.className = "log-item";
    li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logList.prepend(li);
}