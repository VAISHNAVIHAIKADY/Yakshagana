// ---------- GOOGLE LOGIN ----------
const CLIENT_ID = "392989241179-kfc6fbiit936fkuikpnn379q7omarsle.apps.googleusercontent.com";

function handleCredentialResponse(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));

    // Save user info in localStorage
    localStorage.setItem("visitorName", payload.name);
    localStorage.setItem("visitorEmail", payload.email);
    localStorage.setItem("loginTime", new Date().toISOString());

    // Show welcome message
    document.getElementById("user-label").innerText = `Hello, ${payload.name}!`;
}

// ---------- LIKE BUTTON ----------
function handleLike() {
    let reactions = JSON.parse(localStorage.getItem("reactions") || "[]");
    reactions.push({ action: "like", time: new Date().toISOString() });
    localStorage.setItem("reactions", JSON.stringify(reactions));
    alert("You liked this!");
}

// ---------- COMMENT BUTTON ----------
function renderComments() {
    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    const container = document.getElementById("commentsContainer");
    container.innerHTML = "";
    comments.forEach(c => {
        const div = document.createElement("div");
        div.innerText = `${c.text} (at ${new Date(c.time).toLocaleTimeString()})`;
        container.appendChild(div);
    });
}

function handleComment() {
    const input = document.getElementById("commentInput");
    const text = input.value.trim();
    if (!text) return;

    let comments = JSON.parse(localStorage.getItem("comments") || "[]");
    comments.push({ text, time: new Date().toISOString() });
    localStorage.setItem("comments", JSON.stringify(comments));

    input.value = "";
    renderComments();
}

// ---------- INITIALIZE ON PAGE LOAD ----------
window.onload = function() {
    // Google login initialization
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt();

    // Show welcome message if already logged in
    const name = localStorage.getItem("visitorName");
    if (name) {
        document.getElementById("welcome").innerText = `Hello, ${name}!`;
    }

    // Render previous reactions in console
    const reactions = JSON.parse(localStorage.getItem("reactions") || "[]");
    if (reactions.length > 0) {
        console.log("Previous reactions:", reactions);
    }

    // Render previous comments
    renderComments();

    // Attach event listeners
    document.getElementById("likeBtn").addEventListener("click", handleLike);
    document.getElementById("commentBtn").addEventListener("click", handleComment);
};

// ---------- PAGE NAVIGATION ----------
function showPage(pageNumber) {
    const pages = document.querySelectorAll(".screen");

    pages.forEach(p => p.classList.remove("active"));

    const targetPage = document.getElementById(`pg-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add("active");
        window.scrollTo(0, 0);
    }
}