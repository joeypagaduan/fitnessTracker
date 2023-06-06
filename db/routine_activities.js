const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration }) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING "routineId", "activityId", count, duration;
    `, [routineId, activityId, count, duration]);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: routineActivity } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id = $1;
    `, [id]);
    // console.log("routineActivity: ", routineActivity);

    return routineActivity;
  } catch (error) {
    console.log("Error getting routineActivity by ID: ", error);
    throw error;
  }
}



async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: activities } = await client.query(`
      SELECT * FROM routine_activities
      WHERE "routineId" = $1;
    `, [id]);

    return activities;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const fieldEntries = Object.entries(fields);
    const updateParams = fieldEntries.map(([key, value], index) => {
      return `${key} = $${index + 2}`;
    });

    const query = `
      UPDATE routine_activities
      SET ${updateParams.join(", ")}
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, ...fieldEntries.map(([, value]) => value)];

    const { rows: [routineActivity] } = await client.query(query, values);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *;
    `, [id]);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT routines."creatorId" AS "creatorId"
      FROM routine_activities
      JOIN routines ON routines.id = routine_activities."routineId"
      WHERE routine_activities.id = $1;
    `, [routineActivityId]);

    if (!routineActivity) {
      throw new Error("Routine activity not found");
    }

    return routineActivity.creatorId === userId;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
