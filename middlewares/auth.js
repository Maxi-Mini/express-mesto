const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
};
