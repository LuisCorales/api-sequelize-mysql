const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboard')

router.use("/dashboard", dashboardRoutes);

module.exports = router;