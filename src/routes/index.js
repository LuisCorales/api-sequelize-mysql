const express = require('express');
const router = express.Router();

const patientsRoutes = require("./patients");
const doctorsRoutes = require("./doctors");
const hospitalsRoutes = require("./hospitals");
const appointmentsRoutes = require("./appointments");

router.use("/patients", patientsRoutes);
router.use("/doctors", doctorsRoutes);
router.use("/hospitals", hospitalsRoutes);
router.use("/appointments", appointmentsRoutes);

module.exports = router;