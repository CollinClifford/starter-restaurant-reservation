/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.route("/:reservationId/mobile_phone").all(cors());

router
  .route("/:reservationId/status")
  .all(cors())
  .put(controller.updateStatus)
  .all(methodNotAllowed);

router.route("/:reservationId/seat").all(cors()).get(controller.read).all(methodNotAllowed);

router
  .route("/:reservationId").all(cors())
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/").all(cors())
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
