// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";
import Item from "./Item";

// Type Imports
import type {
  Association,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  NonAttribute,
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

  declare getItems: HasManyGetAssociationsMixin<Item>; // Note the null assertions!
  declare countItems: HasManyCountAssociationsMixin;
  declare hasItem: HasManyHasAssociationMixin<Item, Item["id"]>;
  declare hasItems: HasManyHasAssociationsMixin<Item, Item["id"]>;
  declare setItems: HasManySetAssociationsMixin<Item, Item["id"]>;
  declare addItem: HasManyAddAssociationMixin<Item, Item["id"]>;
  declare addItems: HasManyAddAssociationsMixin<Item, Item["id"]>;
  declare removeItem: HasManyRemoveAssociationMixin<Item, Item["id"]>;
  declare removeItems: HasManyRemoveAssociationsMixin<Item, Item["id"]>;
  declare createItem: HasManyCreateAssociationMixin<Item, "deparmentId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare items?: NonAttribute<Item[]>;

  declare static associations: {
    items: Association<Deparment, Item>;
  };
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
