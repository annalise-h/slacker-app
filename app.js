const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const routes = require("./routes/routes");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./models");
const sharedSession = require("express-socket.io-session");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const app = express();

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// set public view directory
app.use(express.static(path.join(__dirname, "public")));

// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
// this also will read html forms
app.use(express.urlencoded({ extended: false }));
// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());

app.use(cookieParser());

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({ db: db.sequelize });

const oneDay = 1000 * 60 * 60 * 24;

const userSession = session({
  secret: "shhhhhhh",
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  resave: false,
  store: store,
});

app.use(userSession);

store.sync();

app.use("/", routes);

const server = http.createServer(app);
// io will be our websocket server that integrates with the Node.JS HTTP Server
const io = new Server(server);

io.use(
  sharedSession(userSession, {
    autoSave: true,
  })
);

io.use(async (socket, next) => {
  const sessionID = socket.handshake.sessionID;
  if (sessionID) {
    // find existing session in db
    const session = await store.sessionModel.findOne({
      where: { sid: sessionID },
    });
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = socket.handshake.session.user.id;
      socket.username = socket.handshake.session.user.username;
      return next();
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
  }
});

io.on("connection", (socket) => {
  console.log("connected");
  // persist socket ID on refresh
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });
  // listen for whenever we receive a "message-sent" event from the client
  socket.on("message-sent", (msg) => {
    // send a message back to all clients connected to the server
    io.emit("message-received", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
