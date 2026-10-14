const { Router } = require("express");
const express = require("express");
const config = require("../../config");

// express.static handles Range requests (audio seeking), content types,
// caching headers and path traversal protection.
const router = Router();

router.use("/uploads", express.static(config.paths.uploads, { fallthrough: false }));
router.use("/covers", express.static(config.paths.covers, { fallthrough: false }));

module.exports = router;
