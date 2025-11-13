const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModel');
const axios = require('axios');

// Registra un nuevo usuario en la base de datos
router.post('/api/usuarios/registro', async (req, res) => {
  try {
    const { nombre, email, usuario, password, rol } = req.body;
    await usuariosModel.crearUsuario(nombre, email, usuario, password, rol);
    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Valida las credenciales de inicio de sesión
router.post('/api/usuarios/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const user = await usuariosModel.validarUsuario(usuario, password);
    if (user) {
      res.status(200).json({ mensaje: "Credenciales válidas", usuario: user });
    } else {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Error al validar credenciales:", error);
    res.status(500).json({ error: "Error al validar credenciales" });
  }
});

// Obtiene un usuario por su ID
router.get('/api/usuarios/:id', async (req, res) => {
    try {
        const user = await usuariosModel.obtenerUsuarioPorId(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
});

// Actualiza los datos de un usuario existente
router.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const result = await usuariosModel.actualizarUsuario(req.params.id, nombre, email);
        if (result.affectedRows > 0) {
            res.status(200).json({ mensaje: "Usuario actualizado con éxito" });
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado para actualizar" });
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
});

// Elimina un usuario por su ID
router.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const result = await usuariosModel.eliminarUsuario(req.params.id);
        if (result.affectedRows > 0) {
            res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado para eliminar" });
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

module.exports = router;
