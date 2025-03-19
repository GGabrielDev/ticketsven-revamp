// File Imports
import Contact from "../models/Contact";
import Deparment from "../models/tech/Deparment";
import Item from "../models/tech/Item";
import Municipality from "../models/Municipality";
import Organism from "../models/Organism";
import OrganismGroup from "../models/OrganismGroup";
import Parish from "../models/Parish";
import Quadrant from "../models/Quadrant";
import Reason from "../models/Reason";
import Role from "../models/Role";
import State from "../models/State";
import Ticket from "../models/Ticket";
import User from "../models/User";

export default () => {
  // State associations
  State.hasMany(Municipality, {
    sourceKey: "id",
    foreignKey: "stateId",
    as: "municipalities",
  });
  State.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "stateId",
    as: "tickets",
  });

  // Municipality associations
  Municipality.belongsTo(State, {
    foreignKey: "stateId",
    as: "state",
  });
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

  // Organism associations
  Organism.belongsTo(OrganismGroup, {
    foreignKey: "organismGroupId",
    as: "organismGroup",
  });
  Organism.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "organismId",
    as: "tickets",
  });
  Organism.hasMany(Contact, {
    sourceKey: "id",
    foreignKey: "organismId",
    as: "contacts",
  });

  // Organism Group associations
  OrganismGroup.hasMany(Organism, {
    sourceKey: "id",
    foreignKey: "organismGroupId",
    as: "organisms",
  });
  OrganismGroup.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "organismGroupId",
    as: "tickets",
  });

  // Parish associations
  Parish.belongsTo(Municipality, {
    foreignKey: "municipalityId",
    as: "municipality",
  });
  Parish.hasMany(Quadrant, {
    sourceKey: "id",
    foreignKey: "parishId",
    as: "quadrants",
  });
  Parish.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "parishId",
    as: "tickets",
  });

  // Quadrant associations
  Quadrant.belongsTo(Parish, { foreignKey: "parishId", as: "parish" });
  Quadrant.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "quadrantId",
    as: "tickets",
  });

  // Reason associations
  Reason.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "reasonId",
    as: "tickets",
  });

  // Role associations
  Role.belongsToMany(User, {
    sourceKey: "id",
    foreignKey: "roleId",
    through: "user_roles",
  });

  // Ticket associations
  Ticket.belongsTo(State, {
    foreignKey: "stateId",
    as: "state",
  });
  Ticket.belongsTo(Municipality, {
    foreignKey: "municipalityId",
    as: "municipality",
  });
  Ticket.belongsTo(Organism, { foreignKey: "organismId", as: "organism" });
  Ticket.belongsTo(OrganismGroup, {
    foreignKey: "organismGroupId",
    as: "organismGroup",
  });
  Ticket.belongsTo(Parish, { foreignKey: "parishId", as: "parish" });
  Ticket.belongsTo(Quadrant, { foreignKey: "quadrantId", as: "quadrant" });
  Ticket.belongsTo(Reason, { foreignKey: "reasonId", as: "reason" });
  Ticket.belongsToMany(User, {
    sourceKey: "id",
    foreignKey: "ticketId",
    through: "user_tickets",
  });

  // User associations
  User.belongsToMany(Role, {
    sourceKey: "id",
    foreignKey: "userId",
    through: "user_roles",
  });
  User.belongsToMany(Ticket, {
    sourceKey: "id",
    foreignKey: "userId",
    through: "user_tickets",
  });

  // Contact associations
  Contact.belongsTo(Organism, {
    foreignKey: "organismId",
    as: "organism",
  });

  // Item associations
  Item.belongsTo(Deparment, { foreignKey: "departmentId", as: "deparment" });

  // Deparment associations
  Deparment.hasMany(Item, {
    sourceKey: "id",
    foreignKey: "reasonId",
    as: "items",
  });
};
