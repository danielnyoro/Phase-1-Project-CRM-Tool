// DOM Elements
const addLeadBtn = document.getElementById('addLeadBtn');
const addLeadModal = document.getElementById('addLeadModal');
const messageModal = document.getElementById('messageModal');
const reminderModal = document.getElementById('reminderModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const addLeadForm = document.getElementById('addLeadForm');
const reminderForm = document.getElementById('reminderForm');
const messageType = document.getElementById('messageType');
const messageContent = document.getElementById('messageContent');
const messagePreview = document.getElementById('messagePreview');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Sample data storage (in a real app, this would be a database)
let leads = JSON.parse(localStorage.getItem('leads')) || [
    {
        id: 1,
        name: "John kariuki",
        email: "john.kariuki@egmail.com",
        phone: "(555) 123-4567",
        company: "Smith & Co.",
        source: "website",
        interest: "high",
        status: "interested",
        notes: "Interested in premium package. Follow up next week.",
        dateAdded: new Date().toISOString()
    },
    {
        id: 2,
        name: "Sarah omondi",
        email: "sarah.o@gmail.com",
        phone: "(555) 07566673",
        company: "Johnson Enterprises",
        source: "referral",
        interest: "medium",
        status: "new",
        notes: "Requested more information about pricing.",
        dateAdded: new Date().toISOString()
    }
];

let reminders = JSON.parse(localStorage.getItem('reminders')) || [
    {
        id: 1,
        leadId: 1,
        title: "Follow-up call with John Smith",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: "10:00",
        notes: "Discuss pricing options and answer questions about the premium package."
    },
    {
        id: 2,
        leadId: 2,
        title: "Send proposal to Sarah Johnson",
        date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days from now
        time: "15:00",
        notes: "Include customized pricing based on our conversation."
    }
];

// Initialize the app
function initApp() {
    // Save sample data to localStorage
    localStorage.setItem('leads', JSON.stringify(leads));
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    // Set minimum date for reminder form to today
    document.getElementById('reminderDate').min = new Date().toISOString().split('T')[0];
}

// Tab functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// Modal functionality
addLeadBtn.addEventListener('click', () => {
    addLeadModal.style.display = 'flex';
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        addLeadModal.style.display = 'none';
        messageModal.style.display = 'none';
        reminderModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addLeadModal) {
        addLeadModal.style.display = 'none';
    }
    if (e.target === messageModal) {
        messageModal.style.display = 'none';
    }
    if (e.target === reminderModal) {
        reminderModal.style.display = 'none';
    }
});

// Add lead form submission
addLeadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newLead = {
        id: leads.length > 0 ? Math.max(...leads.map(lead => lead.id)) + 1 : 1,
        name: document.getElementById('leadName').value,
        email: document.getElementById('leadEmail').value,
        phone: document.getElementById('leadPhone').value,
        company: document.getElementById('leadCompany').value,
        source: document.getElementById('leadSource').value,
        interest: document.getElementById('leadInterest').value,
        status: 'new',
        notes: document.getElementById('leadNotes').value,
        dateAdded: new Date().toISOString()
    };
    
    leads.push(newLead);
    localStorage.setItem('leads', JSON.stringify(leads));
    
    showToast('Lead added successfully!');
    addLeadModal.style.display = 'none';
    addLeadForm.reset();
    
    // In a real app, you would update the UI with the new lead
});

// Reminder form submission
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newReminder = {
        id: reminders.length > 0 ? Math.max(...reminders.map(reminder => reminder.id)) + 1 : 1,
        leadId: document.getElementById('reminderFor').dataset.leadId,
        title: document.getElementById('reminderTitle').value,
        date: document.getElementById('reminderDate').value,
        time: document.getElementById('reminderTime').value,
        notes: document.getElementById('reminderNotes').value
    };
    
    reminders.push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    showToast('Reminder set successfully!');
    reminderModal.style.display = 'none';
    reminderForm.reset();
    
    // In a real app, you would update the UI with the new reminder
});

// Message preview update
messageContent.addEventListener('input', updateMessagePreview);
messageType.addEventListener('change', updateMessagePreview);

function updateMessagePreview() {
    const type = messageType.value;
    const content = messageContent.value;
    
    let previewText = content || 'Your message will appear here...';
    
    if (type === 'sms') {
        previewText = `SMS Preview:\n${previewText}`;
    } else if (type === 'email') {
        previewText = `Email Preview:\nSubject: ${document.getElementById('messageSubject').value || 'No subject'}\n\n${previewText}`;
    } else if (type === 'whatsapp') {
        previewText = `WhatsApp Preview:\n${previewText}`;
    }
    
    messagePreview.textContent = previewText;
}

// Send message button
sendMessageBtn.addEventListener('click', () => {
    const type = messageType.value;
    const content = messageContent.value;
    
    if (!content.trim()) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    // In a real app, this would integrate with an SMS/Email/WhatsApp API
    showToast(`Message sent via ${type.toUpperCase()}!`);
    messageModal.style.display = 'none';
    messageContent.value = '';
    document.getElementById('messageSubject').value = '';
    updateMessagePreview();
});

// Action buttons for leads
document.addEventListener('click', (e) => {
    if (e.target.closest('.action-btn')) {
        const button = e.target.closest('.action-btn');
        const action = button.getAttribute('data-action');
        const leadCard = button.closest('.lead-card');
        const leadName = leadCard.querySelector('.lead-name').textContent;
        
        if (action === 'message') {
            document.getElementById('messageRecipient').value = leadName;
            messageModal.style.display = 'flex';
        } else if (action === 'whatsapp') {
            // In a real app, this would open WhatsApp with a pre-filled message
            showToast('Opening WhatsApp...');
        } else if (action === 'reminder') {
            document.getElementById('reminderFor').value = leadName;
            document.getElementById('reminderFor').dataset.leadId = leadCard.dataset.leadId;
            reminderModal.style.display = 'flex';
        } else if (action === 'edit') {
            // In a real app, this would open an edit form
            showToast('Edit functionality would open here');
        }
    }
});

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type === 'error' ? 'error' : 'success');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize the application
initApp();