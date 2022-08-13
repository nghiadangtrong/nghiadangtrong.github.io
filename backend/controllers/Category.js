const CategoryModel = require('../models/category');
const slugify = require('slugify');
const { ThrowException, HandleException } = require('../helpers/handleError');
const ObjectId = require('mongoose').Types.ObjectId;

class Category {

  async list(request, response) { 
    try {
      let data = await CategoryModel.find({});
      console.log(' vao day')
      return response.json({ data })
    } catch (error) {
      return HandleException(error, response);
    }
  }

  async detail(request, response) {
    try {
      const { slug } = request.params;
      const category = await CategoryModel.findOne({ slug });
      if(!category) {
        ThrowException(404, 'Category not exists')
      }
      return response.json(category);
    } catch(error) {
      return HandleException(error, response);
    }
  }

  async create(request, response) {
    try {
      const { name } = request.body;
      const slug = slugify(name).toLowerCase();
      const slugExist = await CategoryModel.findOne({ slug });
      if(slugExist) {
        ThrowException(400, 'Category Name Exists');
      }
      const category = new CategoryModel({ name, slug })
      await category.save();
      return response.json(category)
    } catch(error) {
      return HandleException(error, response)
    }
  }

  async update(request, response) { 
    try {
      const { slug } = request.params;
      const { name } = request.body;
      const newSlug = slugify(name).toLowerCase();

      const category = await CategoryModel.findOne({ slug });
      if(!category) {
        ThrowException(404, 'Category not exists');
      }

      const newSlugExist = await CategoryModel.findOne({
        _id: { $ne: new ObjectId(category._id) },
        slug: newSlug,
      })
      if(newSlugExist) {
        ThrowException(400, 'category is exists');
      }

      const updateCategory = await CategoryModel.findOneAndUpdate(
        category._id,
        { name, slug: newSlug },
        { new: true } // return save database
      );

      return response.json(updateCategory)
    } catch(error) {
      return HandleException(error, response);
    }
  }

  async delete(request, response) { 
    try {
      const { slug } = request.params;
      await CategoryModel.findOneAndDelete({ slug });
      return response.json({ success: true })
    } catch(error) {
      return HandleException(error, response);
    }
  }
}

module.exports = new Category();
