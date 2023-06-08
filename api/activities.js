const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET } = process.env;
const{
    getAllActivities,
    updateActivity, 
    createActivity,
    getActivityByName, 
    getActivityById

}= require("../db/activities");
const{
    getRoutineActivityById
} =

// GET /api/activities/:activityId/routines

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
            message: "An activity with name "+ name + " already exists",
            name: "ActivityExistsError",
          });
        }
    
        // Create the new activity
        const newActivity = await createActivity({name, description});
    
        // Sign the JWT token with the new activity's information
        const token = jwt.sign(
          { id: newActivity.id, name: newActivity.name, description: newActivity.description},
          JWT_SECRET
        );
    
        res.send({name: newActivity.name, description: newActivity.description, token });

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
    const existingActivity = await getActivityById({activityId});
    if (!existingActivity) {
      return next({
        error: "ActivityNotFoundError",
        message: "Activity not found",
        name: "ActivityNotFoundError",
      });
    }
        // Update the activity
        const updatedActivity = await updateActivity(activityId, {name, description });
        
        res.send({ name: name, description: description });
      } catch (error) {
        next(error);
      }

  });
  

module.exports = router;
