const express = require('express');
const perfumesController = require('./controllers/perfumescontroller');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(perfumesController);

app.listen(PORT, () => {
  console.log(`perfumes corriendo en puerto interno ${PORT}`);

});
