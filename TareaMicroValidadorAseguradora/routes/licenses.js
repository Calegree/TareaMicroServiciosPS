const express = require('express');
const licenseService = require('../services/licenseService');
const router = express.Router();

// GET /insurer/licenses/{folio}/verify
router.get('/licenses/:folio/verify', async (req, res, next) => {
  try {
    const { folio } = req.params;
    
    if (!folio) {
      return res.status(400).json({ 
        error: 'FOLIO_REQUIRED',
        message: 'El folio es requerido' 
      });
    }

    const result = await licenseService.verifyLicense(folio);
    
    if (!result.success) {
      return res.status(500).json({ 
        error: 'SERVICE_UNAVAILABLE',
        message: 'Error al conectar con el servicio de licencias' 
      });
    }

    res.json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
