const express = require("express");
const path = require("path");
const port = 3000;

const app = express();

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
// this also will read html forms
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port);
