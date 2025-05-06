import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

// @desc    Delete a user by ID
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "User deleted successfully" });
});

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Creator
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
});
