const { User, ChatRoom } = require("../models");

const bcrypt = require("bcrypt");
const multer = require("multer");
const express = require("express");
const { redirect } = require("express/lib/response");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/users/register", multer().none(), (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    try {
      const newUser = await User.create({
        username,
        email,
        password: hash,
      });

      req.session.user = newUser;
      res.status(200).redirect("/invite.html");
    } catch (e) {
      console.log(e);
    }
  });
});

router.post("/users/login", multer().none(), async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        req.session.user = user;
        res.redirect("/invite.html");
      } else {
        res.status(422).json({
          message: "Passwords don't match",
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({
      message: "User not found",
    });
  }
});

router.post("/createChat", async (req, res) => {
  const sessionId = Math.random().toString(36).substr(2, 9);

  try {
    const newChat = await ChatRoom.create({
      sessionId,
    });

    res.status(200).redirect(`/chatRoom/${sessionId}`);
  } catch (e) {
    res.status(500).json({
      message: "error creating chat",
    });
  }
});

router.get("/chatRoom/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const chatRoom = await ChatRoom.findOne({ where: { sessionId } });
    res.status(200).render("chat");
  } catch (e) {
    res.status(500).json({
      message: "error finding chat",
    });
  }
});

router.post("/chatRoom/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const chatRoom = await ChatRoom.findOne({ where: { sessionId } });
    res.status(200).render("chat");
  } catch (e) {
    res.status(500).json({
      message: "error finding chat",
    });
  }
});

module.exports = router;
