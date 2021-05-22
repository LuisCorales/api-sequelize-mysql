const express = require('express');
const router = express.Router();

const patientsRoutes = require("./patientsRoute");
const hospitalsRoutes = require("./hospitalsRoute");
const doctorsRoutes = require("./doctorsRoute");
const appointmentsRoutes = require("./appointmentsRoute");

router.use("/patients", patientsRoutes);
router.use("/hospitals", hospitalsRoutes);
router.use("/doctors", doctorsRoutes);
router.use("/appointments", appointmentsRoutes);

module.exports = router;