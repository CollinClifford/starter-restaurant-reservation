const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors")

router
  .route("/:tableId/seat").all(cors())
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

router.route("/:tableId").all(cors()).get(controller.read).all(methodNotAllowed);

router
  .route("/").all(cors())
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
