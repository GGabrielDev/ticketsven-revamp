// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../../db/config";
import Deparment from "./Deparment";
import RAM from "./RAM";

// Type Imports
import type {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
  ForeignKey,
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

  declare getRAMs: HasManyGetAssociationsMixin<RAM>; // Note the null assertions!
  declare countRAMs: HasManyCountAssociationsMixin;
  declare hasRAM: HasManyHasAssociationMixin<RAM, RAM["id"]>;
  declare hasRAMs: HasManyHasAssociationsMixin<RAM, RAM["id"]>;
  declare setRAMs: HasManySetAssociationsMixin<RAM, RAM["id"]>;
  declare addRAM: HasManyAddAssociationMixin<RAM, RAM["id"]>;
  declare addRAMs: HasManyAddAssociationsMixin<RAM, RAM["id"]>;
  declare removeRAM: HasManyRemoveAssociationMixin<RAM, RAM["id"]>;
  declare removeRAMs: HasManyRemoveAssociationsMixin<RAM, RAM["id"]>;
  declare createRAM: HasManyCreateAssociationMixin<RAM, "itemId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare rams?: NonAttribute<RAM[]>;

  declare static associations: {
    rams: Association<Deparment, RAM>;
  };
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
    timestamps: true,
    paranoid: true,
  }
);
