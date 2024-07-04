const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [false, 'Username is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: [true, 'Created date is required']
  },
  comments: {
    type: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
      },
      comment: {
        type: String,
        required: [true, 'Comments are required']
      }
    }],
    default: []
  }
});

module.exports = mongoose.model('Blogs', blogSchema);
