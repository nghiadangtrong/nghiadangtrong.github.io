const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  excerpt: {
    type: String,
    maxlength: 500,
  },
  body: {
    type: String,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentType: String,
    name: String
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'categories',
      required: true,
    }
  ],
  tags: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'tags',
      require: true,
    }
  ],
  postBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }
}, { timestamps: true });

const BlogModel = mongoose.model('blogs', BlogSchema);

module.exports = BlogModel;
