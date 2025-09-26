const errorHandler = (err, req, res, next) => {
  console.error('Error caught by middleware:', err.message);

  // Errores específicos del servicio
  if (err.message === 'INVALID_PATIENT_ID') {
    return res.status(400).json({
      error: 'INVALID_PATIENT_ID',
      message: 'Patient ID must be in format 12345678-9'
    });
  }

  if (err.message === 'PATIENT_NOT_FOUND') {
    return res.status(404).json({
      error: 'PATIENT_NOT_FOUND',
      message: 'Patient not found in our system'
    });
  }

  if (err.message === 'LICENSES_SERVICE_UNAVAILABLE') {
    return res.status(503).json({
      error: 'LICENSES_SERVICE_UNAVAILABLE',
      message: 'Licenses service is not available'
    });
  }

  if (err.message.includes('LICENSES_SERVICE_ERROR')) {
    return res.status(502).json({
      error: 'LICENSES_SERVICE_ERROR',
      message: 'Error from licenses service'
    });
  }

  if (err.message === 'LICENSES_SERVICE_TIMEOUT') {
    return res.status(504).json({
      error: 'LICENSES_SERVICE_TIMEOUT',
      message: 'Licenses service timeout'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Endpoint not found'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
