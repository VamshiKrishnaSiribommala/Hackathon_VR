const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.json({ message: "Auth login endpoint" });
});

module.exports = router;
