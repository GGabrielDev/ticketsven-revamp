"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const path_1 = __importDefault(require("path"));
const saltRounds = 10;
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(path_1.default.basename(__filename, path_1.default.extname(__filename)).toLowerCase(), {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            validate: {
                is: /[^A-Za-z0-9]+$/i,
            },
        },
        fullname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z\s]*$/i,
            },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            set(value) {
                let resultHash = "";
                bcrypt_1.default.hash(value, saltRounds, function (_, hash) {
                    resultHash = hash;
                });
                this.setDataValue("password", resultHash);
            },
        },
    }, { timestamps: false });
};
