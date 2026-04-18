const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
    res.json({ name: "Driver 1", status: "Active" });
});

module.exports = router;
