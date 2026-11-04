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

// --- KIRA A.I. CHAT LOGIC ---
const kiraBot = document.getElementById("kira-bot");
const kiraMenu = document.getElementById("kira-menu");
const closeKira = document.getElementById("close-kira");
const kiraChatArea = document.getElementById("kira-chat-area");
const kiraSearchInput = document.getElementById("kira-search-input");
const kiraSimCount = document.getElementById("kira-sim-count");
let kiraHasGreeted = false;

// Open Kira / Auto Greet
function openKira() {
    kiraMenu.classList.remove("hidden");
    if (!kiraHasGreeted) {
        kiraHasGreeted = true;
        typeKiraMessage("> I am KIRA. I am watching the network... How shall we dispense justice to these emails today?");
    }
}

kiraBot.addEventListener("click", () => {
    if (kiraMenu.classList.contains("hidden")) {
        openKira();
    } else {
        kiraMenu.classList.add("hidden");
    }
});

closeKira.addEventListener("click", () => kiraMenu.classList.add("hidden"));

// Auto-open Kira 1.5 seconds after page loads
setTimeout(() => { openKira(); }, 1500);

// Typewriter Effect Function
function typeKiraMessage(text, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `kira-msg ${isUser ? 'user-msg' : ''}`;
    kiraChatArea.appendChild(msgDiv);
    
    if (isUser) {
        msgDiv.textContent = text;
        kiraChatArea.scrollTop = kiraChatArea.scrollHeight;
        return;
    }

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            msgDiv.textContent += text.charAt(i);
            i++;
            kiraChatArea.scrollTop = kiraChatArea.scrollHeight;
            setTimeout(typeWriter, 25); // typing speed
        }
    }
    typeWriter();
}

// Chat Button Interactions
document.querySelectorAll(".kira-chat-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const action = e.target.getAttribute("data-action");
        
        if (action === "who") {
            typeKiraMessage("Who built this?", true);
            setTimeout(() => {
                typeKiraMessage("> This system was engineered by three individuals: Namami Shukla, Aditya Kumar, and Abhinav Sherawat from Chandigarh University.");
            }, 500);
        } 
        else if (action === "purpose") {
            typeKiraMessage("What is the purpose?", true);
            setTimeout(() => {
                typeKiraMessage("> To construct an impenetrable firewall. It identifies, counts, and eradicates spam emails in real-time using keyword triggers.");
            }, 500);
        }
        else if (action === "simulate") {
            let amount = parseInt(kiraSimCount.value);
            if (isNaN(amount) || amount < 1) amount = 1;
            if (amount > 100) amount = 100;
            
            typeKiraMessage(`Simulate ${amount} mails.`, true);
            setTimeout(() => {
                typeKiraMessage(`> Initiating judgment protocol on ${amount} incoming messages... Switch to Inbox to observe.`);
                runBulkSimulation(amount);
                document.querySelector('[data-target="view-inbox"]').click();
            }, 500);
        }
        else if (action === "delete") {
            typeKiraMessage("Delete all spam.", true);
            setTimeout(() => {
                if (spamFolderEmails.length === 0) {
                    typeKiraMessage("> The quarantine is already empty.");
                } else {
                    spamFolderEmails = [];
                    addLog("🗑️ KIRA PROTOCOL: Entire spam quarantine erased permanently.");
                    updateUI();
                    typeKiraMessage("> All flagged spam has been permanently eradicated.");
                }
            }, 500);
        }
    });
});

// Kira Global Search functionality
kiraSearchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelector('[data-target="view-inbox"]').click();
    renderInbox(searchTerm);
    renderSpamFolder(searchTerm);
});

// --- CORE SYSTEM LOGIC ---
let emailIdCounter = 0;
function generateId() { return `mail_${++emailIdCounter}`; }

// 100% Random Master Pool
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

// State
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
const bulkAmountInput = document.getElementById("bulk-amount");
const analyzeBtn = document.getElementById("analyze-btn");
const simulateBtn = document.getElementById("simulate-btn");
const batchBtn = document.getElementById("batch-btn");
const inboxList = document.getElementById("inbox-list");
const spamFolderList = document.getElementById("spam-folder-list");
const logList = document.getElementById("log-list");

// Initialize Data
function populateInitialMails() {
    for(let i=0; i<5; i++) {
        const randMail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
        processEmail(randMail, true);
    }
    addLog("System initialized. Inbox pre-populated with active emails.");
    updateUI();
}
populateInitialMails();

// Manual Dashboard Actions
analyzeBtn.addEventListener("click", () => {
    const text = emailInput.value.trim();
    if (!text) return alert("Please enter email text!");
    processEmail({ senderName: "Custom User", senderEmail: "tester@external.net", subject: "Custom Analyzed Email", text: text, fullBody: text });
    emailInput.value = "";
});

simulateBtn.addEventListener("click", () => {
    processEmail(sampleEmails[Math.floor(Math.random() * sampleEmails.length)]);
});

batchBtn.addEventListener("click", () => {
    let amount = parseInt(bulkAmountInput.value);
    if (isNaN(amount) || amount < 1) amount = 1;
    if (amount > 100) amount = 100;
    bulkAmountInput.value = amount; 
    runBulkSimulation(amount);
});

function runBulkSimulation(amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const randEmailObj = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
            processEmail(randEmailObj);
        }, i * 80); 
    }
}

// Process Email Core
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
    
    if(!isSilentInit) updateUI();
}

// Delete Logic
window.deleteEmail = function(event, id) {
    event.stopPropagation(); 
    inboxEmails = inboxEmails.filter(mail => mail.id !== id);
    spamFolderEmails = spamFolderEmails.filter(mail => mail.id !== id);
    addLog(`🗑️ System: An email was permanently deleted.`);
    updateUI();
};

// UI Rendering
function updateUI() {
    totalCountEl.textContent = totalScanned;
    spamCountEl.textContent = lifetimeSpamCaught;
    safeCountEl.textContent = lifetimeSafeMails;
    triggerCountEl.textContent = triggerCount;
    
    badgeInbox.textContent = inboxEmails.length;
    badgeSpam.textContent = spamFolderEmails.length;
    
    const searchTerm = kiraSearchInput.value.toLowerCase();
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

// Modal System
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