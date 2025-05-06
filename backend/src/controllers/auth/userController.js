// src/controllers/auth/userController.js
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../../models/auth/UserModel.js";
import Token from "../../models/auth/Token.js";
import generateToken from "../../helpers/generateToken.js";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";

const cookieOptions = {
  path: "/",
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);
  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    bio: user.bio,
    isVerified: user.isVerified,
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    bio: user.bio,
    isVerified: user.isVerified,
    token,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.name = req.body.name ?? user.name;
  user.bio = req.body.bio ?? user.bio;
  user.photo = req.body.photo ?? user.photo;
  const updated = await user.save();
  return res.status(200).json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    photo: updated.photo,
    bio: updated.bio,
    isVerified: updated.isVerified,
  });
});

export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json(false);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json(true);
  } catch {
    return res.status(401).json(false);
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "Password changed successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await Token.deleteMany({ userId: user._id });
  const plainToken = crypto.randomBytes(32).toString("hex") + user._id;
  const hashed = hashToken(plainToken);

  await Token.create({
    userId: user._id,
    passwordResetToken: hashed,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  });

  const link = `${process.env.CLIENT_URL}/reset-password/${plainToken}`;
  await sendEmail(
    "Password Reset - TaskTracker",
    user.email,
    process.env.USER_EMAIL,
    "noreply@tasktracker.com",
    "forgotPassword",
    user.name,
    link
  );

  return res.status(200).json({ message: "Password reset email sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const hashed = hashToken(resetPasswordToken);
  const userToken = await Token.findOne({
    passwordResetToken: hashed,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  const user = await User.findById(userToken.userId);
  user.password = password;
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  await Token.deleteMany({ userId: user._id });
  const plainToken = crypto.randomBytes(32).toString("hex") + user._id;
  const hashed = hashToken(plainToken);

  await Token.create({
    userId: user._id,
    verificationToken: hashed,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  const link = `${process.env.CLIENT_URL}/verify-email/${plainToken}`;
  await sendEmail(
    "Email Verification - TaskTracker",
    user.email,
    process.env.USER_EMAIL,
    "noreply@tasktracker.com",
    "emailVerification",
    user.name,
    link
  );

  return res.status(200).json({ message: "Verification email sent" });
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const hashed = hashToken(verificationToken);
  const userToken = await Token.findOne({
    verificationToken: hashed,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  const user = await User.findById(userToken.userId);
  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  user.isVerified = true;
  await user.save();
  return res.status(200).json({ message: "Account verified successfully" });
});