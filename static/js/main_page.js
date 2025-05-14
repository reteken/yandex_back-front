const API_URL = 'http://localhost:8000';
let currentChatId = null;

const updateUserInfo = () => {
  document.getElementById('currentUsername').textContent =
    localStorage.getItem('username') || 'Гость';
};

const loadChats = async () => {
  try {
    const response = await fetch(`${API_URL}/chats/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    const chats = await response.json();
    renderChats(chats);
    if (chats.length > 0) openChat(chats[0].id);
  } catch (error) {
    console.error('Ошибка загрузки чатов:', error);
  }
};

const renderChats = (chats) => {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = chats.map(chat => `
    <div class="chat-item" data-chat-id="${chat.id}">
      <div class="chat-item-avatar">${chat.name[0]}</div>
      <div class="chat-item-info">
        <div class="chat-item-name">${chat.name}</div>
        <div class="chat-item-path">Участников: ${chat.members?.length || 1}</div>
      </div>
    </div>
  `).join('');

  // Назначить обработчики событий
  document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => openChat(item.dataset.chatId));
  });
};

const openChat = (chatId) => {
  currentChatId = chatId;
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('chat-item-active');
    if (item.dataset.chatId === chatId) item.classList.add('chat-item-active');
  });
  document.getElementById('chatHeader').textContent = `Чат #${chatId}`;
  loadMessages();
};

const loadMessages = async () => {
  if (!currentChatId) return;
  try {
    const response = await fetch(`${API_URL}/messages?chat_id=${currentChatId}`);
    const messages = await response.json();
    renderMessages(messages);
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
  }
};

const renderMessages = (messages) => {
  const container = document.getElementById('messages');
  container.innerHTML = messages.map(msg => `
    <div class="message ${msg.sender === 'Anonymous' ? 'message-in' : 'message-out'}">
      ${msg.sender !== 'Anonymous' ? `<div class="sender">${msg.sender}</div>` : ''}
      ${msg.content}
      <div class="time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
};

const sendMessage = async () => {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (!message || !currentChatId) return;

  const isAnonymous = document.getElementById('anonymousCheckbox')?.checked || !localStorage.getItem('access_token');

  try {
    await fetch(`${API_URL}/send_message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      },
      body: JSON.stringify({
        content: message,
        is_anonymous: isAnonymous,
        chat_id: currentChatId
      })
    });
    input.value = '';
    loadMessages();
  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
};

const createNewChat = async () => {
  const chatName = document.getElementById('newChatName').value.trim();
  if (!chatName) return;

  try {
    await fetch(`${API_URL}/chats/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ name: chatName })
    });
    closeCreateChatModal();
    loadChats();
  } catch (error) {
    console.error('Ошибка создания чата:', error);
  }
};

const showCreateChatModal = () => {
  document.getElementById('createChatModal').style.display = 'block';
};

const closeCreateChatModal = () => {
  document.getElementById('createChatModal').style.display = 'none';
};

const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

window.onload = () => {
  updateUserInfo();
  if (localStorage.getItem('access_token')) loadChats();
  setInterval(loadMessages, 2000);
  document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
  document.getElementById('messageInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });
};