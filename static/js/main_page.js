document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const sidebar = document.getElementById('sidebar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const backBtn = document.getElementById('backBtn');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messages');
    const chatList = document.getElementById('chatList');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    // Icons
    const searchIcon = document.querySelector('.search-icon');
    const settingsIcon = document.querySelector('.settings-btn');
    const messagesBg = document.querySelector('.messages');

    // Set initial icons and background
    function setInitialAssets() {
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Set search icon
        searchIcon.style.backgroundImage = `url('${isDarkMode ? 'img/search_white.png' : 'img/search.png'}')`;
        
        // Set settings icon
        settingsIcon.style.backgroundImage = `url('${isDarkMode ? 'img/settings_white.png' : 'img/settings.png'}')`;
        
        // Set background
        messagesBg.style.backgroundImage = `url('${isDarkMode ? 'img/background.jpg' : 'img/background_white.jpg'}')`;
    }

    // Toggle settings panel
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPanel.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // Close settings when clicking outside
    function closeSettings() {
        settingsPanel.classList.remove('open');
        overlay.classList.remove('active');
    }

    overlay.addEventListener('click', closeSettings);
    chatList.addEventListener('click', closeSettings);

    // Toggle dark mode
    darkModeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        
        // Update icons and background
        const isDarkMode = body.classList.contains('dark-mode');
        
        searchIcon.style.backgroundImage = `url('${isDarkMode ? 'img/search_white.png' : 'img/search.png'}')`;
        settingsIcon.style.backgroundImage = `url('${isDarkMode ? 'img/settings_white.png' : 'img/settings.png'}')`;
        messagesBg.style.backgroundImage = `url('${isDarkMode ? 'img/background.jpg' : 'img/background_white.jpg'}')`;
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'false') {
        body.classList.remove('dark-mode');
        darkModeToggle.checked = false;
        
        // Update icons and background if light mode
        searchIcon.style.backgroundImage = "url('img/search.png')";
        settingsIcon.style.backgroundImage = "url('img/settings.png')";
        messagesBg.style.backgroundImage = "url('img/background_white.jpg')";
    }

    // Set initial assets
    setInitialAssets();

    // Toggle sidebar on mobile
    backBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            // Add message to chat area
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'message-out');
            messageElement.textContent = messageText;
            messagesContainer.appendChild(messageElement);
            
            // Add message to chat list preview
            if (chatList.querySelector('.empty-state')) {
                chatList.innerHTML = '';
            }
            
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');
            chatItem.innerHTML = `
                <div class="chat-item-avatar">Y</div>
                <div class="chat-item-info">
                    <div class="chat-item-name">You</div>
                    <div class="chat-item-preview">${messageText}</div>
                    <div class="chat-item-path">${body.classList.contains('dark-mode') ? 'C:\\Users\\You\\Messages #dark' : 'C:\\Users\\You\\Messages #light'}</div>
                </div>
            `;
            chatList.prepend(chatItem);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Responsive behavior
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        } else {
            sidebar.classList.add('open');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Sample chat interaction
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', function() {
            const chatName = this.querySelector('.chat-item-name').textContent;
            document.querySelector('.chat-title').textContent = chatName;
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
});