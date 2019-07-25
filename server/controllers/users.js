const boom = require('@hapi/boom');
const User = require('../models/users');

exports.create = async (request, response) => {
  const newUser = new User({
    created: new Date(Date.now()).toISOString(),
    updated: new Date(Date.now()).toISOString(),
    ...request.body,
  });
  const createdUser = await newUser.save();
  response.send(createdUser);
};

exports.findOne = async (request, response) => {
  const { id } = request.params;
  const user = await User.find({ _id: request.params.id });
  if (!user) {
    throw boom.notFound(`User with id ${id} is not found`);
  }
  response.send(user[0]);
};

exports.update = async (request, response) => {
  const { id } = request.params;
  const updatedUser = {
    updated: new Date(Date.now()).toISOString(),
    ...request.body,
  };
  const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });
  if (!user) {
    throw boom.notFound(`User with id ${id} is not found`);
  }
  response.send(user);
};

exports.delete = async (request, response) => {
  const { id } = request.params;
  const user = await User.findByIdAndRemove(id);
  if (!user) {
    throw boom.notFound(`User with id ${id} is not found`);
  }
  response.send({ message: 'User deleted successfully!' });
};
