const fs = require("fs");
const path = require("path");

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

module.exports = { serveCoverImage };
