const express = require("express");
const router = express.Router();

const doctorsController = require("../../controllers/doctorsController");

// GET all doctors
router.get("/", doctorsController.getAll);

// POST a new doctor
router.post("/", doctorsController.post);

// GET a doctor by id
router.get("/:id", doctorsController.getOne);

// PUT/UPDATE a doctor by id
router.put("/:id", doctorsController.put);

// DELETE a doctor
router.delete("/:id", doctorsController.delete);

module.exports = router;