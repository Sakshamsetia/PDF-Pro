// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const modalFileInput = document.getElementById('modalFileInput');
const uploadSection = document.getElementById('uploadSection');
const chatSection = document.getElementById('chatSection');
const currentDocument = document.getElementById('currentDocument');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const removeDocument = document.getElementById('removeDocument');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const uploadModal = document.getElementById('uploadModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalUploadArea = document.getElementById('modalUploadArea');

// State
let currentPDF = null;
let messages = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize the app
function init() {
    // Set initial theme
    setTheme(isDarkMode);
    
    // Check if we have a saved PDF
    const savedPDF = localStorage.getItem('currentPDF');
    if (savedPDF) {
        currentPDF = JSON.parse(savedPDF);
        showChatInterface();
    }
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // File upload
    uploadArea.addEventListener('click', () => fileInput.click());
    modalUploadArea.addEventListener('click', () => modalFileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    modalFileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInput });
        }
    });

    // Modal drag and drop
    modalUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        modalUploadArea.classList.add('active');
    });
    
    modalUploadArea.addEventListener('dragleave', () => {
        modalUploadArea.classList.remove('active');
    });
    
    modalUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        modalUploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            modalFileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: modalFileInput });
        }
    });
    
    // Chat input
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    // Remove document
    removeDocument.addEventListener('click', removeCurrentPDF);
    
    // Modal close
    closeModalBtn.addEventListener('click', () => {
        uploadModal.classList.add('hidden');
    });
}

// Toggle dark/light theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
}

// Apply theme to the document
function setTheme(dark) {
    if (dark) {
        document.documentElement.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Handle file selection
function handleFileSelect(e) {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
        showToast('Please select a valid PDF file', 'error');
        return;
    }
    
    // If there's already a PDF, confirm replacement
    if (currentPDF) {
        if (!confirm('This will replace your current PDF. Continue?')) {
            return;
        }
    }
    
    // Prepare UI for upload
    uploadSection.querySelector('.upload-area').classList.add('hidden');
        
    // Close modal if open
    uploadModal.classList.add('hidden');
    
    // Simulate upload progress
    simulateUpload(selectedFile);
}
// Simulate file upload (in a real app, this would be an actual upload)
async function simulateUpload(pdfFile) {
    let forminfo = new FormData()
    forminfo.append('file',pdfFile)
    let response = await fetch('/files',{
        method: 'POST',
        body: forminfo
    })
    let data = await response.json()
    console.log(data)

    // Show chat interface after a delay
    setTimeout(() => {
        showChatInterface();
        showToast('PDF uploaded successfully');
    }, 100);
}
// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Show the chat interface
function showChatInterface() {
    uploadSection.classList.add('hidden');
    chatSection.classList.remove('hidden');
        
    // Clear any existing messages and show welcome message
    messages = [];
    renderMessages();
}

// Remove the current PDF and show upload interface
function removeCurrentPDF() {
    currentPDF = null;
    localStorage.removeItem('currentPDF');
    
    // Reset UI
    chatSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    uploadArea.classList.remove('hidden');
    fileInput.value = '';
    uploadSection.querySelector('.upload-area').classList.remove('hidden');

    showToast('PDF removed');
}

// Render chat messages
function renderMessages() {
    // Always start with the assistant's welcome message
    let html = `
        <div class="message message-assistant">
            <div class="message-bubble assistant-bubble">
                <p>I've analyzed "${currentPDF.name}". Ask me anything about its contents.</p>
                <div class="message-meta">
                    <i class="fas fa-robot mr-1"></i> PDF Assistant
                </div>
            </div>
        </div>
    `;
    
    // Add existing messages
    if (messages.length > 0) {
        html += messages.map(msg => `
            <div class="message message-${msg.role}">
                <div class="message-bubble ${msg.role}-bubble">
                    <p>${msg.content}</p>
                    <div class="message-meta">
                        ${msg.role === 'user' 
                            ? '<i class="fas fa-user mr-1"></i> You' 
                            : '<i class="fas fa-robot mr-1"></i> PDF Assistant'}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    chatMessages.innerHTML = html;
    scrollToBottom();
}

// Send a new message
function sendMessage() {
    const messageText = chatInput.value.trim();
    if (!messageText || !currentPDF) return;
    
    // Add user message to UI
    addMessage('user', messageText);
    
    // Clear input
    chatInput.value = '';
    
    // Add user message to messages array
    messages.push({
        role: 'user',
        content: messageText,
        timestamp: new Date()
    });
    
    // Show loading indicator for assistant response
    const loadingId = 'loading-' + Date.now();
    chatMessages.innerHTML += `
        <div id="${loadingId}" class="message message-assistant">
            <div class="message-bubble assistant-bubble">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    scrollToBottom();
    
    // Simulate API response delay
    setTimeout(() => {
        // Remove loading indicator
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        
        // Generate a mock response (in a real app, this would come from an API)
        const response = generateMockResponse(messageText);
        
        // Add assistant message
        addMessage('assistant', response);
        
        // Save assistant message
        messages.push({
            role: 'assistant',
            content: response,
            timestamp: new Date()
        });
    }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5s
}

// Add a message to the chat UI
function addMessage(role, content) {
    const messageHtml = `
        <div class="message message-${role}">
            <div class="message-bubble ${role}-bubble">
                <p>${content}</p>
                <div class="message-meta">
                    ${role === 'user' 
                        ? '<i class="fas fa-user mr-1"></i> You' 
                        : '<i class="fas fa-robot mr-1"></i> PDF Assistant'}
                </div>
            </div>
        </div>
    `;
    
    chatMessages.innerHTML += messageHtml;
    scrollToBottom();
}

// Generate a mock response (for demo purposes)
function generateMockResponse(question) {
    const responses = [
        `Based on the document, ${question.toLowerCase().replace('?', '')} is covered in section 3.2 on page 15.`,
        `The document mentions that ${question.toLowerCase().replace('?', '')} several times, particularly in the context of the main findings.`,
        `I found relevant information about ${question.toLowerCase().replace('?', '')} in the conclusion section. Would you like me to summarize it?`,
        `The PDF doesn't explicitly address ${question.toLowerCase().replace('?', '')}, but it does discuss related concepts in chapter 4.`,
        `There are three main points in the document regarding ${question.toLowerCase().replace('?', '')}: first, the introduction covers the background; second, the methodology explains the approach; and third, the results show the outcomes.`,
        `I've analyzed the document and ${question.toLowerCase().replace('?', '')} appears to be a key theme throughout. The most detailed discussion is in the appendix.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Scroll chat to the bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle text-red-500';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle text-yellow-500';
    } else {
        toastIcon.className = 'fas fa-check-circle text-green-500';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
