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
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";
import { Parish } from "./Parish";

export class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
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

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare parishes?: NonAttribute<Parish[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    parishes: Association<Municipality, Parish>;
  };
}

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize: Sequelize) => {
  // defino el modelo
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
    },
    {
      sequelize,
      tableName: "municipalities",
      timestamps: false,
      paranoid: true,
    }
  );
};
