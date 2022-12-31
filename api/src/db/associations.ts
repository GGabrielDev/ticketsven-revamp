import { CCP } from "../models/CCP";
import { Municipality } from "../models/Municipality";
import { Parish } from "../models/Parish";
import { Quadrant } from "../models/Quadrant";
import { Reason } from "../models/Reason";
import { Role } from "../models/Role";
import { Ticket } from "../models/Ticket";
import { User } from "../models/User";

export default () => {
  // CCP associations
  CCP.belongsTo(Parish, { foreignKey: "parishId", as: "parish" });
  CCP.hasMany(Quadrant, {
    sourceKey: "id",
    foreignKey: "ccpId",
    as: "quadrants",
  });

  // Municipality associations
  Municipality.hasMany(Parish, {
    sourceKey: "id",
    foreignKey: "municipalityId",
    as: "parishes",
  });
  Municipality.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "municipalityId",
    as: "tickets",
  });

  // Parish associations
  Parish.belongsTo(Municipality, {
    foreignKey: "municipalityId",
    as: "municipality",
  });
  Parish.hasMany(CCP, { sourceKey: "id", foreignKey: "parishId", as: "ccps" });
  Parish.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "parishId",
    as: "tickets",
  });

  // Quadrant associations
  Quadrant.belongsTo(CCP, { foreignKey: "ccpId", as: "ccp" });

  // Reason associations
  Reason.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "reasonId",
    as: "tickets",
  });

  // Role associations
  Role.hasMany(User, { sourceKey: "id", foreignKey: "roleId", as: "users" });

  // Ticket associations
  Ticket.belongsTo(Municipality, {
    foreignKey: "municipalityId",
    as: "municicpality",
  });
  Ticket.belongsTo(Parish, { foreignKey: "parishId", as: "parish" });
  Ticket.belongsTo(Reason, { foreignKey: "reasonId", as: "reason" });
  Ticket.belongsToMany(User, {
    sourceKey: "id",
    foreignKey: "ticketId",
    as: "tickets",
    through: "user_tickets",
  });

  // User associations
  User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
  User.belongsToMany(Ticket, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "users",
    through: "user_tickets",
  });
};
