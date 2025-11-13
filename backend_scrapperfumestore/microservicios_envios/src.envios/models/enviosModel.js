const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'mariadb_envios',   // nombre del servicio en Docker Swarm
  user: 'root',
  password: '',
  port: 3306,               // puerto interno del contenedor, NO el expuesto
  database: 'envios_db'
});

async function crearEnvio(compraId, usuarioId, direccionEnvio) {
  const [result] = await db.query(
    'INSERT INTO envios (compra_id, usuario_id, direccion_envio, estado) VALUES (?, ?, ?, ?)',
    [compraId, usuarioId, direccionEnvio, 'Pendiente']
  );
  return result;
}

async function actualizarEstadoEnvio(id, nuevoEstado) {
  const [result] = await db.query(
    'UPDATE envios SET estado = ? WHERE id = ?',
    [nuevoEstado, id]
  );
  return result;
}

async function obtenerEnvioPorCompraId(compraId) {
  const [rows] = await db.query(
    'SELECT * FROM envios WHERE compra_id = ?',
    [compraId]
  );
  return rows[0];
}

async function obtenerEnvioPorId(id) {
  const [rows] = await db.query(
    'SELECT * FROM envios WHERE id = ?', 
    [id]
  );
  return rows[0];
}

module.exports = { 
  crearEnvio, 
  actualizarEstadoEnvio, 
  obtenerEnvioPorCompraId, 
  obtenerEnvioPorId 
};
