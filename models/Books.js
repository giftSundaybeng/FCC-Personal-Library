const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String] // Store comments in an array
});

module.exports = mongoose.model('Book', bookSchema);
