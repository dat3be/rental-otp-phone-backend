const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroSequelize = require('@admin-bro/sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Service = require('../models/service');
const Order = require('../models/order');
const sequelize = require('../config/dbConfig');

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
  databases: [sequelize],
  rootPath: '/admin',
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: false },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  password: await bcrypt.hash(request.payload.password, 12),
                };
              }
              return request;
            },
          },
          edit: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  password: await bcrypt.hash(request.payload.password, 12),
                };
              }
              return request;
            },
          },
        },
      },
    },
    {
      resource: Service,
    },
    {
      resource: Order,
    },
  ],
});

const ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookies',
});

module.exports = { adminBro, adminRouter };