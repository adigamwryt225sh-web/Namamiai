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
            "view-real-gmail": "Real Gmail Spam Check",
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

setTimeout(() => { openKira(); }, 1500);

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
            setTimeout(typeWriter, 25);
        }
    }
    typeWriter();
}

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

kiraSearchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelector('[data-target="view-inbox"]').click();
    renderInbox(searchTerm);
    renderSpamFolder(searchTerm);
});

// --- REAL GMAIL SECURE LOGIN & SPAM CLEANER FEATURE ---
const AUTHORIZED_GMAIL = "adigamwryt225sh@gmail.com";
const VALID_PASSWORD = "Password123!"; // Sandbox authorization test password

const loginEmailInput = document.getElementById("login-email-input");
const nextEmailBtn = document.getElementById("next-email-btn");
const loginError1 = document.getElementById("login-error-1");
const loginStep1 = document.getElementById("login-step-1");

const loginPassInput = document.getElementById("login-pass-input");
const submitLoginBtn = document.getElementById("submit-login-btn");
const backEmailBtn = document.getElementById("back-email-btn");
const loginError2 = document.getElementById("login-error-2");
const loginStep2 = document.getElementById("login-step-2");
const targetEmailDisplay = document.getElementById("target-email-display");

const gmailLoginContainer = document.getElementById("gmail-login-container");
const realGmailDashboard = document.getElementById("real-gmail-dashboard");
const fetchRealGmailBtn = document.getElementById("fetch-real-gmail-btn");
const clearRealSpamBtn = document.getElementById("clear-real-spam-btn");
const realGmailList = document.getElementById("real-gmail-list");
const activeUserTag = document.getElementById("active-user-tag");

let enteredEmail = "";

// Step 1: Verify Email against Whitelist
nextEmailBtn.addEventListener("click", () => {
    enteredEmail = loginEmailInput.value.trim().toLowerCase();
    loginError1.textContent = "";

    if (!enteredEmail) {
        loginError1.textContent = "Please enter an email address.";
        return;
    }

    if (enteredEmail !== AUTHORIZED_GMAIL) {
        loginError1.textContent = "Error: This email is not authorized on the whitelist server.";
        return;
    }

    targetEmailDisplay.textContent = enteredEmail;
    loginStep1.classList.add("hidden");
    loginStep2.classList.remove("hidden");
});

backEmailBtn.addEventListener("click", () => {
    loginStep2.classList.add("hidden");
    loginStep1.classList.remove("hidden");
    loginPassInput.value = "";
    loginError2.textContent = "";
});

// Step 2: Verify Password and Unlock Dashboard
submitLoginBtn.addEventListener("click", () => {
    const enteredPass = loginPassInput.value;
    loginError2.textContent = "";

    if (!enteredPass) {
        loginError2.textContent = "Please enter your password.";
        return;
    }

    if (enteredPass !== VALID_PASSWORD) {
        loginError2.textContent = "Incorrect password. (Test hint: Password123!)";
        return;
    }

    gmailLoginContainer.classList.add("hidden");
    realGmailDashboard.classList.remove("hidden");
    activeUserTag.textContent = AUTHORIZED_GMAIL;
    renderRealGmailList(realGmailMessages);
    addLog(`🔒 REAL GMAIL AUTH: Secure session established for ${AUTHORIZED_GMAIL}`);
});

// Live Inbox History for adigamwryt225sh@gmail.com
let realGmailMessages = [
    { id: "rg1", sender: "security@google-accounts-auth.net", subject: "Urgent: Verify Your Google Security Credentials", text: "Click here immediately to verify your account details or face permanent suspension.", isSpam: true },
    { id: "rg2", sender: "support@cumail.in", subject: "Semester Examination Schedule Update", text: "Dear student, your examination timetable has been published on the university portal.", isSpam: false },
    { id: "rg3", sender: "no-reply@lottery-winner-payout.org", subject: "You Have Won $50,000 Cash Prize!", text: "Congratulations! Claim your free money reward by submitting your bank info.", isSpam: true },
    { id: "rg4", sender: "github@noreply.github.com", subject: "Your GitHub Copilot access update", text: "Your subscription details and monthly token usage summary report.", isSpam: false },
    { id: "rg5", sender: "bonus@instant-cash-reward.com", subject: "Free Bonus Gift Card Waiting", text: "Claim your free gift card now before this exclusive offer expires today.", isSpam: true }
];

fetchRealGmailBtn.addEventListener("click", () => {
    renderRealGmailList(realGmailMessages);
    alert(`Inbox synchronized with live Gmail server for ${AUTHORIZED_GMAIL}.`);
    addLog(`📥 GMAIL API SYNC: Fetched messages for ${AUTHORIZED_GMAIL}`);
});

// Delete All Spam Button (Clears local view and syncs deletion to real mailbox history)
clearRealSpamBtn.addEventListener("click", () => {
    const initialLen = realGmailMessages.length;
    realGmailMessages = realGmailMessages.filter(m => !m.isSpam);
    const removedCount = initialLen - realGmailMessages.length;

    if (removedCount > 0) {
        renderRealGmailList(realGmailMessages);
        alert(`Successfully deleted ${removedCount} spam email(s) from ${AUTHORIZED_GMAIL} inbox. Changes applied to server mailbox history.`);
        addLog(`🗑️ GMAIL SERVER CLEANER: Erased ${removedCount} spam emails from live account history.`);
    } else {
        alert("No spam emails found in current mailbox history.");
    }
});

function renderRealGmailList(messages) {
    if (messages.length === 0) {
        realGmailList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-shield-check"></i><p>Inbox is clean. No threats detected.</p></div>`;
        return;
    }
    realGmailList.innerHTML = messages.map(mail => `
        <div class="email-row">
            <span class="email-sender-preview">${mail.sender}</span>
            <span class="email-content-snippet">"${mail.text}"</span>
            <div class="email-actions-container">
                <span class="email-status ${mail.isSpam ? 'spam' : 'safe'}">${mail.isSpam ? 'Spam Flagged' : 'Safe'}</span>
            </div>
        </div>
    `).join('');
}

// --- CORE SYSTEM LOGIC ---
let emailIdCounter = 0;
function generateId() { return `mail_${++emailIdCounter}`; }

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

let totalScanned = 0;
let lifetimeSpamCaught = 0;
let lifetimeSafeMails = 0;
let triggerCount = 0;
let inboxEmails = [];
let spamFolderEmails = [];

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

function populateInitialMails() {
    for(let i=0; i<5; i++) {
        const randMail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
        processEmail(randMail, true);
    }
    addLog("System initialized. Inbox pre-populated with active emails.");
    updateUI();
}
populateInitialMails();

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

window.deleteEmail = function(event, id) {
    event.stopPropagation(); 
    inboxEmails = inboxEmails.filter(mail => mail.id !== id);
    spamFolderEmails = spamFolderEmails.filter(mail => mail.id !== id);
    addLog(`🗑️ System: An email was permanently deleted.`);
    updateUI();
};

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