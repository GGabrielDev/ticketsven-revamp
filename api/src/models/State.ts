// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";
import HighRiskVictim from "./HighRiskVictim";
import Municipality from "./Municipality";
import Ticket from "./Ticket";

// Type Imports
import type {
  Association,
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
  CreationOptional,
  NonAttribute,
} from "sequelize";

// Class Declaration
export default class State extends Model<
  InferAttributes<State>,
  InferCreationAttributes<State>
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
    "stateId"
  >;

  declare getMunicipalities: HasManyGetAssociationsMixin<Municipality>; // Note the null assertions!
  declare countMunicipalities: HasManyCountAssociationsMixin;
  declare hasMunicipality: HasManyHasAssociationMixin<
    Municipality,
    Municipality["id"]
  >;
  declare hasMunicipalities: HasManyHasAssociationsMixin<
    Municipality,
    Municipality["id"]
  >;
  declare setMunicipalities: HasManySetAssociationsMixin<
    Municipality,
    Municipality["id"]
  >;
  declare addMunicipality: HasManyAddAssociationMixin<
    Municipality,
    Municipality["id"]
  >;
  declare addMunicipalities: HasManyAddAssociationsMixin<
    Municipality,
    Municipality["id"]
  >;
  declare removeMunicipality: HasManyRemoveAssociationMixin<
    Municipality,
    Municipality["id"]
  >;
  declare removeMunicipalities: HasManyRemoveAssociationsMixin<
    Municipality,
    Municipality["id"]
  >;
  declare createMunicipality: HasManyCreateAssociationMixin<
    Municipality,
    "stateId"
  >;

  declare getTickets: HasManyGetAssociationsMixin<Ticket>; // Note the null assertions!
  declare countTickets: HasManyCountAssociationsMixin;
  declare hasTicket: HasManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: HasManyHasAssociationsMixin<Ticket, Ticket["id"]>;
  declare setTickets: HasManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: HasManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: HasManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: HasManyRemoveAssociationMixin<Ticket, Ticket["id"]>;
  declare removeTickets: HasManyRemoveAssociationsMixin<Ticket, Ticket["id"]>;
  declare createTicket: HasManyCreateAssociationMixin<Ticket, "stateId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare highRiskVictims?: NonAttribute<HighRiskVictim[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare municipalities?: NonAttribute<Municipality[]>;
  declare tickets?: NonAttribute<Ticket[]>;

  declare static associations: {
    highRiskVictims: Association<State, HighRiskVictim>;
    municipalities: Association<State, Municipality>;
    tickets: Association<State, Ticket>;
  };
}

// Model Inizialization
State.init(
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
      singular: "state",
      plural: "states",
    },
    tableName: "states",
    paranoid: true,
  }
);
