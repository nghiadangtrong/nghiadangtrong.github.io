const TagModel = require('../models/tag');
const slugify = require('slugify');
const { ThrowException, HandleException } = require('../helpers/handleError')
const ObjectId = require('mongoose').Types.ObjectId;

class TagController {

  async list(request, response) {
    try {
      let data = await TagModel.find({});
      return response.json({ data })
    } catch (error) {
      return HandleException(error, response);
    }
  }

  async detail(request, response) {
    try {
      let { slug } = request.params;
      let tag = await TagModel.findOne({ slug });
      if (!tag) {
        ThrowException(404, "Tag not found");
      }
      return response.status(200).json(tag);
    } catch(error) {
      return HandleException(error, response);
    }
  }

  async create(request, response) {
    try {
      const { name } = request.body;
      const slug = slugify(name).toLowerCase();
      const slugExist = await TagModel.findOne({ slug });
      if(slugExist) {
        ThrowException(404, 'Tag Name Exists');
      }
      const tag = new TagModel({ name, slug });
      await tag.save();
      return response.json(tag);
    } catch(error) {
      return HandleException(error, response);
    }
  }

  async update(request, response) {
    try {
      const { slug } = request.params;
      const { name } = request.body;
      const newSlug = slugify(name).toLowerCase();

      const tag = await TagModel.findOne({ slug });
      if(!tag) {
        ThrowException(404, 'Tag not exists');
      }

      const newSlugExist = await TagModel.findOne({
        _id: { $ne: new ObjectId(tag._id) },
        slug: newSlug
      }) 
      if(newSlugExist) {
        ThrowException(400, 'Tag Name is exists');
      }

      const updateTag = await TagModel.findOneAndUpdate(
        tag._id,
        { name, slug: newSlug },
        { new: true }
      )

      return response.json(updateTag);
    } catch(error) {
      return HandleException(error, response);
    }
  }

  async delete(request, response) {
    try {
      const { slug } = request.params;
      await TagModel.findOneAndDelete({ slug });
      return response.json({ success: true });
    } catch(error) {
      return HandleException(error, response);
    }
  }
}

module.exports = new TagController();
