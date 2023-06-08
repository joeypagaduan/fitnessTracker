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
router.post("/", requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id;
  
    try {
        const newRoutine = await createRoutine({
            creatorId,
            isPublic,
            name,
            goal,
        });
  
        res.send(newRoutine);

    } catch ({ name, message }) {
        next({ name, message });
    }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
