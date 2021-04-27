const mongoose = require('mongoose');
const Reverso = mongoose.model('Reverso');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));

exports.actualizarImagen = async (req, res) => {
    const imagen = await Reverso.findById(req.body._id);
    imagen.urlR = req.body.imagen;
    try {
        await imagen.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

// muestra una imagen individual
exports.mostrarImagenGeneral = async (req, res) => {
    const imagenes = await Reverso.find();
    // si no hay resultados
    if (!imagenes) res.send('Ocurrió un error');
    res.send(imagenes);
}