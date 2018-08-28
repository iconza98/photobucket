const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  imagePath: {type: String, required: true},
});

module.exports = mongoose.model('Photo', postSchema);
