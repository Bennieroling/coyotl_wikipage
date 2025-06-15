require('dotenv').config({ path: '../.env' });
const { connectDB } = require('./config/db');
const { User } = require('./models');

async function checkUsers() {
  try {
    await connectDB();
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt']
    });
    console.log('Users in database:');
    console.table(users.map(u => u.dataValues));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
checkUsers();
