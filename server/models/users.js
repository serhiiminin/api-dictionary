const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: String,
  imageUrl: String,
  googleId: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  password: String,
  expires: Date,
  searchHistory: [mongoose.Schema.Types.Mixed],
});

module.exports = mongoose.model('User', UserSchema);
