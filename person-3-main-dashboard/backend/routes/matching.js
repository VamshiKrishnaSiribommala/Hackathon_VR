const express = require('express');
const router = express.Router();

router.post('/match', (req, res) => {
    res.json({ message: "Matching driver with rider..." });
});

module.exports = router;
