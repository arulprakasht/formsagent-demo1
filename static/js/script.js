const socket = io();

document.getElementById("chat-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const input = document.getElementById("user-input");
    const message = input.value;
    appendMessage("user", message);
    socket.emit("user_message", { message: message });
    input.value = "";
});

function sendQuick(text) {
    appendMessage("user", text);
    socket.emit("user_message", { message: text });
}

function appendMessage(role, content) {
    const container = document.getElementById("chat-container");
    const card = document.createElement("div");
    card.className = "message-card";
    const parsedContent = (typeof marked !== "undefined") ? marked.parse(content) : content;
    card.innerHTML = `<strong>${role}:</strong><br>${parsedContent}`;
    container.appendChild(card);
    container.scrollTop = container.scrollHeight;
}

socket.on("agent_response", function(data) {
    appendMessage(data.role, data.content);
});

socket.on("suggested_prompts", function(data) {
    const list = document.getElementById("suggested-prompts");
    list.innerHTML = "";
    data.prompts.forEach(prompt => {
        const item = document.createElement("li");
        item.textContent = prompt;
        item.onclick = () => sendQuick(prompt);
        item.style.cursor = "pointer";
        item.style.color = "#2e7d32";
        list.appendChild(item);
    });
});
