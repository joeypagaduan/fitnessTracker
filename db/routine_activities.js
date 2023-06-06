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
      SELECT ra."routineId", ra."activityId", ra.count, ra.duration
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
        UPDATE routine_activities ra
        SET ${setString}
        WHERE id = $${Object.values(fields).length + 1}
        RETURNING ra.id, ra.count, ra.duration;
      `, [...Object.values(fields), id]);

      return routineActivity;
  
  // try {
  //   const fieldEntries = Object.entries(fields);
  //   const updateParams = fieldEntries.map(([key, value], index) => {
  //     return `${key} = $${index + 2}`;
  //   });

  //   const query = `
  //     UPDATE routine_activities
  //     SET ${updateParams.join(", ")}
  //     WHERE id = $1
  //     RETURNING *;
  //   `;
  //   const values = [id, ...fieldEntries.map(([, value]) => value)];

  //   const { rows: [routineActivity] } = await client.query(query, values);

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
