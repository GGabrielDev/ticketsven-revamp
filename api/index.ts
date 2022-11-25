//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import * as dotenv from "dotenv";
dotenv.config();
import server from "./src/app";
import sequelize, { checkConnection, forceInitializer } from "./src/db";

const { API_PORT } = process.env;
const { SELECT_START } = process.env || null;

const startDbNormal = () => {
  sequelize.sync().then(() => {
    server.listen(API_PORT, () => {
      console.log(`Server listening at ${API_PORT} - Normal Start`); // eslint-disable-line no-console
    });
  });
};

const startDbForce = () => {
  sequelize.sync({ force: true }).then(() => {
    server.listen(API_PORT, () => {
      console.log(
        `Server listening at ${API_PORT} - Force Start, creating default data...`
      ); // eslint-disable-line no-console
      forceInitializer();
    });
  });
};
// Syncing all the models at once.
checkConnection().then(async () => {
  SELECT_START === "force" ? startDbForce() : startDbNormal();
});
