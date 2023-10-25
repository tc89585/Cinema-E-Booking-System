const { Sequelize } = require('sequelize');

// Sequelize database connection
const sequelize = new Sequelize('cinema_proj_db', 'admin', 'password', {
  host: 'cinema-db.cexoykt5nvcs.us-east-2.rds.amazonaws.com',
  dialect: 'mysql',
  port: 3306,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

module.exports = sequelize;
