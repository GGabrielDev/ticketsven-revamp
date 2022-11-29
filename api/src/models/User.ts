import {
  CreationOptional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import bcrypt from "bcryptjs";
import { Role } from "./Role";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare username: string;
  declare fullname: string;
  declare password: string;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare roleId: ForeignKey<Role["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare role?: NonAttribute<Role>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getRole: BelongsToGetAssociationMixin<Role>;
  declare setRole: BelongsToSetAssociationMixin<Role, Role["id"]>;
  declare createRole: BelongsToCreateAssociationMixin<Role>;

  declare validatePassword: NonAttribute<(password: any) => boolean>;
}

const saltRounds = 10;

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize: Sequelize) => {
  // defino el modelo
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
          is: /[a-z0-9]+$/i,
        },
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z\s.]*$/i,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: false,
      paranoid: true,
    }
  );
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
};
