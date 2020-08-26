const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

/* GET users listing. */
router.get("/", menuController.index);

module.exports = router;
