const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET } = process.env;

const{
    getRoutineActivityById, 
    updateRoutineActivity,
    destroyRoutineActivity,
} = require("../db/routine_activities");

const { getRoutineById } = require("../db/routines");

const { requireUser } = require("./requireUser");



// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const { routineId } = req.params;
      const { count, duration } = req.body;

      const routine = await getRoutineById(routineId);    
  
    const existingRoutineActivity = await getRoutineActivityById(routineActivityId);
   
    console.log(existingRoutineActivity.name)
    

         // Check if the authenticated user is the owner of the routine
         
         if (existingRoutineActivity.creatorId !== req.user.id) {
      return next({
        error: "UnauthorizedError",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        name: "UnauthorizedError",
      });
    }
    
      // Update the routine activity
      existingRoutineActivity.count = count;
      existingRoutineActivity.duration = duration;
      const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, { count, duration });
    
      res.send(updatedRoutineActivity);
    } catch (error) {
      next(error);
    }
  });
  
// DELETE /routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;

    // // Retrieve the routine activity
    // const routineActivity = await getRoutineActivityById(routineActivityId);

    // // Check if the routine activity exists
    // if (!routineActivity) {
    //   return res.status(404).json({ message: 'Routine activity not found' });
    // }

    // // Check if the authenticated user is the owner of the routine activity
    // if (routineActivity.creatorId !== req.user.id) {
    //   return res.status(403).json({ message: 'User is not allowed to delete this routine activity' });
    // }

    // Delete the routine activity
    const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId);

    res.send(deletedRoutineActivity);
    } catch (error) {
      next(error);
    }
   
});
  
  module.exports = router;
  

