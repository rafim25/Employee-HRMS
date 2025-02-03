import { Sequelize } from "sequelize";

export const up = async (queryInterface) => {
  await queryInterface.createTable("expenses", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    expenseName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    expenseType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    comments: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    expenseImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  // Add indexes
  await queryInterface.addIndex("expenses", ["uuid"]);
  await queryInterface.addIndex("expenses", ["userId"]);
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable("expenses");
};
