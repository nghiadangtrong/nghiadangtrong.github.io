
const ObjectId = require('mongoose').Types.ObjectId;
const BlogModel = require('../models/blog');
const CategoryModel = require('../models/category');
const TagModel = require('../models/tag');
const { ThrowException, HandleException } = require('../helpers/handleError');
const formidable = require('formidable');
const slugify = require('slugify');
const fs = require('fs');
const { APP_NAME } = require('../configs/app');
const { stripHtml } = require('string-strip-html')
const { smartTrim } = require('../helpers')
const { RoleType } = require("../configs/role");

class BlogController {
  async list(req, res) {
    try {
      let { pageSize = 10, page = 0, filters= {} } = {
        ...req.params,
        ...req.body,
        ...req.query,
      }
      pageSize = Number(pageSize);
      page = Number(page);

      let total = await BlogModel.countDocuments(filters);
      let pages = pageSize > 0 ? Math.ceil(total/pageSize) : 0;
      if(page > pages - 1) {
        page = pages - 1;
      }
      let skip = page * pageSize;

      let query = BlogModel
        .find(filters)
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postBy', '_id name username')
        .sort({ createdAt: -1 }) // Giảm dần
        .select('_id title slug excerpt metaTitle metaDescription categories tags createdAt updatedAt')
      if(skip > 0 && pageSize >= 0) {
        query = query.skip(skip);
      }
      if (pageSize >= 0) {
        query = query.limit(pageSize)
      }

      let data = await query;
      if (pageSize < 0) {
        pageSize = total;
        page = 0;
      }

      return res.status(200).json({ data, page, pageSize, total, pages })
    } catch (error) {
      return HandleException(error, res);
    }
  }

  async getRelated (request, response) {
    try {
      let { slug, limit = 3 } = {
        ...request.query,
        ...request.params,
        ...request.body,
      }
      limit = Number(limit)
      let blog = await BlogModel.findOne({ slug });
      if (!blog) {
        return ThrowException(404, 'Blog not found');
      }
      
      let blogRelated = await BlogModel
        .find({ 
          _id: { $ne: blog._id },
          $or: [
            { categories: { $in: blog.categories } },
            { tags: { $in: blog.tags }}
          ]
        })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postBy', '_id name username')
        .select('_id title slug excerpt createdAt updatedAt')
        .sort({ createdAt: 'desc'})
        .limit(limit)

      return response.status(200).json(blogRelated)
    } catch (e) {
      return HandleException(e, response);
    }
  }

  async detail(request, response) {
    try {
      let { slug } = request.params;
      let blog = await BlogModel.findOne({ slug })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postBy', '_id name username')
        .select('_id title slug metaTitle metaDescription body categories tags createdAt updateAt')
      if (!blog) {
        return ThrowException(404, 'blog not found')
      }
      return response.status(200).json(blog)
    } catch (error) {
      return HandleException(error, response)
    }
  }

