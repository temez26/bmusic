const { Router } = require("express");
const { asyncHandler } = require("../../shared/http");
const controller = require("./songs.controller");

const router = Router();

router.get("/", asyncHandler(controller.list));
router.delete("/:id", asyncHandler(controller.remove));
router.get("/:id/playlists", asyncHandler(controller.listPlaylistIds));
router.post("/:id/play", asyncHandler(controller.recordPlay));

module.exports = router;
