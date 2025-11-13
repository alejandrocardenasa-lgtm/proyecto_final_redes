const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3307',
  database: 'usuariosdb' 
});

async function crearUsuario(nombre, email, usuario, password, rol) {
  const result = await connection.query(
    'INSERT INTO usuarios (nombre, email, usuario, password, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, usuario, password, rol]
  );
  return result;
}

async function validarUsuario(usuario, password) {
  const [rows] = await connection.query(
    'SELECT id, nombre, usuario, rol FROM usuarios WHERE usuario = ? AND password = ?',
    [usuario, password]
  );
  return rows[0]; 
}

async function obtenerUsuarioPorId(id) {
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
}

async function actualizarUsuario(id, nombre, email) {
    const result = await connection.query(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id]
    );
    return result;
}

async function eliminarUsuario(id) {
    const result = await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
}

module.exports = { crearUsuario, validarUsuario, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario };