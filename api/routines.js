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

        // console.log("creatorId", creatorId);
        // console.log("newRoutine: ", newRoutine);

        res.send(newRoutine);

    } catch ({ name, message }) {
        next ({ name, message });
    }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { name, goal, isPublic } = req.body;
    
    const routine = await getRoutineById(routineId);
    
    try {
        if (req.user.id !== routine.creatorId) {
            res.status(403).send({
                error: "Forbidden",
                message:
                    `User ${req.user.username} is not allowed to update ${routine.name}`,
                name: "Forbidden"
            });
        }
        if (req.user.id === routine.creatorId) {
            const updatedRoutine = await updateRoutine({
                id: routineId,
                name,
                goal,
                isPublic,
            });
        res.send(updatedRoutine);
        }
    } catch (error) {
      next (error);
    }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
    
    const { routineId } = req.params;
    const routine = await getRoutineById(req.params.routineId);
    const { creatorId, goal, id, isPublic, name } = routine;

    try{
        if (req.user.id === routine.creatorId) {
            await destroyRoutine(routineId);
            res.send({
                creatorId,
                goal,
                id,
                isPublic,
                name
            });
        } else {
            res.status(403).send({
                error: "Forbidden",
                message:
                    `User ${req.user.username} is not allowed to delete ${routine.name}`,
                name: "Forbidden"
            });
        }
    } catch (error) {
        res.status(403).send(error);
    } 
});

// POST /api/routines/:routineId/activities

module.exports = router;
