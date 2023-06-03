/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

// POST /api/users/register
router.post("/api/users/register", async (req, res, next) => {
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
  
      // Check if the password is at least 8 characters long
      if (password.length < 8) {
        return next({
          error: "PasswordTooShortError",
          message: "Password should be at least 8 characters long",
        });
      }
  
      // Create a new user account
      const newUser = await createUser(username, password);
  
      // Generate a JSON Web Token (JWT) for authentication
      const token = generateToken(newUser.id, newUser.username);
  
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
      next(error);
    }
  });
  
// POST /api/users/login
router.post("/api/users/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user exists in the database
      const user = await getUserByUsername(username);
  
      if (!user) {
        // If the user doesn't exist, send an appropriate error response
        next({
          name: "InvalidCredentialsError",
          message: "Invalid username",
        });
      }
  
      // Check if the password matches
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        // If the password doesn't match, send an appropriate error response
        next({
          name: "InvalidCredentialsError",
          message: "Invalid password",
        });
      }
  
      // Generate a JSON Web Token (JWT) for authentication
      const token = generateToken(user.id, user.username);
  
      // Return the response
      res.send({
        message: "you're logged in!",
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

// GET /api/users/:username/routines

module.exports = router;
