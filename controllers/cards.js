const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  return Card.create({ name, link, ownerId })
    .then((card) => res.send({data: card}))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: " Карточка с указанным _id не найдена" });
      }
      return res.send({data:card});
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при удалении карточки",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки/снятии лайка",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки/снятии лайка",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
