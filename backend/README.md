# 后端架构设计

## 技术栈
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)

## 数据库模型

### 用户模型 (User)
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // 哈希存储
  role: String, // 'developer' 或 'user'
  createdAt: Date,
  updatedAt: Date
}
```

### 思维导图模型 (Mindmap)
```javascript
{
  _id: ObjectId,
  title: String,
  fileName: String,
  fileType: String,
  uploadDate: Date,
  uploader: ObjectId, // 引用User
  isPublic: Boolean, // 是否为开发者上传的公共数据
  data: Buffer, // 存储文件数据
  systemData: Array // 解析后的系统数据
}
```

## API接口设计

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
- `GET /api/public/system-data` - 获取最新系统数据（用于同步）

## 身份验证机制
- 使用JWT进行身份验证
- 中间件验证用户权限
- 开发者和普通用户的权限区分

## 同步机制
- 开发者上传思维导图后，解析为系统数据并存储
- 所有用户端定期检查并同步最新的系统数据
- 用户个人上传的思维导图仅存储在个人账户中，不影响其他用户