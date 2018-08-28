const multer = require("multer");

const MIME_TYPES = {
  'image/png': 'png',
  'image/jpg': 'jng',
  'image/jpeg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: storage }).single("image");
