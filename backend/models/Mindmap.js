const mongoose = require('mongoose');

const mindmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  data: {
    type: Buffer
  },
  systemData: {
    type: Array,
    default: []
  }
});

const Mindmap = mongoose.model('Mindmap', mindmapSchema);

module.exports = Mindmap;