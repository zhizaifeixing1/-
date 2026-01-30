const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 根据用户名设置角色
    let userRole = 'user';
    if (username === 'zhizaifeixing') {
      userRole = 'developer';
    }

    // 创建新用户
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole
    });

    await newUser.save();

    // 生成JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 生成JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;