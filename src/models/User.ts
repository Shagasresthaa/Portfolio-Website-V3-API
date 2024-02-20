import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db";

// Define an interface for the model attributes
interface UserAttributes {
  id: CreationOptional<number>;
  username: string;
  password: string;
  email: string;
  fullName?: string; // Optional attribute
  superuser: CreationOptional<boolean>; // Automatically generated, optional when creating, defaults to 'false'
  createdAt: CreationOptional<Date>; // Automatically generated, optional when creating
}

// Extend the Model class, using the interface for attributes
export class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes
{
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare email: string;
  declare fullName?: string;
  declare superuser: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    superuser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);
