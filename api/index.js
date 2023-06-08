const express = require('express');
const router = express.Router();

const jwt = require("jsonwebtoken");
const {JWT_SECRET } = process.env;

const {getUserById} = require("../db");

// auth
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.headers.authorization;

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const pToken = jwt.verify(token, JWT_SECRET);
      const id = pToken && pToken.id;

      if (id) {
        req.user = await getUserById(id);
        next();
      } else{
        next();
      }
    } catch ({name, message}) {
      next ({name, message});
    }
  } else {
    next({
      name: "AuthorizationError",
      message: `Authorization token must begin with ${prefix}`,
    });
  };
});

// GET /api/health
router.get('/health', async (req, res, next) => {
  try {
    res.send({ message: 'Service is healthy' });
  } catch (error) {
    next(error);
  }
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
