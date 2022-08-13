const UserModel = require("../models/user");
const { ThrowException, HandleException } = require('../helpers/handleError');
const formidable = require('formidable');
const { RoleType } = require('../configs/role')
const fs = require('fs');

class User {
  async profile (request, response) {
    try {
      let profile = request.profile;
      return response.json({ profile });
    } catch(error) {
      return HandleException(error, response);
    }
  }

  async publicProfile (request, response) {
    try {
      let { username } = request.params;
      
      let user = await UserModel.findOne({ username })
        .select('username about createdAt updatedAt');
      if(!user) {
        ThrowException(404, 'User not found');
      }
      return response.json(user)
    } catch (error) {
      return HandleException(error, response);
    }
  }

  async updateProfile (request, response) {
    const form = formidable({ multiples: true });
    form.parse(request, async (errorForm, fields, files) => {
      try {
        if(errorForm) {
          ThrowException(errorForm.httpCode, String(errorForm));
        }

        let maxSize = 5 * 1000000; // 5MB
        if(files.photo && files.photo.size > maxSize) {
          ThrowException(400, 'Photo cannot be greater than 5MB');
        }

        let { username: currentUsername } = request.params || {};
        let user = await UserModel.findOne({ username: currentUsername });
        if(!user) {
          ThrowException(404, "User not found");
        }

        if(request.profile.role !== RoleType.admin
          && String(request.profile._id) !== String(user._id)
        ) {
          ThrowException(400, "User can't update this user")
        }

        let { username, name, email, profile, about } = fields;
        username = username.trim();
        name = name.trim();
        email = email.trim();
        about = about.trim();

        if(!username) {
          ThrowException(400, 'Username is not empty');
        }
        let usernameUsed = await UserModel.findOne({
          _id: { $eq: user._id },
          username: username,
        });
        if(usernameUsed) {
          ThrowException(400, 'Username is used');
        }

        if(!name) {
          ThrowException(400, "name is not Empty");
        }

        if(!email) {
          ThrowException(400, "Email is not Empty");
        }

        let dataUpdate = { 
          username, name , email, about,
          profile: `/profile/${username}`
        }

        if(files.photo) {
          dataUpdate.photo = {
            data: fs.readFileSync(files.photo.filepath),
            contentType: files.photo.mimeType,
            name: files.photo.originalFilename
          }
        }

        user = await UserModel.findOneAndUpdate(
          user._id, dataUpdate, { new: true }
        )
        
        return response.json({
          _id: user._id, 
          username: user.username, 
          email: user.email, 
          name: user.name, 
          profile: user.profile, 
          role: user.role
        })
      } catch(error) {
        return HandleException(error, response);
      }
    })
  }

  async updatePassword (request, response) {
    try {
      let { username } = request.params;
      let user = await UserModel.findOne({ username });
      if(!user) {
        ThrowException(404, 'Username not found');
      }

      let { oldPassword, password } = request.body;
      let correctOldPassword = user.authenticate(oldPassword);
      if(!correctOldPassword) {
        ThrowException(400, 'Old Password wrong');
      }
      password = password.trim();
      if(password < 8) {
        ThrowException(400, 'New Password min 8 length');
      }
      user.password = password;
      await user.save()

      return response.json({ success: true })
    } catch (error) {
      return HandleException(error, response)
    }
  }

  async getPhoto (request, response) {
    try {
      let { username } = request.params;
      let user = await UserModel.findOne({ username });
      if(!user) {
        ThrowException(404, "Username not found");
      }
      response.set('Content-Type', user.photo.contentType);
      return response.send(user.photo.data);
    } catch (error) {
      return HandleException(error, response);
    }
  }
}

module.exports = new User();
