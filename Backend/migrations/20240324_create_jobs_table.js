import { Sequelize } from "sequelize";

export const up = async (queryInterface) => {
  await queryInterface.createTable("jobs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    minSalary: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    maxSalary: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    deadline: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    experienceRange: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    skills: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
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
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable("jobs");
}; 