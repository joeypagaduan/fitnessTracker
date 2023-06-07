const express = require('express');
const router = express.Router();

const {
    getAllPublicRoutines,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    getRoutineById,
} = require("../db/routines");

const { addActivityToRoutine } = require("../db/routine_activities");
const { requireUser } = require("./requireUser");

router.use((req, res, next) => {
    console.log("Your request has been made");

    next();
});

// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
        const publicRoutines = await getAllPublicRoutines();
        res.send(publicRoutines);
    } catch ({ name, message }) {
        next({ name, message });
    }
});

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
