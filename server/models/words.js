const mongoose = require('mongoose');

const WordSchema = mongoose.Schema({
  word: String,
  transcription: String,
  gif: String,
  ownerId: String,
  results: [
    {
      definition: String,
      partOfSpeech: String,
      antonyms: [String],
      synonyms: [String],
      examples: [String],
      hasTypes: [String],
      derivation: [String],
    },
  ],
  dateCreated: Date,
  dateLastUpdated: Date,
  timesLearnt: {
    type: Number,
    default: 0,
  },
  dateLastLearnt: Date,
});

module.exports = mongoose.model('Word', WordSchema);
