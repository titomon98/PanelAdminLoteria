const mongoose = require('mongoose');
const Imagenes = mongoose.model('Imagenes');

const shortid = require('shortid');
const multer = require('multer');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));

// muestra una imagen individual
exports.mostrarImagen = async (req, res, next) => {
    const imagenes = await Imagenes.findOne({ url: req.params.url });
    // si no hay resultados
    if(!imagenes) return next();

    res.render('imagen', {
        imagenes,
        nombrePagina : imagenes.nombre,
        barra: true,
        tagline: 'Visualiza o modifica los datos de la imagen',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

exports.criteriosImagenes = async (req, res) => {
    var imagen;
    if (req.params.criterio === 'nombre'){
        imagen = await Imagenes.find({nombre: { $regex: '.*' + req.params.buscar + '.*' } });
    }
    else if (req.params.criterio === 'numero'){
        imagen = await Imagenes.find({id: req.params.buscar });
    }
    
    // si no hay resultados
    if(!imagen) res.send('No hay imágenes registradas con esos parámetros');

    res.send(imagen);
}

exports.actualizarImagen = async (req, res) => {
    const imagen = await Imagenes.findById(req.body._id);
    imagen.urlC = req.body.imagen;
    try {
        await imagen.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

// muestra una imagen individual
exports.mostrarImagenId = async (req, res, next) => {
    const imagenes = await Imagenes.findOne({ id: req.params.id });
    // si no hay resultados
    if(!imagenes) return next();
    return imagenes;
}

// muestra una imagen individual
exports.mostrarImagenGeneral = async (req, res) => {
    const imagenes = await Imagenes.find();
    // si no hay resultados
    if(!imagenes) res.send('Ocurrió un error');
    res.send(imagenes);
}