const { Sequelize } = require('sequelize');

// Hardcoded MySQL credentials
const sequelize = new Sequelize('simplify', 'root', 'Burhan4800@', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
    await sequelize.sync(); // Sync models with database
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };