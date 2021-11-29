const Card = require('../models/card');
const { serverError, badRequest, notFound } = require('../utils/const');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(serverError.status).send({ message: serverError.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(notFound.status).send({ message: notFound.message });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFound.status).send({ message: notFound.message });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFound.status).send({ message: notFound.message });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest.status).send({ message: badRequest.message });
      }
      return res.status(serverError.status).send({ message: serverError.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
