"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Municipality = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
class Municipality extends sequelize_1.Model {
}
exports.Municipality = Municipality;
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    Municipality.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z\s]*$/i,
            },
        },
    }, {
        sequelize,
        tableName: path_1.default
            .basename(__filename, path_1.default.extname(__filename))
            .toLowerCase(),
        timestamps: false,
    });
};
