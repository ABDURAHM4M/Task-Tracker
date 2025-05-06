import User from '../models/User.js';

export async function getAllUsers() {
  return User.find();
}