  async create(req, res) {
    const form = formidable({
      multiples: true,
      //keepExtensions: true 
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          ThrowException(err.httpCode, String(err));
        }

        if (!files.photo) {
          ThrowException(400, 'photo is not empty');
        }

        const maxSize = 5 * 1000000; // 5 Mb
        if (files.photo.size > maxSize) {
          ThrowException(400, 'Photo cannot be greater than 5 MB')
        }

        let { title, body, metaTitle, categories, tags } = fields;

        if (!title || (title = title.trim()).length <= 0) {
          ThrowException(400, 'Title is not empty');
        }

        if (!body || (body = body.trim()).length <= 0) {
          ThrowException(400, 'Body is not empty')
        }

        if (!categories || categories.length <= 0) {
          ThrowException(400, 'Categories is missing')
        }

        const categoriesExist = await CategoryModel.find({ _id: { $in: categories.map(id => new ObjectId(id)) } });
        if (!categoriesExist || categoriesExist.length !== categories.length) {
          ThrowException(400, 'Categories invalid')
        }

        if (!tags || tags.length <= 0) {
          ThrowException(400, 'Tags is missing');
        }

        const tagsExist = await TagModel.find({ _id: { $in: tags.map(id => new ObjectId(id)) } });
        if (!tagsExist || tagsExist.length !== tags.length) {
          ThrowException(400, 'Tags invalid');
        }

        let slug = '';
        let prefixSlug = slugify(title).toLowerCase();

        while (1) {
          let dateNow = new Date().getTime();
          slug = prefixSlug + '-' + dateNow;
          let slugExists = await BlogModel.find({ slug });
          if (!slugExists || slugExists.length <= 0) {
            break;
          }
        }

        let excerpt = stripHtml(smartTrim(body, 350, '...')).result;
        metaTitle = [title, APP_NAME, metaTitle].filter(Boolean).join(' | ');
        let metaDescription = stripHtml(body.substr(0, 200)).result;

        let postBy = req.profile._id;
        let photo = {};
        photo.data = fs.readFileSync(files.photo.filepath);
        photo.contentType = files.photo.mimetype;
        photo.name = files.photo.originalFilename;

        let blog = new BlogModel({
          title, excerpt, body, slug, photo,
          metaTitle, metaDescription,
          categories, tags, postBy,
        })

        await blog.save();
        return res.status(200).json(blog)

      } catch (error) {
        return HandleException(error, res)
      }
    })
  }

  async update(request, response) {
    const form = formidable({ multiples: true })
    form.parse(request, async (error, fields, files) => {
      try {
        if (error) {
          throw ThrowException(error.httpCode, String(error));
        }

        let maxSize = 5 * 1000000; // 5 Mb
        if (files.photo && files.photo.size > maxSize) {
          ThrowException(400, 'Photo cannot be greater than 5 MB')
        }

        let { slug: oldSlug } = request.params;
        let blog = await BlogModel.findOne({ oldSlug });
        if (!blog) {
          ThrowException(404, 'Blog not exists');
        }

        if(request.profile.role !== RoleType.admin 
          && String(request.profile._id) !== String(blog.postBy)
        ) {
          ThrowException(400, 'User can\'t update this blog')
        }

        let { title, body, metaTitle, categories, tags } = fields;

        if (!title || (title = title.trim()).length <= 0) {
          ThrowException(400, 'Title is not empty');
        }

        if (!body || (body = body.trim()).length <= 0) {
          ThrowException(400, 'Body is not empty');
        }

        if (!Array.isArray(categories) || categories.length <= 0) {
          ThrowException(400, 'Categories is missing');
        }

        let categoriesExist = await CategoryModel.find({ _id: { $in: categories.map(id => new ObjectId(id)) } });
        if (!categoriesExist || categories.length !== categoriesExist.length) {
          ThrowException(400, 'Categories invalid');
        }

        if (!Array.isArray(tags) || tags.length <= 0) {
          ThrowException(400, 'Tags is missing');
        }

        let tagsExist = await TagModel.find({ _id: { $in: tags.map(id => new ObjectId(id)) } });
        if (!tagsExist || tags.length !== tagsExist.length) {
          ThrowException(400, 'Tags invalid');
        }

        let excerpt = stripHtml(smartTrim(body, 350, '...')).result;
        metaTitle = [title, APP_NAME, metaTitle].filter(Boolean).join(' | ');
        let metaDescription = stripHtml(body.substr(0, 200)).result;

        let dataUpdate = {
          title, excerpt, body, metaTitle,
          metaDescription, categories, tags
        }

        if (title !== blog.title) {
          let prefixSlug = slugify(title).toLowerCase();
          while (1) {
            let dateNow = new Date().getTime();
            let slug = prefixSlug + '-' + dateNow;
            let slugUsed = await BlogModel.findOne({ slug });
            if (!slugUsed) {
              dataUpdate['slug'] = slug;
              break;
            }
          }
        }

        if (files.photo) {
          dataUpdate.photo = {
            data: fs.readFileSync(files.photo.filepath),
            contentType: files.photo.mimetype,
            name: files.photo.originalFilename
          }
        }

        blog = await BlogModel.findOneAndUpdate(
          blog._id, dataUpdate, { new: true }
        )

        return response.status(200).json(blog);
      } catch (errorWrap) {
        return HandleException(errorWrap, response)
      }
    })
  }

  async delete(request, response) {
    try {
      let { slug } = request.params;
      await BlogModel.deleteMany({ slug })
      return response.status(200).json({ success: true })
    } catch (error) {
      return HandleException(error, response)
    }
  }

  async getPhoto(request, response) {
    try {
      let { slug } = request.params;
      let blog = await BlogModel.findOne({ slug });
      if (!blog) {
        throw ThrowException(404, 'Image not found');
      }
      response.set('Content-Type', blog.photo.contentType);
      console.log('start send');
      response.send(blog.photo.data);
      console.log("da send xong")
    } catch (error) {
      return HandleException(error, response);
    }
  }

}

module.exports = new BlogController();
