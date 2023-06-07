const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration }) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
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
      SELECT *
      FROM routine_activities ra
      WHERE "routineId" = ${id};
    `);

    return activities;
  } catch (error) {
    console.log("Error getting routine activities by routine: ", error);
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  };
  
  try {
      const { rows: [routineActivity] } = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id = $${Object.values(fields).length + 1}
        RETURNING *;
      `, [...Object.values(fields), id]);
      console.log("string: ", setString);
      console.log("Id: ", id);
      console.log("RA: ", routineActivity);

      return routineActivity;
  
  } catch (error) {
    console.log("Error Updating Routine Activity: ", error);
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
    console.log("Error destroying routine activity: ", error);
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  
try {
  const { rows: [ activity ] } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id =$1
  `, [ userId ]);
//join routine and reference "creatorId"

  return (activity && activity.id === userId) ? true : false;

} catch (error) {
  console.log(error);
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
