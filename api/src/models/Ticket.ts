import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { User } from "./User";
import { Municipality } from "./Municipality";
import { Parish } from "./Parish";
import { Reason } from "./Reason";

export class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare phone_number: string;
  declare caller_name: string;
  declare id_number: number;
  declare id_type: "V" | "E" | "J"; // enum type
  declare address?: string;
  declare reference_point?: string;
  declare details?: string;
  declare call_started?: Date;
  declare call_ended?: Date;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare municipalityId: ForeignKey<Municipality["id"]>;
  declare parishId: ForeignKey<Parish["id"]>;
  declare reasonId: ForeignKey<Reason["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare municipality?: NonAttribute<Municipality>;
  declare parish?: NonAttribute<Parish>;
  declare reason?: NonAttribute<Reason>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare createMunicipality: BelongsToCreateAssociationMixin<Municipality>;
  declare getMunicipality: BelongsToGetAssociationMixin<Municipality>;
  declare setMunicipality: BelongsToSetAssociationMixin<
    Municipality,
    Municipality["id"]
  >;

  declare createParish: BelongsToCreateAssociationMixin<Parish>;
  declare getParish: BelongsToGetAssociationMixin<Parish>;
  declare setParish: BelongsToSetAssociationMixin<Parish, Parish["id"]>;

  declare createReason: BelongsToCreateAssociationMixin<Reason>;
  declare getReason: BelongsToGetAssociationMixin<Reason>;
  declare setReason: BelongsToSetAssociationMixin<Reason, Reason["id"]>;

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

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare users?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    users: Association<Ticket, User>;
  };
}

Ticket.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caller_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_type: {
      type: DataTypes.ENUM("V", "E", "J"),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference_point: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    call_started: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    call_ended: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    name: {
      singular: "ticket",
      plural: "tickets",
    },
    tableName: "tickets",
    paranoid: true,
  }
);
