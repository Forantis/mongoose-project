const Profile = require('./model');

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const { skill, location, search } = req.query;
    
    const filter = { deleted: false };
    
    if (skill) {
      filter.skills = { $in: [skill] };
    }
    
    if (location && location.trim() !== '') {
      filter['information.location'] = { $regex: location, $options: 'i' };
    }
    
    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'information.bio': { $regex: search, $options: 'i' } }
      ];
    }
    
    const profiles = await Profile.find(filter);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false });
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
