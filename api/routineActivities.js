const express = require('express');
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const {JWT_SECRET } = process.env;

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
      const { count, duration } = req.body;
      const existingRoutineActivity = await getRoutineActivityById(routineActivityId);
      const { routineId } = existingRoutineActivity;

      const routine = await getRoutineById(routineId);    
   
      // console.log(existingRoutineActivity.name)

         // Check if the authenticated user is the owner of the routine
         // Update the routine activity
         
         if (routine.creatorId === req.user.id) {
           const updatedRoutineActivity = await updateRoutineActivity({id: routineActivityId, count, duration });
           res.send(updatedRoutineActivity);
         } else {
          res.status(403).send({
            error: "UnauthorizedError",
            message: `User ${req.user.username} is not allowed to update ${routine.name}`,
            name: "UnauthorizedError"
          })
         }
    } catch (error) {
      next(error);
    }
  });
  
  // DELETE /api/routine_activities/:routineActivityId
  router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      // Check if the routine activity exists
      const existingRoutineActivity = await getRoutineActivityById(routineActivityId);
      
      const routine = await getRoutineById(existingRoutineActivity.routineId);
      
      // Delete the routine activity
      if (routine.creatorId === req.user.id) {
        const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId);
        res.send(deletedRoutineActivity);
      } else {
        res.status(403).send({
          error: "UnauthorizedError",
          message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
          name: "UnauthorizedError",
        })
      }
    } catch (error) {
      next(error);
    }
   
});
  
  module.exports = router;
  

