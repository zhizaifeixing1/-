const express = require('express');
const router = express.Router();
const Mindmap = require('../models/Mindmap');

// 获取最新系统数据（用于同步）
router.get('/system-data', async (req, res) => {
  try {
    // 查找最新的公共思维导图
    const latestMindmap = await Mindmap.findOne({ isPublic: true }).sort({ uploadDate: -1 });
    
    if (!latestMindmap) {
      return res.status(404).json({ message: 'No public system data found' });
    }

    res.status(200).json({
      systemData: latestMindmap.systemData,
      lastUpdated: latestMindmap.uploadDate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;