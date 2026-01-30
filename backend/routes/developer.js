const express = require('express');
const router = express.Router();
const multer = require('multer');
const Mindmap = require('../models/Mindmap');
const { developerAuth } = require('../middleware/auth');

// 配置multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 上传思维导图（同步到所有用户）
router.post('/upload', developerAuth, upload.single('mindmap'), async (req, res) => {
  try {
    const { title, systemData } = req.body;
    const systemDataArray = JSON.parse(systemData);

    // 创建新的思维导图记录
    const newMindmap = new Mindmap({
      title,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      uploader: req.user.id,
      isPublic: true,
      data: req.file.buffer,
      systemData: systemDataArray
    });

    await newMindmap.save();

    res.status(201).json({ message: 'Mindmap uploaded successfully', mindmap: newMindmap });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 获取所有思维导图
router.get('/mindmaps', developerAuth, async (req, res) => {
  try {
    const mindmaps = await Mindmap.find().populate('uploader', 'username');
    res.status(200).json(mindmaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 删除思维导图
router.delete('/mindmaps/:id', developerAuth, async (req, res) => {
  try {
    const mindmap = await Mindmap.findById(req.params.id);
    if (!mindmap) {
      return res.status(404).json({ message: 'Mindmap not found' });
    }

    await mindmap.deleteOne();
    res.status(200).json({ message: 'Mindmap deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;