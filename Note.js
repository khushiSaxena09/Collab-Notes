const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  updatedAt: { type: Date, default: Date.now },
  history: [
    {
      content: String,
      updatedAt: Date
    }
  ]
});

module.exports = mongoose.model('Note', NoteSchema);