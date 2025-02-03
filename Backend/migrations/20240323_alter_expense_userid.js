import { Sequelize } from "sequelize";

export const up = async (queryInterface) => {
  await queryInterface.changeColumn("expenses", "userId", {
    type: Sequelize.STRING,
    allowNull: false,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.changeColumn("expenses", "userId", {
    type: Sequelize.INTEGER,
    allowNull: false,
  });
};
