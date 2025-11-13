const { Router } = require('express');
const router = Router();
const enviosModel = require('../models/enviosModel');
const axios = require('axios');

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

router.put('/api/envios/:compraId/estado', async (req, res) => {
  try {
    const { compraId } = req.params;
    const { nuevoEstado } = req.body; // Este es el endpoint antiguo para actualizar por compraId
    await enviosModel.actualizarEstadoEnvio(compraId, nuevoEstado);
    res.status(200).json({ mensaje: "Estado del envío actualizado" });
  } catch (error) {
    console.error("Error al actualizar el estado del envío:", error);
    res.status(500).json({ error: "Error al actualizar el estado del envío" });
  }
});

router.get('/api/envios/compra/:compraId', async (req, res) => {
    try {
        const envio = await enviosModel.obtenerEnvioPorCompraId(req.params.compraId);
        if (envio) {
            res.status(200).json(envio);
        } else {
            res.status(404).json({ mensaje: "Envío no encontrado para esa compra." });
        }
    } catch (error) {
        console.error("Error al obtener el estado del envío:", error);
        res.status(500).json({ error: "Error al obtener el estado del envío" });
    }
});

router.get('/api/envios/:id', async (req, res) => {
    try {
        const envio = await enviosModel.obtenerEnvioPorId(req.params.id);
        if (envio) {
            res.status(200).json(envio);
        } else {
            res.status(404).json({ mensaje: "Envío no encontrado." });
        }
    } catch (error) {
        console.error("Error al obtener el envío por ID:", error);
        res.status(500).json({ error: "Error al obtener el envío por ID." });
    }
});

// ESTA ES LA RUTA CORREGIDA: Ahora espera 'estado' en el body, no 'nuevoEstado'
router.put('/api/envios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // <-- CAMBIO AQUÍ: antes era 'nuevoEstado'
        
        if (!estado) {
            return res.status(400).json({ mensaje: "El campo 'estado' es requerido para actualizar el envío." });
        }

        const result = await enviosModel.actualizarEstadoEnvio(id, estado); // Pasa 'estado' al modelo
        if (result.affectedRows > 0) {
            res.status(200).json({ mensaje: "Estado del envío actualizado con éxito" });
        } else {
            res.status(404).json({ mensaje: "Envío no encontrado para actualizar." });
        }
    } catch (error) {
        console.error("Error al actualizar el estado del envío:", error);
        res.status(500).json({ error: "Error al actualizar el estado del envío." });
    }
});

module.exports = router;