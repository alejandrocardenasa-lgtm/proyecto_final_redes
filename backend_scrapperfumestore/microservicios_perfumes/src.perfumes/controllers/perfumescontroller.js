const { Router } = require('express');
const router = Router();
const Perfume = require('../models/perfumesmodel');

router.get('/api/perfumes', async (req, res) => {
  try {
    const rows = await Perfume.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/nombre/:nombre', async (req, res) => {
  try {
    const rows = await Perfume.getByName(req.params.nombre);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/:id', async (req, res) => {
  try {
    const rows = await Perfume.getById(req.params.id);
    if (rows) {
        res.json(rows);
    } else {
        res.status(404).json({ mensaje: "Perfume no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/api/perfumes', async (req, res) => {
  try {
    const result = await Perfume.create(req.body);
    res.status(201).json({ mensaje: '✅ Perfume agregado', id: result.insertId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/api/perfumes/:id', async (req, res) => {
  try {
    const result = await Perfume.update(req.params.id, req.body);
    res.json({ mensaje: '✏️ Perfume actualizado' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/api/perfumes/:id', async (req, res) => {
  try {
    await Perfume.remove(req.params.id);
    res.json({ mensaje: '🗑️ Perfume eliminado' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/api/perfumes/:id/stock', async (req, res) => {
  try {
    const { cantidadCambio } = req.body;
    await Perfume.updateStock(req.params.id, cantidadCambio);
    res.json({ mensaje: 'Stock actualizado con éxito' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/marca/:marca', async (req, res) => {
  try {
    const rows = await Perfume.getByMarca(req.params.marca);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/familia/:familia', async (req, res) => {
  try {
    const rows = await Perfume.getByFamilia(req.params.familia);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/tipo/:tipo', async (req, res) => {
  try {
    const rows = await Perfume.getByTipo(req.params.tipo);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/genero/:genero', async (req, res) => {
  try {
    const rows = await Perfume.getByGenero(req.params.genero);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/notas/:notas', async (req, res) => {
  try {
    const rows = await Perfume.getByNotas(req.params.notas);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/resenas/:resenas', async (req, res) => {
  try {
    const rows = await Perfume.getByResenas(req.params.resenas);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/perfumes/precio/:precio', async (req, res) => {
  try {
    const rows = await Perfume.getByPrecio(req.params.precio);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;