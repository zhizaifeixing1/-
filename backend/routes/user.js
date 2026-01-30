const express = require('express');
const router = express.Router();
const multer = require('multer');
const Mindmap = require('../models/Mindmap');
const { auth } = require('../middleware/auth');

// 配置multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 个人上传思维导图（仅个人可见）
router.post('/upload', auth, upload.single('mindmap'), async (req, res) => {
  try {
    const { title, systemData } = req.body;
    const systemDataArray = JSON.parse(systemData);

    // 创建新的思维导图记录
    const newMindmap = new Mindmap({
      title,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      uploader: req.user.id,
      isPublic: false,
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

// 获取个人思维导图
router.get('/mindmaps', auth, async (req, res) => {
  try {
    const mindmaps = await Mindmap.find({ uploader: req.user.id }).populate('uploader', 'username');
    res.status(200).json(mindmaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 删除个人思维导图
router.delete('/mindmaps/:id', auth, async (req, res) => {
  try {
    const mindmap = await Mindmap.findOne({ _id: req.params.id, uploader: req.user.id });
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