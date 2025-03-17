// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";

// Type Imports
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

// Class Declaration
export default class Deparment extends Model<
  InferAttributes<Deparment>,
  InferCreationAttributes<Deparment>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;
}

// Model Inizialization
Deparment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    name: {
      singular: "deparment",
      plural: "deparments",
    },
    tableName: "deparments",
    paranoid: true,
  }
);
