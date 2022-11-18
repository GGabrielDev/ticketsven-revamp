import { Sequelize, Model, ModelStatic } from "sequelize";
import fs from "fs";
import path from "path";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

// Test function to check the connectivity to the database.
export const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const basename = path.basename(__filename);

const modelDefiners: ((arg0: Sequelize) => Model)[] = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
const modelFilenames = fs
  .readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
modelFilenames.forEach((file) =>
  modelDefiners.push(require(path.join(__dirname, "/models", file)))
);

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => {
  model(sequelize);
});
// Aqui irian las declaraciones de las junction tables.

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { CCP, Municipality, Parish, Quadrant, Role, User } = sequelize.models;

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
Parish.hasMany(CCP, {
  sourceKey: "id",
  foreignKey: "parishId",
  as: "ccps", // this determines the name in `associations`!
});
CCP.belongsTo(Parish, {
  foreignKey: "parishId",
});
CCP.hasMany(Quadrant, {
  sourceKey: "id",
  foreignKey: "ccpId",
  as: "quadrants",
});
Quadrant.belongsTo(CCP, {
  foreignKey: "ccpId",
});

export const Models = sequelize.models; // Para importar un objeto con solo los modelos: import { Models } from "./db.js"
export default sequelize; // Para importar la conexión: import conn = from './db.js';
