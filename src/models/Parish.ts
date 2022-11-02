import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
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
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import path from "path";
import { Municipality } from "./Municipality";
import { CCP } from "./CCP";

export class Parish extends Model<
  InferAttributes<Parish>,
  InferCreationAttributes<Parish>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare municipalityId: ForeignKey<Municipality["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare municipality?: NonAttribute<Municipality>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getMunicipality: BelongsToGetAssociationMixin<Municipality>;
  declare setMunicipality: BelongsToSetAssociationMixin<
    Municipality,
    CCP["id"]
  >;
  declare createMunicipality: BelongsToCreateAssociationMixin<Municipality>;

  declare getCcps: HasManyGetAssociationsMixin<CCP>; // Note the null assertions!
  declare countCcps: HasManyCountAssociationsMixin;
  declare hasCcp: HasManyHasAssociationMixin<CCP, CCP["id"]>;
  declare hasCcps: HasManyHasAssociationsMixin<CCP, CCP["id"]>;
  declare setCcps: HasManySetAssociationsMixin<CCP, CCP["id"]>;
  declare addCcp: HasManyAddAssociationMixin<CCP, CCP["id"]>;
  declare addCcps: HasManyAddAssociationsMixin<CCP, CCP["id"]>;
  declare removeCcp: HasManyRemoveAssociationMixin<CCP, CCP["id"]>;
  declare createCcp: HasManyCreateAssociationMixin<CCP, "parishId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare ccps?: NonAttribute<CCP[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    ccps: Association<Parish, CCP>;
  };
}
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize: Sequelize) => {
  // defino el modelo
  Parish.init(
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
      tableName: path
        .basename(__filename, path.extname(__filename))
        .toLowerCase(),
      timestamps: false,
    }
  );
};
