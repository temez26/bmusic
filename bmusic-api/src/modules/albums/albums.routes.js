const { Router } = require("express");
const { asyncHandler } = require("../../shared/http");
const albums = require("./albums.repository");

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => res.json(await albums.findAll()))
);

module.exports = router;
