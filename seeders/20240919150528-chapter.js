'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Chapters', [
      {
        courseId: 1,
        title: 'CSS 课程介绍',
        content: 'CSS的全名是层叠样式表。官方的解释我就不详细说了，因为你就算读懂了，对初学者朋友们来说，听起来还是一脸懵逼。那么我们用最通俗的讲法来说，到底什么是CSS？',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2,
        title: 'Node.js 课程介绍',
        content: '接下来，我们要讲的是 Node.js 这套全栈开发项目。让我们一起从零到无所不能，掌握服务端开发。先从最简单的基础入门，到掌握核心技能的进阶开发。一步步的带你从不懂前端开发到一起完成一个全栈项目。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2,
        title: '安装 Node.js',
        content: '安装Node.js, 是简单的办法。就是直接下载了安装。但这样的方法，却不是最推荐的。因为安装完成后，使用node.js的时候，可能会碰到很多问题。为了解决这些问题，推荐使用两种安装方式。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chapters', { tableName: 'Chapters', identifier: null, options: {} });
  }
};
