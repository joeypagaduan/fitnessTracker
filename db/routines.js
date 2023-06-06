const client = require("./client");

const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal ) 
      VALUES($1, $2, $3, $4) 
      RETURNING *;
    `, [ creatorId, isPublic, name, goal ]);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * 
      FROM routines
      WHERE id = $1;
    `, [id]);

    return routine;
  } catch (error) {
    console.error("Can't get Routine by ID, err");
    throw error;
  }
};

async function getRoutinesWithoutActivities() {
  // still in progress
  try {
    const {rows} = await client.query(`
      SELECT * FROM routines
      WHERE id NOT IN (
        SELECT DISTINCT "routineId" 
        FROM routine_activities
      )
    `);

    return rows;
  } catch (error) {
    console.error('Error while getting routines without activities');
    throw error;
  }
};

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      JOIN users u
        ON r."creatorId" = u.id;
    `);

    const allRoutines = await attachActivitiesToRoutines(routines);
    // console.log(allRoutines);
    return allRoutines;

  } catch (error) {
    console.error('Error while getting all routines: ', error);
    throw error;
  }
};

async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines } = await client.query(`
    select
      u.username AS "creatorName" 
    , r.*
    FROM routines r
    INNER JOIN users u
    ON r."creatorId" = u.id
    WHERE r."isPublic" = true;
    `);

    const allPublicRoutines = await attachActivitiesToRoutines(
      publicRoutines
    );
    return allPublicRoutines;
  } catch (error) {
    console.error("Error while getting all Public Routines" ,error);
    throw err;
  }
}

async function getAllRoutinesByUser({ username }) {
  try{
    const {rows:routines } = await client.query(`
      SELECT r.*, u.username 
      AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id 
      WHERE u.username = $1;   
      `
    , [username]);
    const getAllRoutinesByUser = await attachActivitiesToRoutines(routines);
      return getAllRoutinesByUser;

  }
  catch(error){    
    console.log("Error while getting routines by user", error);
    throw error;
  }
}


async function getPublicRoutinesByUser({ username }) {
  try{
    const {rows:routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id   
      WHERE r."isPublic" = true and u.username = $1;
      `
    , [username]);
    const publicRoutinesByUser = await attachActivitiesToRoutines(routines);
      return publicRoutinesByUser;

  }
  catch(error){    
    console.log("Error while getting public routines by user", error);
    throw error;
  }

}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const {rows: publicRoutinesByActivity } = await client.query(
    `
      SELECT u.username as "creatorName", r.*
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id
      WHERE r."isPublic" = true;
      `
    );
      const activityPublicRoutines = await attachActivitiesToRoutines(publicRoutinesByActivity);

      const idActivityPublicRoutines = activityPublicRoutines.filter(obj=> {
        return obj.activities.some(activity => {
          return activity.id === id
        })
      })

      return idActivityPublicRoutines
  }
  catch(error){    
    console.log("Error getting Public Routines By Activity", error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const { rows: [updatedRoutine] } = await client.query(`
        UPDATE routines
        SET ${setString}
        WHERE id = $${Object.keys(fields).length + 1}
        RETURNING *;
      `, [...Object.values(fields), id]);

      return updatedRoutine;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

}

async function destroyRoutine(id) {
  try {
    await client.query(
      `DELETE FROM routine_activities
      WHERE "routineId" = $1;`
    , [id]);

    // Delete the routine
    const result = await client.query(
      `DELETE FROM routines
      WHERE id = $1;`
    , [id]);

    if (result.rowCount === 0) {
      throw new Error('Routine not found');
    }

    console.log('Routine successfully deleted');
  } catch (error) {
    console.error('Error while deleting routine', error);
    throw error;
  }
;}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};