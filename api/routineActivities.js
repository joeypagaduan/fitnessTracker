const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET } = process.env;
const{
    getRoutineActivityById, 
    updateRoutineActivity,
    destroyRoutineActivity,

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
    
    const routineActivity = await getRoutineActivityById(routineActivityId);
    console.log (routineActivity)
    // Remove the routine activity
     const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId);

     res.send(deletedRoutineActivity);

     

    // Check if the authenticated user is the owner of the routine activity
    if (routineActivity.creatorId !== req.user.id) {
      return res.status(40).json({ message: 'User is not allowed to delete this routine activity' });
    }
   
  } catch (error) {
    next(error);
  }
});
  
  module.exports = router;
  

