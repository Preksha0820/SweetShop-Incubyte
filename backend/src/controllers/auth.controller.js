import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, {
expiresIn: process.env.TOKEN_EXPIRES_IN || '7d'
});
};


export const register = async (req, res) => {
const { name, email, password } = req.body;


if (!name || !email || !password) {
return res.status(400).json({ message: 'Please fill all fields' });
}


const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'User already exists' });


const user = await User.create({ name, email, password });


res.status(201).json({
token: generateToken(user._id),
user: { id: user._id, name: user.name, email: user.email, role: user.role }
});
};


export const login = async (req, res) => {
const { email, password } = req.body;


if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });


const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid email or password' });


const isMatch = await user.matchPassword(password);
if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });


res.json({
token: generateToken(user._id),
user: { id: user._id, name: user.name, email: user.email, role: user.role }
});
};