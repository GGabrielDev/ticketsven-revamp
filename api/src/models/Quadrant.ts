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
} from "sequelize";
import sequelize from "../db/config";
import { CCP } from "./CCP";

export class Quadrant extends Model<
  InferAttributes<Quadrant>,
  InferCreationAttributes<Quadrant>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare ccpId: ForeignKey<CCP["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare cpp?: NonAttribute<CCP>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getCCP: BelongsToGetAssociationMixin<CCP>;
  declare setCCP: BelongsToSetAssociationMixin<CCP, CCP["id"]>;
  declare createCCP: BelongsToCreateAssociationMixin<CCP>;
}

Quadrant.init(
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
      singular: "quadrant",
      plural: "quadrants",
    },
    tableName: "quadrants",
    timestamps: false,
    paranoid: true,
  }
);
