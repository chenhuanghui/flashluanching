/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var sid = require('shortid');
var fs = require('fs');
var mkdirp = require('mkdirp');

var UPLOAD_PATH = './assets/images';

// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

function safeFilename(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

module.exports = {
	upload: function(req,res) {
        if(!req.body.image)
            res.json({error: "Parameter missing"}, 400);
        else {
            var id = sid.generate(),
                fileName = id + ".jpg",
                dirPath = UPLOAD_PATH + '/' + id,
                filePath = dirPath + '/' + fileName,
                imageBuffer = decodeBase64Image(req.body.image);

            mkdirp.sync(dirPath, 0755);
            fs.writeFile(filePath, imageBuffer.data, function(err) {
                if(err)
                    res.json({error: "Cannot save image"}, 500);
                else {
                    var image = {
                        url: filePath.replace("./assets/", ""),
                        caption: req.body.caption,
                        owner: req.user.id
                    };
                    sails.log.debug(image);
                    Image.create(image).exec(function(err, imageEntity){
                        if(err)
                            res.json({error: "Cannot save image"}, 500);
                        else
                            res.json(imageEntity, 200);
                    });
                }
            });
        }

    }
};

