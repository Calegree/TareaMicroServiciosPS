function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
  module.exports = { errorHandler };