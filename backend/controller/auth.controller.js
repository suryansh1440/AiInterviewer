import User from "../modals/user.modal.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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
      resume:newUser.resume,
      role: newUser.role,
      freeInterview: newUser.freeInterview,
      level: newUser.level,
      levelProgress: newUser.levelProgress,
      subscription: newUser.subscription,
      stats: newUser.stats,
      lastLogin: newUser.lastLogin,
      interviewLeft: newUser.interviewLeft,
      interviewLeftExpire: newUser.interviewLeftExpire,
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
    const user = await User.findOne({ email });
    if (!user) {
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
      freeInterview: user.freeInterview,
      level: user.level,
      levelProgress: user.levelProgress,
      subscription: user.subscription,
      stats: user.stats,
      lastLogin: user.lastLogin,
      interviewLeft: user.interviewLeft,
      interviewLeftExpire: user.interviewLeftExpire,
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
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let { name, phone, profilePic, resume } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle profilePic upload if it's a new file (base64 string)
    let profilePicUrl = user.profilePic;
    if (profilePic && profilePic !== user.profilePic && profilePic.startsWith("data:")) {
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
    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      phone: user.phone,
      role: user.role,
      freeInterview: user.freeInterview,
      level: user.level,
      levelProgress: user.levelProgress,
      subscription: user.subscription,
      stats: user.stats,
      lastLogin: user.lastLogin,
      interviewLeft: user.interviewLeft,
      interviewLeftExpire: user.interviewLeftExpire,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      resume: user.resume,
    });
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const checkAuth = async (req,res) =>{
    try{
        return res.status(200).json(req.user)

    }catch(error){
        console.log("Error in checkauth controller",error.message)
        return res.status(500).json({message:"Internal Server Error"})
    }
}


export const changePassword = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
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
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    await user.deleteOne();
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
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


