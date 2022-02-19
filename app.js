const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const routes = require("./routes/routes");
const session = require("express-session");

const app = express();

// set public view directory
app.use(express.static(path.join(__dirname, "public")));

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
// this also will read html forms
app.use(express.urlencoded({ extended: false }));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'shhhhhhh',
  saveUninitialized: false,
  cookie: { maxAge: oneDay},
  resave: false
}));

app.use("/", routes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const server = http.createServer(app);
// io will be our websocket server that integrates with the Node.JS HTTP Server
const io = new Server(server);

io.on("connection", (socket) => {
  // listen for whenever we receive a "message-sent" event from the client
  socket.on("message-sent", (msg) => {
    // send a message back to all clients connected to the server
    io.emit("message-received", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
