const fetch = require('isomorphic-unfetch');
const boom = require('boom');
const urlJoin = require('url-join');
const Word = require('../models/words');
const config = require('../config');

const WORD_API_KEY = config.auth.word.apiKey;

const responseToJson = response => response.json();

exports.create = async (request, response) => {
  const { authData } = request;
  const newWord = new Word({
    dateCreated: new Date(Date.now()).toISOString(),
    dateLastUpdated: new Date(Date.now()).toISOString(),
    dateLastLearnt: new Date(0),
    ownerId: authData._id,
    ...request.body,
  });
  const createdWord = await newWord.save();
  response.send(createdWord);
};

exports.findOne = async (request, response) => {
  const { id } = request.params;
  const word = await Word.findById(id);
  if (!word) {
    throw boom.notFound(`Word with id ${id} is not found`);
  }
  response.send(word);
};

exports.findAll = async (request, response) => {
  const { authData } = request;
  const { query = {}, ...restParams } = request.body;
  const ownerParam = { ownerId: authData._id };
  const searchParams = Object.keys(restParams).length > 0 ? Object.assign(restParams, ownerParam) : ownerParam;
  const words = await Word.find(searchParams)
    .limit(query.limit || 10000)
    .skip(query.skip || 0)
    .sort({
      [query.sortBy || 'dateLastUpdated']: query.sortDirection === -1 ? -1 : 1,
    });
  response.send({
    items: words,
    count: words.length,
  });
};

exports.update = async (request, response) => {
  const { body, params } = request;
  const updatedWord = {
    dateLastUpdated: new Date(Date.now()).toISOString(),
    ...body,
  };
  const word = await Word.findByIdAndUpdate(params.id, updatedWord, { new: true });
  if (!word) {
    throw boom.notFound(`Word with id ${params.id} is not found`);
  }
  response.send(word);
};

exports.delete = async (request, response) => {
  const { id } = request.params;
  const word = await Word.findByIdAndRemove(id);
  if (!word) {
    throw boom.notFound(`Word with id ${id} is not found`);
  }
  response.send({ message: 'Word deleted successfully!' });
};

exports.learnWord = async (request, response) => {
  const { id } = request.params;
  const updatedWord = {
    dateLastLearnt: new Date(Date.now()).toISOString(),
    $inc: { timesLearnt: 1 },
  };

  const word = await Word.findByIdAndUpdate(id, updatedWord, { new: true });
  if (!word) {
    throw boom.notFound(`Word with id ${params.id} is not found`);
  }
  response.send(word);
};

const mergeArrays = (data, field) =>
  Array.from(new Set(data.reduce((res, val) => (val[field] ? [...res, ...val[field]] : [...res]), [])));

const normalizeWord = (wordData = {}) => {
  const { results = [], ...rest } = wordData;

  return {
    examples: mergeArrays(results, 'examples'),
    definitions: results.map(item => item.definition),
    similarTo: mergeArrays(results, 'similarTo'),
    synonyms: mergeArrays(results, 'synonyms'),
    antonyms: mergeArrays(results, 'antonyms'),
    partOfSpeech: Array.from(new Set(results.map(item => item.partOfSpeech))),
    ...rest,
  };
};

exports.search = async (request, response) => {
  const { word } = request.body;
  if (!word) {
    throw boom.badRequest('Provide the word to search');
  }
  const wordApiEndpoint = urlJoin(config.auth.word.endpoint, word);
  const wordApiParams = {
    headers: {
      'X-Mashape-Key': WORD_API_KEY,
      Accept: 'application/json',
    },
  };
  const foundWord = await fetch(wordApiEndpoint, wordApiParams).then(responseToJson);
  const datamuseSuggestionEndpoint = `${config.endpoints.datamuse.suggestions}${word}`;
  const options = await fetch(datamuseSuggestionEndpoint)
    .then(responseToJson)
    .then(items => items.map(({ word }) => word));

  response.send({
    transcription: (foundWord.pronunciation && foundWord.pronunciation.all) || '',
    options,
    ...normalizeWord(foundWord),
  });
};
