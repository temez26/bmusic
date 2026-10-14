const { Router } = require("express");
const { asyncHandler } = require("../../shared/http");
const upload = require("./uploads.middleware");
const { importFiles } = require("./uploads.service");

const router = Router();

router.post(
  "/",
  upload,
  asyncHandler(async (req, res) => {
    const { uploaded, failed } = await importFiles(req.files || []);
    const rejected = (req.rejectedFiles || []).map((file) => ({
      file,
      error: "Unsupported file type",
    }));
    res.status(201).json({ uploaded, failed: [...failed, ...rejected] });
  })
);

module.exports = router;
