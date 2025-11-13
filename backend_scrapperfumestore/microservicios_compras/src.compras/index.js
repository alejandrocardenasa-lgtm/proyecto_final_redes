const express = require('express');
const comprasController = require('./controllers/comprasController');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3003;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(comprasController);

app.listen(PORT, () => {
  console.log(`compras corriendo en puerto interno ${PORT}`);

});
