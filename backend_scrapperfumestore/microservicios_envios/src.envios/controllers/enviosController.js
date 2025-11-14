const { Router } = require('express');
const router = Router();
const enviosModel = require('../models/enviosModel');

// Crear envío
router.post('/api/envios', async (req, res) => {
  try {
    const { compraId, usuarioId, direccionEnvio } = req.body;
    await enviosModel.crearEnvio(compraId, usuarioId, direccionEnvio);

    res.status(201).json({ mensaje: "Envío creado y pendiente de despacho" });
  } catch (error) {
    console.error("Error al crear el envío:", error);
    res.status(500).json({ error: "Error al crear el envío" });
  }
});

// Actualizar estado por compraId (versión antigua)
router.put('/api/envios/:compraId/estado', async (req, res) => {
  try {
    const { compraId } = req.params;
    const { nuevoEstado } = req.body;

    await enviosModel.actualizarEstadoEnvio(compraId, nuevoEstado);
    res.status(200).json({ mensaje: "Estado del envío actualizado" });
  } catch (error) {
    console.error("Error al actualizar envío:", error);
    res.status(500).json({ error: "Error al actualizar envío" });
  }
});

// Obtener por compraId
router.get('/api/envios/compra/:compraId', async (req, res) => {
  try {
    const envio = await enviosModel.obtenerEnvioPorCompraId(req.params.compraId);

    envio
      ? res.status(200).json(envio)
      : res.status(404).json({ mensaje: "Envío no encontrado para esa compra." });

  } catch (error) {
    console.error("Error al obtener envío:", error);
    res.status(500).json({ error: "Error al obtener envío" });
  }
});

// Obtener por ID
router.get('/api/envios/:id', async (req, res) => {
  try {
    const envio = await enviosModel.obtenerEnvioPorId(req.params.id);

    envio
      ? res.status(200).json(envio)
      : res.status(404).json({ mensaje: "Envío no encontrado." });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener envío por ID." });
  }
});

// Ruta corregida para actualizar estado usando 'estado'
router.put('/api/envios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ mensaje: "El campo 'estado' es requerido." });
    }

    const result = await enviosModel.actualizarEstadoEnvio(id, estado);

    result.affectedRows > 0
      ? res.status(200).json({ mensaje: "Estado actualizado con éxito" })
      : res.status(404).json({ mensaje: "Envío no encontrado." });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al actualizar estado." });
  }
});

module.exports = router;
