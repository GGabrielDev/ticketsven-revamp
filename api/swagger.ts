import swaggerAutogen from "swagger-autogen";
import "dotenv/config";

const { API_PORT } = process.env;

const doc = {
  info: {
    title: "Ticketsven API",
    description:
      "Documentación dinamica para API del projecto de Sistema de Control de Incidencias del VEN 9-1-1",
  },
  host: `localhost:${API_PORT}`,
};

const outputFile = "./src/swagger-output.json";
const routes = ["./src/routes/index"];

swaggerAutogen()(outputFile, routes, doc);
