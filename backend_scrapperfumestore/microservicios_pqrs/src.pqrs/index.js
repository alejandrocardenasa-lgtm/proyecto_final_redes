const express = require('express');
const pqrsController = require('./controllers/pqrsController');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(pqrsController);

app.listen(PORT, () => {
  console.log(``pqrs corriendo en puerto interno ${PORT}`);

});
