const express = require('express');
const router = express.Router();

router.get('/balance', (req, res) => {
    res.json({ balance: 100 });
});

module.exports = router;
