// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";
import Parish from "./Parish";
import State from "./State";
import Ticket from "./Ticket";

// Type Imports
import type {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
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
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import HighRiskVictim from "./HighRiskVictim";

// Class Declaration
export default class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
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

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare stateId: ForeignKey<State["id"]>;

  // `state` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare state?: NonAttribute<State>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getState: BelongsToGetAssociationMixin<State>;
  declare setState: BelongsToSetAssociationMixin<State, State["id"]>;
  declare createState: BelongsToCreateAssociationMixin<State>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getHighRiskVictim: HasManyGetAssociationsMixin<HighRiskVictim>; // Note the null assertions!
  declare countHighRiskVictim: HasManyCountAssociationsMixin;
  declare hasHighRiskVictim: HasManyHasAssociationMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare hasHighRiskVictims: HasManyHasAssociationsMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare setHighRiskVictim: HasManySetAssociationsMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare addHighRiskVictim: HasManyAddAssociationMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare addHighRiskVictims: HasManyAddAssociationsMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare removeHighRiskVictim: HasManyRemoveAssociationMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare removeHighRiskVictims: HasManyRemoveAssociationsMixin<
    HighRiskVictim,
    HighRiskVictim["id"]
  >;
  declare createHighRiskVictim: HasManyCreateAssociationMixin<
    HighRiskVictim,
    "municipalityId"
  >;

  declare getParishes: HasManyGetAssociationsMixin<Parish>; // Note the null assertions!
  declare countParishes: HasManyCountAssociationsMixin;
  declare hasParish: HasManyHasAssociationMixin<Parish, Parish["id"]>;
  declare hasParishes: HasManyHasAssociationsMixin<Parish, Parish["id"]>;
  declare setParishes: HasManySetAssociationsMixin<Parish, Parish["id"]>;
  declare addParish: HasManyAddAssociationMixin<Parish, Parish["id"]>;
  declare addParishes: HasManyAddAssociationsMixin<Parish, Parish["id"]>;
  declare removeParish: HasManyRemoveAssociationMixin<Parish, Parish["id"]>;
  declare removeParishes: HasManyRemoveAssociationsMixin<Parish, Parish["id"]>;
  declare createParish: HasManyCreateAssociationMixin<Parish, "municipalityId">;

  declare getTickets: HasManyGetAssociationsMixin<Ticket>; // Note the null assertions!
  declare countTickets: HasManyCountAssociationsMixin;
  declare hasTicket: HasManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: HasManyHasAssociationsMixin<Ticket, Ticket["id"]>;
  declare setTickets: HasManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: HasManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: HasManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: HasManyRemoveAssociationMixin<Ticket, Ticket["id"]>;
  declare removeTickets: HasManyRemoveAssociationsMixin<Ticket, Ticket["id"]>;
  declare createTicket: HasManyCreateAssociationMixin<Ticket, "municipalityId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare highRiskVictim?: NonAttribute<HighRiskVictim[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare parishes?: NonAttribute<Parish[]>;
  declare tickets?: NonAttribute<Ticket[]>;

  declare static associations: {
    highRiskVictim: Association<Municipality, HighRiskVictim>;
    parishes: Association<Municipality, Parish>;
    tickets: Association<Municipality, Ticket>;
  };
}

// Model Inizialization
Municipality.init(
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
      singular: "municipality",
      plural: "municipalities",
    },
    tableName: "municipalities",
    paranoid: true,
  }
);
