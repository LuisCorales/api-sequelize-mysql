const express = require("express");
const router = express.Router();

const appointmentsController = require("../../controllers/appointmentsController");

// GET all appointments
router.get("/", appointmentsController.getAll);

// POST a new appointment
router.post("/", appointmentsController.post);

// GET one appointment by id
router.get("/:appointmentId", appointmentsController.getAppointment); 

// GET all appointments of one doctor by id
router.get("/doctors/:doctorId", appointmentsController.getOneDoctorAppointments); 

// PUT/UPDATE an appointment by id
router.put("/:appointmentId", appointmentsController.put);

// DELETE an appointment
router.delete("/:appointmentId", appointmentsController.delete);

module.exports = router;