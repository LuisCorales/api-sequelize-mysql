const express = require("express");
const router = express.Router();

const patientsController = require("../controllers/patientsController");

// GET all patients
router.get("/", patientsController.getAll);

// POST a new patient
router.post("/", patientsController.post);

// GET a patient by id
router.get("/:id", patientsController.getOne);

// PUT/UPDATE a patient by id
router.put("/:id", patientsController.put);

// DELETE a patient
router.delete("/:id", patientsController.delete);

module.exports = router;