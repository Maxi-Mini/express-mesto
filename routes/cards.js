const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:id", deleteCard);
router.put("/cards/:id/likes", putLike);
router.delete("/cards/:id/likes", deleteLike);

module.exports = router;
