const Profile = require('./model');

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const filter = { deleted: false };
    
    // Process all query parameters dynamically
    Object.keys(req.query).forEach(key => {
      // Handle special case for skill which uses $in operator
      if (key === 'skill') {
        filter.skills = { $in: [req.query[key]] };
      }
      // Handle special case for search
      else if (key === 'search' && req.query[key].trim() !== '') {
        filter.$or = [
          { name: { $regex: req.query[key], $options: 'i' } },
          { email: { $regex: req.query[key], $options: 'i' } },
          { 'information.bio': { $regex: req.query[key], $options: 'i' } }
        ];
      }
      // Handle information fields
      else if (key.startsWith('info_') && req.query[key].trim() !== '') {
        const infoField = key.replace('info_', '');
        filter[`information.${infoField}`] = { $regex: req.query[key], $options: 'i' };
      }
      // Handle direct model fields
      else if (req.query[key].trim && req.query[key].trim() !== '') {
        // Only add non-empty string parameters
        filter[key] = { $regex: req.query[key], $options: 'i' };
      }
      else if (req.query[key] !== '') {
        // Handle non-string parameters (like numbers, booleans)
        filter[key] = req.query[key];
      }
    });
    
    const profiles = await Profile.find(filter).populate('friends');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false }).populate('friends');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create profile (name and email only)
exports.createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profile = new Profile({ name, email });
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update profile by ID (name and email only)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { name, email },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Soft delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add experience to profile
exports.addExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    profile.experience.push(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete experience from profile
exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    const expIndex = profile.experience.findIndex(exp => exp._id.toString() === req.params.exp);
    if (expIndex === -1) return res.status(404).json({ message: 'Experience not found' });
    
    profile.experience.splice(expIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add skill to profile
exports.addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    if (profile.skills.includes(skill)) {
      return res.status(400).json({ message: 'Skill already exists' });
    }
    
    profile.skills.push(skill);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete skill from profile
exports.deleteSkill = async (req, res) => {
  try {
    const skill = req.params.skill;
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    const skillIndex = profile.skills.indexOf(skill);
    if (skillIndex === -1) return res.status(404).json({ message: 'Skill not found' });
    
    profile.skills.splice(skillIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update profile information
exports.updateInformation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    profile.information = req.body;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add friend to profile
exports.addFriend = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const { friendId } = req.body;
    
    // Verify the friend exists and is not deleted
    const friendProfile = await Profile.findOne({ _id: friendId, deleted: false });
    if (!friendProfile) return res.status(404).json({ message: 'Friend profile not found' });
    
    // Check if already friends
    if (profile.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    profile.friends.push(friendId);
    await profile.save();
    
    // Return populated friends
    const updatedProfile = await Profile.findById(profile._id).populate('friends');
    res.status(201).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Remove friend from profile
exports.removeFriend = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const friendIndex = profile.friends.findIndex(friend => friend.toString() === req.params.friendId);
    if (friendIndex === -1) return res.status(404).json({ message: 'Friend not found' });

    profile.friends.splice(friendIndex, 1);
    await profile.save();
    
    // Return populated friends
    const updatedProfile = await Profile.findById(profile._id).populate('friends');
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get friends of profile
exports.getFriends = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false }).populate('friends');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};