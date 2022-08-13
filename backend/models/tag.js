const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const TagSchema = new Scheme({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 255,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  }
}, { timestamps: true});

const TagModel = mongoose.model('tags', TagSchema);

module.exports = TagModel;
