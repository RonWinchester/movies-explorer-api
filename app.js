require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const usersRouter = require('./routes/users');
const router = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');
const { allowCors } = require('./middlewares/cors');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { PASS } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose
  .connect(
    `mongodb+srv://RonWinchester:${PASS}@cluster0.wb7mu.mongodb.net/bitfilmsdb?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(allowCors);

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
