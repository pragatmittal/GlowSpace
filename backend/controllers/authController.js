const User = require('../models/User');

const handleOAuthCallback = async (profile, provider) => {
  try {
    // Check if user exists
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: profile.name,
        email: profile.email,
        image: profile.image,
        provider: provider,
        providerId: profile.id
      });
    }

    return user;
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    throw error;
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  handleOAuthCallback,
  getCurrentUser
}; 