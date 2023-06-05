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
    const { rows:routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id
    `);

    const allRoutines = await attachActivitiesToRoutines(routines);

    return allRoutines;

    return rows;
  } catch (error) {
    console.error('Error while getting all routines');
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

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {
  try {
    await client.query(
      'DELETE FROM routine_activities WHERE id = $1',
      [id]
    );

    // Delete the routine
    // still in progress
    // Passed first test to delete routine from db, but failed to delete routine_activies
    const result = await client.query(
      'DELETE FROM routines WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error('Routine not found');
    }

    console.log('Routine successfully deleted');
  } catch (error) {
    console.error('Error while deleting routine');
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
