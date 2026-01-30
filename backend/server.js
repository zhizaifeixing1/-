const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 路由
const authRoutes = require('./routes/auth');
const developerRoutes = require('./routes/developer');
const userRoutes = require('./routes/user');
const publicRoutes = require('./routes/public');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/public', publicRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Aircraft System API' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});