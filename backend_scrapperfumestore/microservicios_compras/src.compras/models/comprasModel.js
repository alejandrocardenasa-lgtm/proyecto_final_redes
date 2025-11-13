const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'mariadb_compras',   // nombre del servicio en Docker Swarm
  user: 'root',
  password: '',
  port: 3306,                // puerto interno del contenedor
  database: 'compras_db'
});

async function crearCompra(usuarioId, productoId, cantidad, precioTotal) {
  const [result] = await connection.query(
    'INSERT INTO compras (usuario_id, producto_id, cantidad, precio_total) VALUES (?, ?, ?, ?)',
    [usuarioId, productoId, cantidad, precioTotal]
  );
  return result;
}

module.exports = { crearCompra };
