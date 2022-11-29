import { Models } from "../db";

const { User } = Models;

export const getUserById = async (id: string) => {
  try {
    return await User.findByPk(id, {
      attributes: {
        exclude: ["id", "password"],
      },
    });
  } catch (error) {
    return error;
  }
};
