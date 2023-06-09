const client = require("./client");
const bcrypt = require("bcrypt");


// database functions

// user functions
async function createUser({ username, password }) {

  
  const SALT_COUNT = 5;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)


  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, hashedPassword]);

    delete user.password;
    return user;

  } catch (error) {
    throw error;
  }
};

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;

  const isValid = await bcrypt.compare(password, hashedPassword);

  if (isValid) {
    delete user.password
    return user;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=$1
    `, [userId]);

    delete user.password

    if (!user) {
      return null
    }
    // const { password, ...userData } = user;

    return user;

  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);

console.log(username)

    return user;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
