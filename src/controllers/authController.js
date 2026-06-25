import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
} from '../utils/generateTokens.js';

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    // For simplicity, create a user if they don't exist.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      email,
      password: hashedPassword,
      displayName: email.split('@')[0],
    });
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  setAccessTokenCookie(res, accessToken);

  res.json({
    user: {
      id: user._id,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    },
    accessToken,
    refreshToken: newRefreshToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });
};

// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = (req, res) => {
  const user = {
    id: req.user._id,
    displayName: req.user.displayName,
    email: req.user.email,
    photoURL: req.user.photoURL,
  };
  res.status(200).json(user);
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user._id);
    setAccessTokenCookie(res, accessToken);

    res.json({
      accessToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = async (req, res) => {
  // The user is authenticated by the protect middleware
  const user = await User.findById(req.user._id);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export { login, getMe, refreshToken, logout };
