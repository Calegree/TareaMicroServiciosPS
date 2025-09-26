const express = require('express');
const router = express.Router();

router.get('/patients/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: 'Mocked Patient' });
});

module.exports = router;