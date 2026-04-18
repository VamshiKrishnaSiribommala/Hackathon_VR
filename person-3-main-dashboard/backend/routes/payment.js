const express = require('express');
const router = express.Router();

router.post('/process', (req, res) => {
    res.json({ status: "Payment successful" });
});

module.exports = router;
