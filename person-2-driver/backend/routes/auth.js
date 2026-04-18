const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.json({ message: "Driver Auth login endpoint" });
});

module.exports = router;
