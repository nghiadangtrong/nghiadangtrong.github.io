const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 255,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  }
}, { timestamps: true })


const CategoryModel = mongoose.model('categories', CategoriesSchema);

module.exports = CategoryModel;
