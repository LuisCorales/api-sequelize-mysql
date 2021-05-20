const express = require("express");
const router = express.Router();

const appointmentsController = require("../controllers/appointmentsController");

// GET all appointments
router.get("/", appointmentsController.getAll);

// POST a new appointment
router.post("/", appointmentsController.post);

// GET all appointments of one doctor by id
router.get("/:doctorId", appointmentsController.getOneDoctorAppointments); 

// PUT/UPDATE an appointment by id
router.put("/:appointmentId", appointmentsController.put);

// DELETE an appointment
router.delete("/:appointmentId", appointmentsController.delete);

module.exports = router;