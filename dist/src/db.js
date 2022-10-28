"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Models = exports.checkConnection = void 0;
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const sequelize = new sequelize_1.Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`, {
    logging: false,
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
// Test function to check the connectivity to the database.
const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
exports.checkConnection = checkConnection;
const basename = path_1.default.basename(__filename);
const modelDefiners = [];
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
const modelFilenames = fs_1.default
    .readdirSync(path_1.default.join(__dirname, "/models"))
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js");
modelFilenames.forEach((file) => modelDefiners.push(require(path_1.default.join(__dirname, "/models", file))));
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => {
    model(sequelize);
});
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
    entry[0][0].toUpperCase() + entry[0].slice(1),
    entry[1],
]);
sequelize.models =
    Object.fromEntries(capsEntries);
// Aqui irian las declaraciones de las junction tables.
// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Ccp, Municipality, Parish, Quadrant, Role, User } = sequelize.models;
// Aca vendrian las relaciones
// Ejemplo: Product.hasMany(Reviews);
Municipality.hasMany(Parish, {
    sourceKey: "id",
    foreignKey: "municipalityId",
    as: "parishes", // this determines the name in `associations`!
});
Parish.belongsTo(Municipality, {
    foreignKey: "municipalityId",
});
exports.Models = sequelize.models; // Para importar un objeto con solo los modelos: import { Models } from "./db.js"
exports.default = sequelize; // Para importar la conexión: import conn = from './db.js';
