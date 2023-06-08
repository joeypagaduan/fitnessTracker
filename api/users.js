/* eslint-disable no-useless-catch */
const express = require("express");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET } = process.env;

const { createUser,
  getUser,
  getUserById,
  getUserByUsername} = require("../db/users");

const router = express.Router();

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
   

    // Check if the username is already taken
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return next({
        error: "UserTakenError",
        message: "A user with that username already exists",
      });
    }
    console.log("eroor to get")

    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      console.log("error")
      return next({
        error: "PasswordTooShortError",
        message: "Password should be at least 8 characters long",
      });
    }
    console.log("error")

    
    // Create a new user account
    const newUser = await createUser({username, password});

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({id: newUser.id, username: newUser.username},JWT_SECRET);

    // Return the response
    res.send({
      message: "Thanks for signing up for our service.",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.log("error")
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await getUserByUsername(username);

    if (!user) {
      // If the user doesn't exist, send an appropriate error response
      return next({
        name: "InvalidCredentialsError",
        message: "Invalid username",
      });
    }

    // Check if the password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // If the password doesn't match, send an appropriate error response
      return next({
        name: "InvalidCredentialsError",
        message: "Invalid password",
      });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = generateToken(user.id, user.username);

    // Return the response
    res.send({
      message: "You're logged in!",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me
router.get("/me", async (req, res, next) => {
  try {
    // Get the current user based on the authentication token
    const currentUser = req.user;

    res.send({
      id: currentUser.id,
      username: currentUser.username,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  try {
    const { username } = req.params;

    // Get the user's routines based on the username
    const userRoutines = await getRoutinesByUsername(username);

    res.send({
      routines: userRoutines,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
