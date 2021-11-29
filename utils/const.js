const serverError = {
  message: 'Произошла ошибка',
  status: '500',
};

const badRequest = {
  message: 'Произошла ошибка',
  status: '400',
};

const notFound = {
  message: 'Переданы несуществующие данные',
  status: '404',
};

module.exports = {
  serverError,
  badRequest,
  notFound,
};
