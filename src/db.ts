import { Sequelize, Model, ModelStatic } from "sequelize";
import fs from "fs";
import path from "path";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
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
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
(sequelize.models as { [key: string]: ModelStatic<Model> }) =
  Object.fromEntries(capsEntries);

// Aqui irian las declaraciones de las junction tables.

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Ccp, Municipality, Parish, Quadrant, Role, User } = sequelize.models;

// Aca vendrian las relaciones
// Ejemplo: Product.hasMany(Reviews);
Role.hasMany(User);
User.belongsTo(Role);
Municipality.hasMany(Parish);
Parish.belongsTo(Municipality);
Quadrant.belongsTo(Parish);
Parish.hasMany(Quadrant);
Ccp.belongsTo(Parish);
Parish.hasMany(Ccp);

export const Models = sequelize.models; // Para importar un objeto con solo los modelos: import { Models } from "./db.js"
export default sequelize; // Para importar la conexión: import conn = from './db.js';
