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
exports.mostrarImagenGeneral = async (req, res, next) => {
    const imagenes = await Imagenes.find();
    // si no hay resultados
    if(!imagenes) return next();
    res.send(imagenes);
}

// Opciones de Multer
const configuracionMulter = {
    limits : { fileSize : 10000000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/images');
        }, 
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            nombreImagen = `${shortid.generate()}.${extension}`;
            rutaImagen = './public/uploads/images' + '/' + nombreImagen;
            cb(null, nombreImagen);
            
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta

            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('guardar');