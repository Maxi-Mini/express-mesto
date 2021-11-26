const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
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
            message: "Переданы некорректные данные при создании пользователя",
          });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
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
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
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
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
