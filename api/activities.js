const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
    getAllActivities,
    updateActivity,
    createActivity,
    getActivityByName,
    getActivityById,

} = require("../db/activities");

const{
    getPublicRoutinesByActivity
} = require("../db/routines");

//GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    try {
      const { activityId } = req.params;
      
    

      // Check if the activity exists
      const existingActivity = await getActivityById(activityId);
      if (!existingActivity) {
        console.log (activityId)
        return next({
          error: "ActivityNotFoundError",
          message: "Activity 10000 not found",
          name: "ActivityNotFoundError",
        });
      }
      
      // Get the public routines that feature the activity
      const publicRoutines = await getPublicRoutinesByActivity(activityId);

      
      res.send(publicRoutines);
    } catch (error) {
      next(error);
    }
  });

// GET /api/activities
router.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.send(activities);
    } catch (error) {
        next(error);
    }
});

// POST /api/activities
router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Check if an activity with the same name already exists
        const existingActivity = await getActivityByName(name);
        if (existingActivity) {
            return next({
                error: "ActivityExistsError",
                message: "An activity with name " + name + " already exists",
                name: "ActivityExistsError",
            });
        }

        // Create the new activity
        const newActivity = await createActivity({ name, description });

        // Sign the JWT token with the new activity's information
        const token = jwt.sign(
            { id: newActivity.id, name: newActivity.name, description: newActivity.description },
            JWT_SECRET
        );

        res.send({ name: newActivity.name, description: newActivity.description, token });

    } catch (error) {
        next(error);
    }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { name, description } = req.body;

        // Check if the activity exists
        const existingActivity = await getActivityById(activityId);
        if (!existingActivity) {
            return next({
                error: "ActivityNotFoundError",
                message: "Activity 10000 not found",
                name: "ActivityNotFoundError",
            });
        }

        // Check if the new name already exists for another activity
    const activityWithSameName = await getActivityByName(name);
    if (activityWithSameName && activityWithSameName.id !== activityId) {
      return next({
        error: "ActivityNameConflictError",
        message: "An activity with name " + name + " already exists",
        name: "ActivityNameConflictError",
      });
    }

    const updatedActivity = await updateActivity(activityId, { name, description });

    res.send({ name: updatedActivity.name, description: updatedActivity.description });
    
    } catch (error) {
        next(error);
    }
});


module.exports = router;
