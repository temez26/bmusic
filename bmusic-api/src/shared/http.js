class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Forwards rejected promises from async route handlers to the error middleware.
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const parseId = (value, name = "id") => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `Invalid ${name}`);
  }
  return id;
};

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  // Errors from express.static, body parsing and multer carry a 4xx status.
  if (err.status >= 400 && err.status < 500) {
    const fallback = err.status === 404 ? "Not found" : "Bad request";
    return res.status(err.status).json({ error: err.expose ? err.message : fallback });
  }
  if (err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === PG_UNIQUE_VIOLATION) {
    return res.status(409).json({ error: "Resource already exists" });
  }
  if (err.code === PG_FOREIGN_KEY_VIOLATION) {
    return res.status(404).json({ error: "Referenced resource not found" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = { HttpError, asyncHandler, parseId, errorHandler };
