// Package Imports
import { DataTypes, Model } from "sequelize";

// File Imports
import sequelize from "../db/config";
import { User } from "./User";

// Type Imports
import type {
  Association,
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
  CreationOptional,
  NonAttribute,
} from "sequelize";

// Type Declarations
type Roles = "operator" | "dispatcher" | "supervisor" | "admin";

// Class Declaration
export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare name: Roles;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare hasUser: BelongsToManyHasAssociationMixin<User, User["id"]>;
  declare hasUsers: BelongsToManyHasAssociationMixin<User, User["id"]>;
  declare setUsers: BelongsToManySetAssociationsMixin<User, User["id"]>;
  declare addUser: BelongsToManyAddAssociationMixin<User, User["id"]>;
  declare addUsers: BelongsToManyAddAssociationsMixin<User, User["id"]>;
  declare removeUser: BelongsToManyRemoveAssociationMixin<User, User["id"]>;
  declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, User["id"]>;
  declare createUser: BelongsToManyCreateAssociationMixin<User>;

  // You can also pre-declare possible inclusions, these will only be
  // populated if you actively include a relation.
  declare users?: NonAttribute<User[]>;

  declare static associations: {
    users: Association<Role, User>;
  };
}

// Model Inizialization
Role.init(
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
      singular: "role",
      plural: "roles",
    },
    tableName: "roles",
    timestamps: false,
    paranoid: true,
  }
);
