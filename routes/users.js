const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserId,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserId);
router.get('/users/me', getUser);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /((http|https):\/\/)?(www\.)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~]*)*(#[\w-]*)?(\?.*)?/,
        ),
    }),
  }),
  updateAvatar,
);

module.exports = router;
