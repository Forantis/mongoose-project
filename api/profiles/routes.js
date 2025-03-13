const express = require('express');
const router = express.Router();
const controller = require('./controller');

// CRUD routes
router.get('/profiles', controller.getAllProfiles);
router.get('/profiles/:id', controller.getProfileById);
router.post('/profiles', controller.createProfile);
router.put('/profiles/:id', controller.updateProfile);
router.delete('/profiles/:id', controller.deleteProfile);

// Additional routes
router.post('/profiles/:id/experience', controller.addExperience);
router.delete('/profiles/:id/experience/:exp', controller.deleteExperience);
router.post('/profiles/:id/skills', controller.addSkill);
router.delete('/profiles/:id/skills/:skill', controller.deleteSkill);
router.put('/profiles/:id/information', controller.updateInformation);

// Friend routes
router.post('/profiles/:id/friends', controller.addFriend);
router.delete('/profiles/:id/friends/:friendId', controller.removeFriend);
router.get('/profiles/:id/friends', controller.getFriends);

module.exports = router;
