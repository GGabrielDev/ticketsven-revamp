// Package Imports
import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
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
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";

// File Imports
import sequelize from "../db/config";
import Municipality from "./Municipality";
import Parish from "./Parish";
import Perpetrator from "./Perpetrator";
import State from "./State";

// Class Declaration
export default class HighRiskVictim extends Model<
  InferAttributes<HighRiskVictim>,
  InferCreationAttributes<HighRiskVictim>
> {
  declare id: CreationOptional<string>;
  declare first_name?: string;
  declare last_name?: string;
  declare age?: number;
  declare id_type?: "V" | "E" | "J"; // enum type
  declare id_number?: number;
  declare remitent: string;
  declare document_number: string;
  declare topic: string;
  declare delivered_date?: Date;
  declare emission_date?: Date;
  declare phone_number?: string;
  declare address?: string;
  declare details?: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods
  // (like Project.belongsTo) by branding them using the `ForeignKey` type,
  // `Project.init` will know it does not need to display an error if
  // ownerId is missing.
  declare municipalityId: ForeignKey<Municipality["id"]>;
  declare parishId: ForeignKey<Parish["id"]>;
  declare stateId: ForeignKey<State["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare municipality: NonAttribute<Municipality>;
  declare parish: NonAttribute<Parish>;
  declare state: NonAttribute<State>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare createState: BelongsToCreateAssociationMixin<State>;
  declare getState: BelongsToGetAssociationMixin<State>;
  declare setState: BelongsToSetAssociationMixin<State, State["id"]>;

  declare createMunicipality: BelongsToCreateAssociationMixin<Municipality>;
  declare getMunicipality: BelongsToGetAssociationMixin<Municipality>;
  declare setMunicipality: BelongsToSetAssociationMixin<
    Municipality,
    Municipality["id"]
  >;

  declare createParish: BelongsToCreateAssociationMixin<Parish>;
  declare getParish: BelongsToGetAssociationMixin<Parish>;
  declare setParish: BelongsToSetAssociationMixin<Parish, Parish["id"]>;

  declare getPerpetrators: HasManyGetAssociationsMixin<Perpetrator>; // Note the null assertions!
  declare countPerpetrators: HasManyCountAssociationsMixin;
  declare hasPerpetrator: HasManyHasAssociationMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare hasPerpetrators: HasManyHasAssociationsMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare setPerpetrators: HasManySetAssociationsMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare addPerpetrator: HasManyAddAssociationMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare addPerpetrators: HasManyAddAssociationsMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare removePerpetrator: HasManyRemoveAssociationMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare removePerpetrators: HasManyRemoveAssociationsMixin<
    Perpetrator,
    Perpetrator["id"]
  >;
  declare createPerpetrator: HasManyCreateAssociationMixin<
    Perpetrator,
    "highRiskVictimId"
  >;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare perpetrators?: NonAttribute<Perpetrator[]>;

  declare static associations: {
    perpetrators: Association<Parish, Perpetrator>;
  };
}

HighRiskVictim.init(
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
    age: {
      type: DataTypes.INTEGER,
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
    remitent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delivered_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emission_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING,
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
      singular: "highRiskVictim",
      plural: "highRiskVictims",
    },
    tableName: "highRiskVictim",
    paranoid: true,
  }
);
