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
import sequelize, { checkConnection } from "./src/db";

const { DB_PORT } = process.env;
// Syncing all the models at once.
checkConnection().then(async () => {
  sequelize.sync({ alter: true }).then(() => {
    server.listen(DB_PORT, () => {
      console.log(`Server listening at ${DB_PORT}`); // eslint-disable-line no-console
    });
  });
});
