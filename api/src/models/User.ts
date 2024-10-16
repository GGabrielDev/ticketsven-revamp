// Package Imports
import { DataTypes, Model } from "sequelize";
import * as bcrypt from "bcryptjs";

// File Imports
import sequelize from "../db/config";
import Ticket from "./Ticket";
import Role from "./Role";

// Type Imports
import type {
  CreationOptional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Association,
} from "sequelize";

// Const Declarations
const saltRounds = 10;

// Class Declaration
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare username: string;
  declare fullname: string;
  declare password: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getRoles: BelongsToManyGetAssociationsMixin<Role>;
  declare countRoles: BelongsToManyCountAssociationsMixin;
  declare hasRole: BelongsToManyHasAssociationMixin<Role, Role["id"]>;
  declare hasRoles: BelongsToManyHasAssociationMixin<Role, Role["id"]>;
  declare setRoles: BelongsToManySetAssociationsMixin<Role, Role["id"]>;
  declare addRole: BelongsToManyAddAssociationMixin<Role, Role["id"]>;
  declare addRoles: BelongsToManyAddAssociationsMixin<Role, Role["id"]>;
  declare removeRole: BelongsToManyRemoveAssociationMixin<Role, Role["id"]>;
  declare removeRoles: BelongsToManyRemoveAssociationsMixin<Role, Role["id"]>;
  declare createRole: BelongsToManyCreateAssociationMixin<Role>;

  declare getTickets: BelongsToManyGetAssociationsMixin<Ticket>;
  declare countTickets: BelongsToManyCountAssociationsMixin;
  declare hasTicket: BelongsToManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: BelongsToManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare setTickets: BelongsToManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: BelongsToManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: BelongsToManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: BelongsToManyRemoveAssociationMixin<
    Ticket,
    Ticket["id"]
  >;
  declare removeTickets: BelongsToManyRemoveAssociationsMixin<
    Ticket,
    Ticket["id"]
  >;
  declare createTicket: BelongsToManyCreateAssociationMixin<Ticket>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare tickets?: NonAttribute<Ticket[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare roles?: NonAttribute<Role[]>;

  public declare static associations: {
    roles: Association<User, Role>;
    tickets: Association<User, Ticket>;
  };

  declare validatePassword: NonAttribute<(password: string) => boolean>;
}

// Model Inizialization
User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        is: /[a-zA-Z0-9]+$/g,
      },
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z\s.]+$/g,
      },
    },
    password: {
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
      singular: "user",
      plural: "users",
    },
    tableName: "users",
    paranoid: true,
  }
);
// Model Hooks
User.beforeCreate(async (user) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    user.setDataValue("password", hash);
  } catch (error) {
    console.error(error);
  }
});
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(user.password, salt);
      user.setDataValue("password", hash);
    } catch (error) {
      console.error(error);
    }
  }
});
User.prototype.validatePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};
