const bcrypt = require("bcrypt");
const { User } = require("../models");
const express = require("express");
const router = express.Router();

router.post("/users/register", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    try {
      const newUser = await User.create({
        username,
        email,
        password: hash,
      });

      res.json({
        id: newUser.id,
      });
    } catch (e) {
      console.log(e);
    }
  });
});

router.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        res.status(200).json({
          id: user.id,
        });
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

module.exports = router;
