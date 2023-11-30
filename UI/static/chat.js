// chat.js
function sendMessage() {
    let input = document.querySelector('.chat-input');
    let messages = document.querySelector('.chat-messages');
    let message = input.value.trim();
    
    if (message) {
        messages.innerHTML += '<div class="message">' + message + '</div>';
        input.value = '';

        // 发送消息到指定的服务器
        fetch('http://127.0.0.1:5180/mailbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'text=' + encodeURIComponent(message)
        });
    }
}
function checkEnter(event) {
    if (event.keyCode === 13 && !event.shiftKey) { // 当按下回车键且未按下shift键时
        event.preventDefault(); // 阻止默认行为，例如在文本区域中插入新行
        sendMessage();
    }
}