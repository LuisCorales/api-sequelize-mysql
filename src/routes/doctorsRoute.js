const express = require("express");
const router = express.Router();

const doctorsController = require("../controllers/doctorsController");

// GET all doctors
router.get("/", doctorsController.getAll);

// POST a new doctor
router.post("/", doctorsController.post);

// GET a doctor by id
router.get("/:doctorId", doctorsController.getOne);

// PUT/UPDATE a doctor by id
router.put("/:doctorId", doctorsController.put);

// DELETE a doctor
router.delete("/:doctorId", doctorsController.delete);

module.exports = router;