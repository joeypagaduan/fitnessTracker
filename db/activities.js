const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const { rows: [ activity] } = await client.query(`
      INSERT INTO activities(name, description) 
      VALUES($1, $2) 
      RETURNING *;
    `, [name, description]);
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(`
      SELECT * FROM activities;
    `);

    return activities;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities
      WHERE id = $1;
    `, [id]);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities
      WHERE name = $1;
    `, [name]);

    return activity;
  } catch (error) {
    throw error;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  try {
    const routineIds = routines.map((routine) => routine.id);
    const { rows: routineActivities } = await client.query(`
      SELECT * FROM routine_activit
      WHERE routineId = ANY($1);
    `, [routineIds]);

    const routineActivitiesMap = {};
    for (const routineActivity of routineActivities) {
      if (!routineActivitiesMap[routineActivity.routineId]) {
        routineActivitiesMap[routineActivity.routineId] = [];
      }
      routineActivitiesMap[routineActivity.routineId].push(routineActivity);
    }

    for (const routine of routines) {
      routine.activities = routineActivitiesMap[routine.id] || [];
    }

    return routines;
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  try {
    const fieldEntries = Object.entries(fields);
    const updateParams = fieldEntries.map(([key, value], index) => {
      return `${key} = $${index + 2}`;
    });

    const query = `
      UPDATE activities
      SET ${updateParams.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, ...fieldEntries.map(([, value]) => value)];

    const { rows: [activity] } = await client.query(query, values);

    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
