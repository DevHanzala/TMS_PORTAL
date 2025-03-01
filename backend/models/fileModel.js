import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DBconnection.js";

const File = sequelize.define("File", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filedata: {
    type: DataTypes.BLOB("long"), // Store CSV as binary
    allowNull: false,
  },
});

export default File;
