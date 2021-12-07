const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
// const { serverError, badRequest, notFound } = require('../utils/const');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// const deleteCard = (req, res, next) => {
//   Card.findById(req.params.id)
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Карточка с таким _id не найдена');
//       }
//       if (card.owner._id.toString() === req.user._id) {
//         Card.findByIdAndRemove(req.params.id).then((card) => {
//           res.send(card);
//         });
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         throw new BadRequestError('Переданы некорректные данные');
//       }
//     })
//     .catch(next);
// };

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким _id не найдена');
    }

    if (card.owner._id.toString() !== req.user._id) {
      throw new ForbiddenError('Нельзя удалять карточки других пользователей');
    }

    Card.findByIdAndRemove(req.params.id)
      // eslint-disable-next-line no-shadow
      .then((card) => {
        res.send(card);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError('Неправильный id');
        }
      })
      .catch(next);
  });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
