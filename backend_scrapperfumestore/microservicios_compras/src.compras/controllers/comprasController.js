const { Router } = require('express');
const router = Router();
const comprasModel = require('../models/comprasModel');
const axios = require('axios');

router.post('/api/compras', async (req, res) => {
  try {
    const { usuarioId, productoId, cantidad, direccionEnvio } = req.body;

    // Obtener usuario
    const usuarioResponse = await axios.get(
      `http://microservicios_usuarios:3001/api/usuarios/${usuarioId}`
    );
    const usuario = usuarioResponse.data;

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Obtener perfume
    const productoResponse = await axios.get(
      `http://microservicios_perfumes:4000/api/perfumes/${productoId}`
    );
    const producto = productoResponse.data;

    if (!producto) {
      return res.status(404).json({ mensaje: "Perfume no encontrado" });
    }

    // Validar stock
    if (producto.stock < cantidad) {
      return res.status(400).json({ mensaje: "Stock insuficiente del perfume" });
    }

    // Calcular precio
    const precioTotal = producto.precio_cop * cantidad;

    // Crear compra
    const compraResult = await comprasModel.crearCompra(
      usuarioId,
      productoId,
      cantidad,
      precioTotal
    );
    const compraId = compraResult[0].insertId;

    // Reducir stock
    await axios.put(
      `http://microservicios_perfumes:4000/api/perfumes/${productoId}/stock`,
      { cantidadCambio: -cantidad }
    );

    // Crear envío
    await axios.post(
      'http://microservicios_envios:3004/api/envios',
      {
        compraId: compraId,
        usuarioId: usuario.id,
        direccionEnvio: direccionEnvio,
      }
    );

    res.status(201).json({
      mensaje: "Compra procesada con éxito",
      compraId: compraId
    });

  } catch (error) {
    console.error("Error al procesar la compra:", error.message);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
});

module.exports = router;
