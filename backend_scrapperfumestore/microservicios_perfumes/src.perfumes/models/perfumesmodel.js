const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'mariadb_perfumes',   // Nombre del servicio en Swarm
  user: 'root',
  password: '',
  port: 3306,                 // Puerto interno del contenedor
  database: 'perfumedb'
});

async function getAll() {
  const [rows] = await db.query('SELECT * FROM perfumes');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE id = ?', [id]);
  return rows[0];
}

async function create(data) {
  const [result] = await db.query('INSERT INTO perfumes SET ?', [data]);
  return result;
}

async function update(id, data) {
  const [result] = await db.query('UPDATE perfumes SET ? WHERE id = ?', [data, id]);
  return result;
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM perfumes WHERE id = ?', [id]);
  return result;
}

async function getByMarca(marca) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE marca LIKE ?', [`%${marca}%`]);
  return rows;
}

async function getByFamilia(familia) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE familia LIKE ?', [`%${familia}%`]);
  return rows;
}

async function getByTipo(tipo) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE tipo LIKE ?', [`%${tipo}%`]);
  return rows;
}

async function getByGenero(genero) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE genero LIKE ?', [`%${genero}%`]);
  return rows;
}

async function getByNotas(notas) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE notas LIKE ?', [`%${notas}%`]);
  return rows;
}

async function getByResenas(resenas) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE resenas LIKE ?', [`%${resenas}%`]);
  return rows;
}

async function getByPrecio(precio) {
  const [rows] = await db.query('SELECT * FROM perfumes WHERE precio_cop <= ?', [precio]);
  return rows;
}

async function updateStock(id, cantidad) {
  const [result] = await db.query(
    'UPDATE perfumes SET stock = stock + ? WHERE id = ?', 
    [cantidad, id]
  );
  return result;
}

module.exports = { 
  getAll, getById, create, update, remove,
  getByMarca, getByFamilia, getByTipo, getByGenero,
  getByNotas, getByResenas, getByPrecio, updateStock 
};
