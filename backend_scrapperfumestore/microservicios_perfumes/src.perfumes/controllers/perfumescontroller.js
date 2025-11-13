const { Router } = require('express');
const router = Router();
const Perfume = require('../models/perfumesmodel');

// Utilidad para manejar errores
const handleError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: "Error en el servidor" });
};

// Obtener todos
router.get('/api/perfumes', async (req, res) => {
  try {
    res.json(await Perfume.getAll());
  } catch (err) {
    handleError(res, err);
  }
});

// Buscar por nombre
router.get('/api/perfumes/nombre/:nombre', async (req, res) => {
  try {
    res.json(await Perfume.getByName(req.params.nombre));
  } catch (err) {
    handleError(res, err);
  }
});

// Buscar por ID
router.get('/api/perfumes/:id', async (req, res) => {
  try {
    const rows = await Perfume.getById(req.params.id);
    rows ? res.json(rows) : res.status(404).json({ mensaje: "Perfume no encontrado" });
  } catch (err) {
    handleError(res, err);
  }
});

// Crear perfume
router.post('/api/perfumes', async (req, res) => {
  try {
    const result = await Perfume.create(req.body);
    res.status(201).json({ mensaje: "Perfume agregado", id: result.insertId });
  } catch (err) {
    handleError(res, err);
  }
});

// Actualizar perfume
router.put('/api/perfumes/:id', async (req, res) => {
  try {
    await Perfume.update(req.params.id, req.body);
    res.json({ mensaje: "Perfume actualizado" });
  } catch (err) {
    handleError(res, err);
  }
});

// Eliminar perfume
router.delete('/api/perfumes/:id', async (req, res) => {
  try {
    await Perfume.remove(req.params.id);
    res.json({ mensaje: "Perfume eliminado" });
  } catch (err) {
    handleError(res, err);
  }
});

// Actualizar stock
router.put('/api/perfumes/:id/stock', async (req, res) => {
  try {
    const { cantidadCambio } = req.body;
    await Perfume.updateStock(req.params.id, cantidadCambio);
    res.json({ mensaje: "Stock actualizado" });
  } catch (err) {
    handleError(res, err);
  }
});

// =============================
// FILTROS
// =============================
router.get('/api/perfumes/marca/:marca', async (req, res) => {
  try { res.json(await Perfume.getByMarca(req.params.marca)); }
  catch (err) { handleError(res, err); }
});

router.get('/api/perfumes/familia/:familia', async (req, res) => {
  try { res.json(await Perfume.getByFamilia(req.params.familia)); }
  catch (err) { handleError(res, err); }
});

router.get('/api/perfumes/tipo/:tipo', async (req, res) => {
  try { res.json(await Perfume.getByTipo(req.params.tipo)); }
  catch (err) { handleError(res, err); }
});

router.get('/api/perfumes/genero/:genero', async (req, res) => {
  try { res.json(await Perfume.getByGenero(req.params.genero)); }
  catch (err) { handleError(res, err); }
});

router.get('/api/perfumes/notas/:notas', async (req, res) => {
  try { res.json(await Perfume.getByNotas(req.params.notas)); }
  catch (err) { handleError(res, err); }
});

router.get('/api/perfumes/resenas/:resenas', async (req, res) => {
  try { res.json(await Perfume.getByResenas(req.params.resenas)); }
  catch (err) { handleError(res, err); }
});

router.get('/api/perfumes/precio/:precio', async (req, res) => {
  try { res.json(await Perfume.getByPrecio(req.params.precio)); }
  catch (err) { handleError(res, err); }
});

module.exports = router;

module.exports = router;
