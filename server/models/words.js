const mongoose = require('mongoose');

const WordSchema = mongoose.Schema({
  antonyms: [String],
  definitions: [String],
  examples: [String],
  gif: String,
  options: [String],
  partOfSpeech: [String],
  similarTo: [String],
  synonyms: [String],
  transcription: String,
  word: String,
  ownerId: String,
  timesLearnt: {
    type: Number,
    default: 0,
  },
  created: Date,
  updated: Date,
  lastLearnt: Date,
});

module.exports = mongoose.model('Word', WordSchema);
