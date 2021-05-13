const mongoose = require('mongoose');
const Premios = mongoose.model('Productos');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));

// muestra un producto individual
exports.mostrarProductoGeneral = async (req, res) => {
    const producto = await Productos.find({ cantidad: { $gte: 1 } }).exec();
    // si no hay resultados
    if (!producto) res.send('No se encontraron productos');
    res.send(producto);
}