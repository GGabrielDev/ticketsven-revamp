import {
  Association,
  DataTypes,
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
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { User } from "./User";

export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getUsers: HasManyGetAssociationsMixin<User>; // Note the null assertions!
  declare countUsers: HasManyCountAssociationsMixin;
  declare hasUser: HasManyHasAssociationMixin<User, User["id"]>;
  declare hasUsers: HasManyHasAssociationsMixin<User, User["id"]>;
  declare setUsers: HasManySetAssociationsMixin<User, User["id"]>;
  declare addUser: HasManyAddAssociationMixin<User, User["id"]>;
  declare addUsers: HasManyAddAssociationsMixin<User, User["id"]>;
  declare removeUser: HasManyRemoveAssociationMixin<User, User["id"]>;
  declare removeUsers: HasManyRemoveAssociationsMixin<User, User["id"]>;
  declare createUser: HasManyCreateAssociationMixin<User, "roleId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare users?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    users: Association<Role, User>;
  };
}

Role.init(
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
