// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";
import Organism from "./Organism";

// Type Imports
import type {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";

// Class Declaration
export default class Contact extends Model<
  InferAttributes<Contact>,
  InferCreationAttributes<Contact>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare name: string;
  declare phone_number: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare organismId: ForeignKey<Organism["id"]>;

  // `organism` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare organism?: NonAttribute<Organism>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getOrganism: BelongsToGetAssociationMixin<Organism>;
  declare setOrganism: BelongsToSetAssociationMixin<Organism, Organism["id"]>;
  declare createOrganism: BelongsToCreateAssociationMixin<Organism>;
}

// Model Inizialization
Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
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
      singular: "contact",
      plural: "contacts",
    },
    tableName: "contacts",
    paranoid: true,
  }
);
