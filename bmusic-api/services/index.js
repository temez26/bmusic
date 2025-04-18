const playlistRouter = require("./playlistController");
const helperController = require("./helperController");
const uploadConfig = require("./uploadConfig");
const deleteController = require("./deleteController");
const fetchController = require("./fetchController");
const uploadController = require("./uploadController");
const streamController = require("./streamController");

module.exports = {
  // Playlist Router
  playlistRouter,
  // Helper controllers
  ...helperController,
  // Upload configuration
  upload: uploadConfig,
  // Delete file controller
  ...deleteController,
  // Fetch controllers
  ...fetchController,
  // Upload controller
  ...uploadController,
  // Stream Controller
  ...streamController,
};
