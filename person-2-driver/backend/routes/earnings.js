const express = require('express');
const router = express.Router();

router.get('/summary', (req, res) => {
    res.json({ total: 500, history: [] });
});

module.exports = router;
