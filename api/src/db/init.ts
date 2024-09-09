// File Imports
import sequelize from "./config";
import initAssociations from "./associations";
import Role from "../models/Role";
import User from "../models/User";

// Const declarations
// TODO: If the program is started on the mode that requires this variables, force the program not to start if they are not provided.
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;

// Logic
// Test function to check the connectivity to the database.
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    initAssociations();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const startDbForce = async () => {
  checkConnection().then(async () => {
    console.log(
      "Force DB start scheduled - Wiping DB and creating default roles"
    );

    await sequelize.sync({ force: true }); // Sync without a transaction

    // Use a transaction for the role and user creation operations
    await sequelize
      .transaction(async (transaction) => {
        // Create roles
        await Role.create({ name: "admin" }, { transaction });
        await Role.create({ name: "supervisor" }, { transaction });
        await Role.create({ name: "dispatcher" }, { transaction });
        await Role.create({ name: "operator" }, { transaction });

        // Retrieve the role from the database to ensure it's there
        const fetchedAdminRole = await Role.findOne({
          where: { name: "admin" },
          transaction,
        });

        if (!fetchedAdminRole) {
          throw new Error("Admin role was not found after creation.");
        }

        // Create admin user
        const adminUser = await User.create(
          {
            username: ADMIN_USER || "admin",
            fullname: "Administrador del Sistema",
            password: ADMIN_PASSWORD || "password",
          },
          { transaction }
        );

        // Add user to role
        await fetchedAdminRole.addUser(adminUser, { transaction });

        console.log("Roles and Admin User created.");
      })
      .catch((err) => {
        console.error("Transaction failed:", err);
      });
  });
};

export const startDbNormal = async () => {
  checkConnection().then(async () => {
    console.log("Normal DB start scheduled");
    await sequelize.sync({ alter: true });
  });
};
