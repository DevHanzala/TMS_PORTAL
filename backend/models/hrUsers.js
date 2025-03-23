// models/hrUser.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../DB/DBconnection.js';

const HrUser = sequelize.define('HrUser', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'hr_users', // Explicit table name
  timestamps: true, // Adds createdAt and updatedAt
});

export default HrUser;

// Sync the model with the database (run this once during setup)
// HrUser.sync({ force: true }); // Uncomment and run once to create the table, then comment out again