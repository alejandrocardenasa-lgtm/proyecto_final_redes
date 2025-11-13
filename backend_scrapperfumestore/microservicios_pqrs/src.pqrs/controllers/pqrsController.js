const { Router } = require('express');
const router = Router();
const pqrsModel = require('../models/pqrsModel');
const axios = require('axios');

// Crea una nueva PQRS después de validar que el usuario exista
router.post('/api/pqrs', async (req, res) => {
  try {
    const { usuarioId, tipo, descripcion } = req.body;
    
    const usuarioResponse = await axios.get(`http://proyecto_final_microservicios_usuarios:3001/api/usuarios/${usuarioId}`);
    if (usuarioResponse.status !== 200 || !usuarioResponse.data) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await pqrsModel.crearPqrs(usuarioId, tipo, descripcion);
    res.status(201).json({ mensaje: "PQRS creada con éxito" });
  } catch (error) {
    console.error("Error al crear PQRS:", error);
    res.status(500).json({ error: "Error al crear PQRS" });
  }
});

// Actualiza el estado o respuesta de una PQRS existente
router.put('/api/pqrs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, respuestaAdmin } = req.body;
        await pqrsModel.actualizarPqrs(id, estado, respuestaAdmin);
        res.status(200).json({ mensaje: "PQRS actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar PQRS:", error);
        res.status(500).json({ error: "Error al actualizar PQRS" });
    }
});

// Obtiene todas las PQRS asociadas a un usuario específico
router.get('/api/pqrs/usuario/:usuarioId', async (req, res) => {
    try {
        const pqrs = await pqrsModel.obtenerPqrsPorUsuario(req.params.usuarioId);
        res.status(200).json(pqrs);
    } catch (error) {
        console.error("Error al obtener PQRS:", error);
        res.status(500).json({ error: "Error al obtener PQRS" });
    }
});

// Obtiene todas las PQRS existentes en el sistema
router.get('/api/pqrs/all', async (req, res) => {
    try {
        const pqrs = await pqrsModel.obtenerTodasPqrs();
        res.status(200).json(pqrs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Elimina una PQRS por su ID
router.delete('/api/pqrs/:id', async (req, res) => {
    try {
        await pqrsModel.eliminarPqrs(req.params.id);
        res.status(200).json({ mensaje: "PQRS eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar PQRS:", error);
        res.status(500).json({ error: "Error al eliminar PQRS" });
    }
});

module.exports = router;
