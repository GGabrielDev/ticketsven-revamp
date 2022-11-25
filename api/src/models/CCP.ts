import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
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
  Sequelize,
} from "sequelize";
import { Parish } from "./Parish";
import { Quadrant } from "./Quadrant";

export class CCP extends Model<
  InferAttributes<CCP>,
  InferCreationAttributes<CCP>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare parishId: ForeignKey<Parish["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare parish?: NonAttribute<Parish>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getParish: BelongsToGetAssociationMixin<Parish>;
  declare setParish: BelongsToSetAssociationMixin<Parish, Parish["id"]>;
  declare createParish: BelongsToCreateAssociationMixin<Parish>;

  declare getQuadrants: HasManyGetAssociationsMixin<Quadrant>; // Note the null assertions!
  declare countQuadrants: HasManyCountAssociationsMixin;
  declare hasQuadrant: HasManyHasAssociationMixin<Quadrant, Quadrant["id"]>;
  declare hasQuadrants: HasManyHasAssociationsMixin<Quadrant, Quadrant["id"]>;
  declare setQuadrants: HasManySetAssociationsMixin<Quadrant, Quadrant["id"]>;
  declare addQuadrant: HasManyAddAssociationMixin<Quadrant, Quadrant["id"]>;
  declare addQuadrants: HasManyAddAssociationsMixin<Quadrant, Quadrant["id"]>;
  declare removeQuadrant: HasManyRemoveAssociationMixin<
    Quadrant,
    Quadrant["id"]
  >;
  declare removeQuadrants: HasManyRemoveAssociationsMixin<
    Quadrant,
    Quadrant["id"]
  >;
  declare createQuadrant: HasManyCreateAssociationMixin<Quadrant, "ccpId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare quadrants?: NonAttribute<Quadrant[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    quadrants: Association<Parish, Quadrant>;
  };
}

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize: Sequelize) => {
  // defino el modelo
  CCP.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z\s]*$/i,
        },
      },
    },
    {
      sequelize,
      tableName: "ccps",
      timestamps: false,
    }
  );
};
