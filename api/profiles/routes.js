const express = require('express');
const router = express.Router();
const profileController = require('./controller');

// POST /profiles - Create a new profile (name and email only)
router.post('/', profileController.createProfile);

module.exports = router;
