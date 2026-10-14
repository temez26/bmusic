const fs = require("fs");
const app = require("./app");
const config = require("./config");

fs.mkdirSync(config.paths.uploads, { recursive: true });
fs.mkdirSync(config.paths.covers, { recursive: true });

app.listen(config.port, () => {
  console.log(`bmusic-api listening on port ${config.port}`);
});
