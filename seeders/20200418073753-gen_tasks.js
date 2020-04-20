'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('tasks', [
       { id: 1, des: "P1", createdAt: new Date(), updatedAt: new Date()},
       { id: 2, des: "P2", createdAt: new Date(), updatedAt: new Date()}
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('tasks', null, {});
  }
};
