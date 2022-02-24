// io() function will give us an individual socket
const socket = io({
  autoConnect: true,
});

$(document).ready(() => {
  const sessionID = localStorage.getItem("sessionID");
  if (sessionID) {
    socket.auth = { sessionID };
  }
});

socket.on("session", ({ sessionID, userID, username }) => {
  // attach the session ID to the next reconnection attempts
  socket.auth = { sessionID };
  // store it in the localStorage
  localStorage.setItem("sessionID", sessionID);
  // save the ID and username of the user
  socket.userID = userID;
  socket.username = username;
});

// listen for when our server receives a message from the socket
socket.on("message-received", (msg) => {
  $("#messages").append(`
  <div class="msg">
    <li> ${msg} <span class="timestamp"> ${new Date().toLocaleTimeString()}</span>   </li>
  </div>`);
  $("#input").val("");
});

$(document).ready(() => {
  $("#form").submit((event) => handleSentMessage(event));
});

function handleSentMessage(e) {
  e.preventDefault(e);

  const message = $("#input").val();

  socket.emit("message-sent", message);
}
