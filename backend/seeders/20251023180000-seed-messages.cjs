'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('Messages', [
      { content: 'Pierwsza wiadomość', createdAt: new Date(), updatedAt: new Date() },
      { content: 'Druga wiadomość',   createdAt: new Date(), updatedAt: new Date() },
      { content: 'Trzecia wiadomość', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
