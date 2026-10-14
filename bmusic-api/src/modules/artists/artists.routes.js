const { Router } = require("express");
const { asyncHandler } = require("../../shared/http");
const artists = require("./artists.repository");

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => res.json(await artists.findAll()))
);

module.exports = router;
