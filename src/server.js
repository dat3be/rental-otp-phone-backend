require('dotenv').config(); // Make sure this is at the top

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { adminBro, adminRouter } = require('./admin/admin');
const sequelize = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Public routes
app.use('/auth', authRoutes);

// AdminBro setup with authentication middleware
app.use(adminBro.options.rootPath, authMiddleware, adminRouter);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
