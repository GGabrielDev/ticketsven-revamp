// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";
import HighRiskVictim from "./HighRiskVictim";

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
export default class Perpetrator extends Model<
  InferAttributes<Perpetrator>,
  InferCreationAttributes<Perpetrator>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare first_name?: string;
  declare last_name?: string;
  declare id_type?: "V" | "E" | "J"; // enum type
  declare id_number?: number;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare highRiskVictimId: ForeignKey<HighRiskVictim["id"]>;

  // `highRiskVictim` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare highRiskVictim?: NonAttribute<HighRiskVictim>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getHighRiskVictim: BelongsToGetAssociationMixin<HighRiskVictim>;
  declare setHighRiskVictim: BelongsToSetAssociationMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare createHighRiskVictim: BelongsToCreateAssociationMixin<HighRiskVictim>;
}

// Model Inizialization
Perpetrator.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_type: {
      type: DataTypes.ENUM("V", "E", "J"),
      allowNull: true,
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
      singular: "perpetrator",
      plural: "perpetrators",
    },
    tableName: "perpetrator",
    paranoid: true,
  }
);
