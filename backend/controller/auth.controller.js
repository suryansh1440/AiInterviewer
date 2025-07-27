import User from "../modals/user.modal.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { OAuth2Client } from 'google-auth-library';
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      phone: phone || "",
    });

    await newUser.save();
    generateToken(newUser._id, res);
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePic: newUser.profilePic,
      phone: newUser.phone,
      resume: newUser.resume,
      role: newUser.role,
      authProvider:newUser.authProvider,
      freeInterview: newUser.freeInterview,
      level: newUser.level,
      levelProgress: newUser.levelProgress,
      subscription: newUser.subscription,
      stats: newUser.stats,
      lastLogin: newUser.lastLogin,
      interviewLeft: newUser.interviewLeft,
      interviewLeftExpire: newUser.interviewLeftExpire,
      leetcodeUsername: newUser.leetcodeUsername,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      phone: user.phone,
      resume: user.resume,
      role: user.role,
      authProvider: user.authProvider,
      freeInterview: user.freeInterview,
      level: user.level,
      levelProgress: user.levelProgress,
      subscription: user.subscription,
      stats: user.stats,
      lastLogin: user.lastLogin,
      interviewLeft: user.interviewLeft,
      interviewLeftExpire: user.interviewLeftExpire,
      leetcodeUsername: user.leetcodeUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  // Clear the auth token cookie (assuming it's called 'token')
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let { name, phone, profilePic, resume, leetcodeUsername } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle profilePic upload if it's a new file (base64 string)
    let profilePicUrl = user.profilePic;
    if (
      profilePic &&
      profilePic !== user.profilePic &&
      profilePic.startsWith("data:")
    ) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      profilePicUrl = uploadResponse.secure_url;
    } else if (profilePic && !profilePic.startsWith("data:")) {
      profilePicUrl = profilePic; // already a URL
    }

    // Handle resume upload if it's a new file (base64 string)
    let resumeUrl = user.resume;
    if (resume && resume !== user.resume && resume.startsWith("data:")) {
      // PDF validation: Only allow PDF files
      if (!resume.startsWith("data:application/pdf")) {
        return res.status(400).json({ message: "Resume must be a PDF file." });
      }
      // Set public_id to always end with .pdf
      const publicId = `resumes/${user._id}_${Date.now()}.pdf`;
      const uploadResponse = await cloudinary.uploader.upload(resume, {
        resource_type: "raw",
        public_id: publicId,
        overwrite: true,
        use_filename: false,
        unique_filename: false,
      });
      resumeUrl = uploadResponse.secure_url;
    } else if (resume && !resume.startsWith("data:")) {
      resumeUrl = resume; // already a URL or file name
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.profilePic = profilePicUrl;
    user.resume = resumeUrl;
    user.leetcodeUsername = leetcodeUsername || user.leetcodeUsername;
    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      phone: user.phone,
      role: user.role,
      authProvider:user.authProvider,
      freeInterview: user.freeInterview,
      level: user.level,
      levelProgress: user.levelProgress,
      subscription: user.subscription,
      stats: user.stats,
      lastLogin: user.lastLogin,
      interviewLeft: user.interviewLeft,
      interviewLeftExpire: user.interviewLeftExpire,
      leetcodeUsername: user.leetcodeUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      resume: user.resume,
    });
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkauth controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.authProvider === 'local') {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
    }
    // For Google or other providers, skip password check
    await user.deleteOne();
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'No credential provided' });
  }
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }
    // Find or create user
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        profilePic: payload.picture,
        authProvider: 'google',
        password: undefined, // No password for Google users
      });
      await user.save();
    } else {
      // Update profilePic and name if changed
      let updated = false;
      if (user.name !== payload.name) {
        user.name = payload.name;
        updated = true;
      }
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        updated = true;
      }
      if (updated) await user.save();
    }
    // Set lastLogin
    user.lastLogin = new Date();
    await user.save();
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      phone: user.phone,
      role: user.role,
      authProvider: user.authProvider,
      freeInterview: user.freeInterview,
      level: user.level,
      levelProgress: user.levelProgress,
      subscription: user.subscription,
      stats: user.stats,
      lastLogin: user.lastLogin,
      interviewLeft: user.interviewLeft,
      interviewLeftExpire: user.interviewLeftExpire,
      leetcodeUsername: user.leetcodeUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      resume: user.resume,
    });
  } catch (error) {
    console.log('Error in googleLogin controller', error);
    return res.status(500).json({ message: 'Google login failed' });
  }
};

export const githubLogin = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email`;
  res.redirect(redirectUrl);
};

export const githubCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ message: "No code provided" });
  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(400).json({ message: "Failed to get access token" });

    // Fetch user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    let email = userRes.data.email;
    if (!email) {
      const emailsRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${accessToken}` },
      });
      email = emailsRes.data.find(e => e.primary && e.verified)?.email;
    }
    if (!email) return res.status(400).json({ message: "No email found in GitHub profile" });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: userRes.data.name || userRes.data.login,
        email,
        profilePic: userRes.data.avatar_url,
        authProvider: "github",
        password: undefined,
      });
      await user.save();
    } else {
      let updated = false;
      if (user.name !== (userRes.data.name || userRes.data.login)) {
        user.name = userRes.data.name || userRes.data.login;
        updated = true;
      }
      if (user.authProvider !== "github") {
        user.authProvider = "github";
        updated = true;
      }
      if (updated) await user.save();
    }
    user.lastLogin = new Date();
    await user.save();
    // Set JWT cookie in backend
    generateToken(user._id, res); // sets the cookie
    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}/`);
  } catch (err) {
    console.log("Error in githubCallback controller", err.message);
    return res.status(500).json({ message: "GitHub login failed", details: err.message });
  }
};

