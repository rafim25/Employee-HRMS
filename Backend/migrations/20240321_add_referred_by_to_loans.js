import { Sequelize } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("loans", "referred_by", {
    type: Sequelize.STRING,
    allowNull: true,
    after: "remaining_balance", // Add the column after remaining_balance
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("loans", "referred_by");
}
