const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passportJWT = require('../middleware/passportJWT')
/* GET users listing. */
router.get("/", userController.index);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", [passportJWT.isLogin],userController.me);

module.exports = router;
