const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3307',
  database: 'compras_db'
});

async function crearCompra(usuarioId, productoId, cantidad, precioTotal) {
  const result = await connection.query(
    'INSERT INTO compras (usuario_id, producto_id, cantidad, precio_total) VALUES (?, ?, ?, ?)',
    [usuarioId, productoId, cantidad, precioTotal]
  );
  return result;
}

module.exports = { crearCompra };