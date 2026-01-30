# 飞机思维导图系统

## 项目简介

飞机思维导图系统是一个基于Web的应用程序，用于管理和展示飞机相关的思维导图数据。该系统支持开发者上传思维导图并同步到所有用户端，同时也支持普通用户上传个人思维导图（仅个人可见）。

## 技术栈

### 前端
- HTML5
- CSS3
- JavaScript
- 原生JavaScript (ES6+)

### 后端
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Token) 认证
- Multer 文件上传

## 系统功能

### 1. 开发者功能
- 上传思维导图文件（支持 .md 和 .xmind 格式）
- 自动同步到所有用户端
- 管理系统级思维导图

### 2. 用户功能
- 注册和登录
- 上传个人思维导图（仅个人可见）
- 查看和管理个人思维导图

### 3. 公共功能
- 查看系统最新思维导图数据
- 分享思维导图链接
- 导出系统数据为JSON文件

## 安装和运行

### 前提条件

1. **安装 Node.js**
   - 访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新版本的 Node.js
   - 验证安装：`node --version` 和 `npm --version`

2. **安装 MongoDB**
   - 访问 [MongoDB 官网](https://www.mongodb.com/) 下载并安装 MongoDB
   - 启动 MongoDB 服务

### 后端设置

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动后端服务器**
   ```bash
   npm start
   ```
   - 服务器默认运行在 http://localhost:5000

### 前端设置

1. **直接在浏览器中打开前端页面**
   - 双击 `index.html` 文件
   - 或在浏览器中输入文件路径

## 测试流程

### 1. 注册和登录
- 点击右上角的 "登录" 按钮
- 点击 "注册" 链接
- 填写注册信息，选择角色（developer 或 user）
- 注册成功后自动登录

### 2. 开发者功能测试
- 以 developer 角色登录
- 上传思维导图文件
- 检查是否成功上传并同步

### 3. 用户功能测试
- 以 user 角色登录
- 上传个人思维导图
- 检查是否成功上传（仅个人可见）

### 4. 系统数据同步测试
- 开发者上传新的思维导图
- 用户刷新页面或等待自动同步
- 检查用户端是否获取到最新数据

## API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 开发者接口
- `POST /api/developer/upload` - 上传思维导图（同步到所有用户）
- `GET /api/developer/mindmaps` - 获取所有思维导图
- `DELETE /api/developer/mindmaps/:id` - 删除思维导图

### 用户接口
- `POST /api/user/upload` - 个人上传思维导图（仅个人可见）
- `GET /api/user/mindmaps` - 获取个人思维导图
- `DELETE /api/user/mindmaps/:id` - 删除个人思维导图

### 公共接口
- `GET /api/public/system-data` - 获取最新系统数据

## 项目结构

```
APP项目/
├── index.html          # 前端主页面
├── styles.css          # 前端样式
├── script.js           # 前端脚本
├── README.md           # 项目说明
└── backend/            # 后端目录
    ├── server.js       # 后端服务器
    ├── package.json    # 后端依赖
    ├── config/
    │   └── db.js       # 数据库连接
    ├── models/
    │   ├── User.js     # 用户模型
    │   └── Mindmap.js  # 思维导图模型
    ├── middleware/
    │   └── auth.js     # 认证中间件
    └── routes/
        ├── auth.js     # 认证路由
        ├── developer.js # 开发者路由
        ├── user.js     # 用户路由
        └── public.js   # 公共路由
```

## 注意事项

1. 确保 MongoDB 服务正在运行
2. 后端服务器默认使用本地 MongoDB 数据库（aircraft-system）
3. 前端默认连接到 http://localhost:5000 的后端服务
4. 上传的思维导图文件大小限制为 10MB

## 故障排除

### 后端启动失败
- 检查 MongoDB 服务是否运行
- 检查端口 5000 是否被占用
- 查看控制台错误信息

### 前端无法连接后端
- 检查后端服务器是否启动
- 检查浏览器控制台网络请求错误
- 确保前端和后端的URL匹配

### 上传失败
- 检查文件格式是否支持（.md 或 .xmind）
- 检查文件大小是否超过限制
- 查看控制台错误信息

## 后续优化

1. 添加文件上传进度条
2. 实现思维导图的在线编辑功能
3. 添加用户权限管理
4. 优化系统性能和安全性
5. 添加更多文件格式支持

## 联系方式

如有问题或建议，请联系项目开发团队。