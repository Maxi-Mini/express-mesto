const User = require("../models/user");
const { serverError, badRequest, notFound } = require("../utils/const");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ serverError }));
};

const getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ notFound  });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ badRequest });
      }
      return res.status(500).send({ serverError });
    });
};

const createUser = (req, res) => {
  const data = { ...req.body };
  User.create(data)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            badRequest
          });
      }
      return res.status(500).send({ serverError });
    });
};

const updateUser = (req, res) => {
  const { id } = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ notFound  });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({
          badRequest
        });
      }
      return res.status(500).send({ serverError });
    });
};

const updateAvatar = (req, res) => {
  const { id } = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ notFound  });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({
          badRequest
        });
      }
      return res.status(500).send({ serverError });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
