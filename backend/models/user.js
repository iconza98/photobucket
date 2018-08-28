const mongoose = require('mongoose');
const unquieValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  email: { type: String, required: true, unquie: true },
  password: { type: String, required: true },
});

userSchema.plugin(unquieValidator);

module.exports = mongoose.model('User', userSchema);
