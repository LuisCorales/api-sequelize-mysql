const express = require("express");
const router = express.Router();

const hospitalsController = require("../controllers/hospitalsController");

// GET all hospitals
router.get("/", hospitalsController.getAll);

// POST a new hospital
router.post("/", hospitalsController.post);

// GET a hospital by id
router.get("/:hospitalId", hospitalsController.getOne);

// PUT/UPDATE a hospital by id
router.put("/:hospitalId", hospitalsController.put);

// DELETE a hospital
router.delete("/:hospitalId", hospitalsController.delete);

module.exports = router;