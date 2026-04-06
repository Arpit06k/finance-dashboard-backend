import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User.model';

export const registerUser = async (userData: Partial<IUser>): Promise<Partial<IUser>> => {
  const user = new User(userData);
  await user.save();
  
  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj as Partial<IUser>;
};

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: Partial<IUser> }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Fallback to 'secret' if environment variable isn't defined
  const secret = process.env.JWT_SECRET || 'secret';
  const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1d' });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj as Partial<IUser> };
};
