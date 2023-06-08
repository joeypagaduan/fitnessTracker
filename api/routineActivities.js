const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET } = process.env;
const{
    getRoutineActivityById, 
    updateRoutineActivity,

} = require("../db/routine_activities")



// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const { count, duration } = req.body;
      
  
    const existingRoutineActivity = await getRoutineActivityById(routineActivityId);
   
console.log(existingRoutineActivity.name)
    

         // Check if the authenticated user is the owner of the routine
         
         if (existingRoutineActivity.creatorId !== req.user.id) {
      return next({
        error: "UnauthorizedError",
        message: `User ${req.user.username} is not allowed to update`,
        name: "UnauthorizedError",
      });
    }
    
      // Update the routine activity
      const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, { count, duration });
    
      res.send(updatedRoutineActivity);
    } catch (error) {
      next(error);
    }
  });
  
  // DELETE /api/routine_activities/:routineActivityId
  router.delete('/:routineActivityId', async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      
      // Check if the routine activity exists
      const existingRoutineActivity = await getRoutineActivityById(routineActivityId);
      if (existingRoutineActivity.creatorId !== req.user.id) {
        return next({
          error: "UnauthorizedError",
          message: routineActivityId.user + " is not allowed to edit this routine activity",
          name: "UnauthorizedError",
        });
      }
    
      // Delete the routine activity
      await deleteRoutineActivity(routineActivityId);
    
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;
  
  
  
  
  
  
  
  
// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
