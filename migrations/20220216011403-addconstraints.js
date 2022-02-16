"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Users", {
      fields: ["username", "email"],
      type: "unique",
      name: "unique_username_email",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Users", "unique_username_email");
  },
};
