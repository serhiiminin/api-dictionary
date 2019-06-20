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
  dateCreated: Date,
  dateLastUpdated: Date,
  timesLearnt: {
    type: Number,
    default: 0,
  },
  dateLastLearnt: Date,
});

module.exports = mongoose.model('Word', WordSchema);
