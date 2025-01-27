const { Sequelize } = require("sequelize");
const config = require("../config/Database.js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First delete all records from transactions table (child records)
      await queryInterface.sequelize.query("DELETE FROM transactions_new;");
      console.log(
        "Successfully deleted all records from transactions_new table"
      );

      // Then delete all records from loans table (parent records)
      await queryInterface.sequelize.query("DELETE FROM loans_new;");
      console.log("Successfully deleted all records from loans_new table");
    } catch (error) {
      console.error("Error during data cleanup:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log(
      "No down migration for data cleanup - cannot restore deleted records"
    );
  },
};
