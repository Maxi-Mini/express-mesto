const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  req.user = {
    _id: "61a0c01cd9aa1b7317c4cd79", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});




