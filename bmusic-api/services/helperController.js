const { incrementPlayCount } = require("../database/db");
const fs = require("fs");
const path = require("path");
async function incrementPlayCountHandler(req, res) {
  const { id } = req.body;
  if (!id) return res.status(400).send("Song ID is required");

  try {
    const playCount = await incrementPlayCount(id);
    res.status(200).json({ playCount });
  } catch (err) {
    console.error("Error incrementing play count:", err);
    res.status(500).send("Error incrementing play count");
  }
}

function serveCoverImage(req, res) {
  // Adjust the relative path if needed
  const filePath = path.join(__dirname, "../", req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", filePath);
      return res.status(404).send("File not found");
    }
    res.sendFile(filePath);
  });
}

module.exports = { incrementPlayCountHandler, serveCoverImage };
