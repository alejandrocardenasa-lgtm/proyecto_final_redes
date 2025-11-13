const express = require('express');
const enviosController = require('./controllers/enviosController');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3004;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(enviosController);

app.listen(PORT, () => {
  console.log(`envios corriendo en puerto interno ${PORT}`);

});
