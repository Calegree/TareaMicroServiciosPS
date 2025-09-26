const express = require('express');
const router = express.Router();

router.get('/licenses/:folio/verify', (req, res) => {
  const { folio } = req.params;
  res.json({ folio, valid: true });
});

module.exports = router;


