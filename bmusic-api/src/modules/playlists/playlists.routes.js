const { Router } = require("express");
const { asyncHandler } = require("../../shared/http");
const controller = require("./playlists.controller");

const router = Router();

router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:id", asyncHandler(controller.get));
router.delete("/:id", asyncHandler(controller.remove));
router.get("/:id/songs", asyncHandler(controller.listSongs));
router.post("/:id/songs", asyncHandler(controller.addSong));
router.delete("/:id/songs/:songId", asyncHandler(controller.removeSong));

module.exports = router;
