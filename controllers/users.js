const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { serverError, badRequest, notFound } = require('../utils/const');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverError.status).send({ message: serverError.message }));
};

const getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(notFound.status).send({ message: notFound.message });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => { res.send(user.toJSON()); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const updateUser = (req, res) => {
  const { id } = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(notFound.status).send({ message: notFound.message });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const updateAvatar = (req, res) => {
  const { id } = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(notFound.status).send({ message: notFound.message });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.status(200)
        .cookie('jwt', token, {
          maxAge: '7d',
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
