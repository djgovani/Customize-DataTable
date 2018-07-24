const fs = require('fs');
const jsonfile = require('jsonfile')
const path = require('path');
const base64Img = require('base64-img');
const multer = require('multer');
// const fileExists = require('../helper');


const file = path.join(__dirname, '../public/logo.png');

module.exports = {
  /*
  ----------------------------------------------------------------------
    - getImgUrl Controller Function
      * Output: 200 status code on Success, base64
  ----------------------------------------------------------------------
  */
  postImg(req, res) {
    fs.exists(file, function(exists){
      if(exists){
        fs.unlink('public/logo.png', (err) => {
          if (err) throw err;
          console.log('successfully deleted /public/logo.png');
        });

        uploadImg();
      } else {
        uploadImg();
      }

      function uploadImg() {
        let storage =   multer.diskStorage({
          destination: function (req, file, callback) {
            callback(null, 'public');
          },
          filename: function (req, file, callback) {
            const ext = file.mimetype.split('/')[1];
            callback(null, 'logo.png');
          }
        });

        let upload = multer({ storage : storage}).single('fileLogo');

        upload(req, res, function(err) {
          if (err) {
            res.status(500).json({
              message: 'Error Occured!',
              Stack: err
            });
          } else {
            res.status(200).json({
              message: 'Image Uploaded'
            })
          }
        })
      }
    });

  },


  /*
  ----------------------------------------------------------------------
    - getImgUrl Controller Function
      * Output: 200 status code on Success, base64
  ----------------------------------------------------------------------
  */
  getImgUrl(req, res) {
    fs.exists(file, function(exists){
      if(exists){
        let data = base64Img.base64Sync(file);
        res.status(200).json({
          data: data,
        });
      } else {
        res.status(204).json({message: 'file not exists'});
        console.log("file not exists");
      }
    });
  }
};