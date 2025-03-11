const express = require('express');
const router = express.Router();

const profilesRoutes = require('./api/profiles');

router.use('/api', profilesRoutes);

module.exports = router;
