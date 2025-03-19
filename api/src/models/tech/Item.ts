// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../../db/config";
import Deparment from "./Deparment";

// Type Imports
import type {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";

// Class Declaration
export default class Item extends Model<
  InferAttributes<Item>,
  InferCreationAttributes<Item>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;
  declare brand?: string;
  declare model?: string;
  declare serial?: string;
  declare amount: number;
  declare details: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare deparmentId: ForeignKey<Deparment["id"]>;

  // `deparment` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare deparment?: NonAttribute<Deparment>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getDeparment: BelongsToGetAssociationMixin<Deparment>;
  declare setDeparment: BelongsToSetAssociationMixin<
    Deparment,
    Deparment["id"]
  >;
  declare createDeparment: BelongsToCreateAssociationMixin<Deparment>;
}

// Model Inizialization
Item.init(
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
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 1,
    },
    details: {
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
      singular: "item",
      plural: "items",
    },
    tableName: "items",
    timestamps: false,
    paranoid: true,
  }
);
