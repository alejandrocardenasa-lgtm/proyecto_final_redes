const express = require('express');
const usuariosController = require('./controllers/usuariosController');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(usuariosController);

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Usuarios ejecutándose en http://localhost:${PORT}`);
});