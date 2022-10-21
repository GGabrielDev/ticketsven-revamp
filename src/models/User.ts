import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import path from "path";

const saltRounds = 10;

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize: Sequelize) => {
  // defino el modelo
  sequelize.define(
    path.basename(__filename, path.extname(__filename)).toLowerCase(),
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          is: /[^A-Za-z0-9]+$/i,
        },
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z\s]*$/i,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
          let resultHash = "";
          bcrypt.hash(value, saltRounds, function (_, hash) {
            resultHash = hash;
          });
          this.setDataValue("password", resultHash);
        },
      },
    },
    { timestamps: false }
  );
};
