// io() function will give us an individual socket
const socket = io();

socket.on("connect", () => {
  console.log(`You connected with id ${socket.id}`);
});

// listen for when our server receives a message from the socket
socket.on("message-received", (msg) => {
  $("#messages").append(`<li> ${msg} </li>`);
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
