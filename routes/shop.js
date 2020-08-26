const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

router.get("/", shopController.index);
router.post("/", shopController.insert);
router.get("/:id", shopController.show);
router.delete("/:id", shopController.destroy);
// router.put("/:id", shopController.update);

module.exports = router;
