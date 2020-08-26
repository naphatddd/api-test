const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const passportJWT = require("../middleware/passportJWT");

router.get("/", [passportJWT.isLogin], staffController.index);
router.post("/", staffController.insert);
router.get("/:id", staffController.show);
router.delete("/:id", staffController.destroy);
router.put("/:id", staffController.update);

module.exports = router;
