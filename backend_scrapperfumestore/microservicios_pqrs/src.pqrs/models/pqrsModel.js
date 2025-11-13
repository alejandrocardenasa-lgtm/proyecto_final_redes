const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3307',
  database: 'pqrs_db'
});

async function crearPqrs(usuarioId, tipo, descripcion) {
  const result = await connection.query(
    'INSERT INTO pqrs (usuario_id, tipo, descripcion, estado) VALUES (?, ?, ?, ?)',
    [usuarioId, tipo, descripcion, 'En Proceso']
  );
  return result;
}

async function actualizarPqrs(id, estado, respuestaAdmin) {
  const result = await connection.query(
    'UPDATE pqrs SET estado = ?, respuesta_admin = ? WHERE id = ?',
    [estado, respuestaAdmin, id]
  );
  return result;
}

async function obtenerPqrsPorUsuario(usuarioId) {
  const [rows] = await connection.query('SELECT * FROM pqrs WHERE usuario_id = ?', [usuarioId]);
  return rows;
}

async function obtenerTodasPqrs() {
    const [rows] = await connection.query('SELECT * FROM pqrs');
    return rows;
}

async function eliminarPqrs(id) {
    const result = await connection.query('DELETE FROM pqrs WHERE id = ?', [id]);
    return result;
}

module.exports = { crearPqrs, actualizarPqrs, obtenerPqrsPorUsuario, obtenerTodasPqrs, eliminarPqrs };