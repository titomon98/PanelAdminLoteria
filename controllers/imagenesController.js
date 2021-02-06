const mongoose = require('mongoose');
const Imagenes = mongoose.model('Imagenes');

const shortid = require('shortid');
const multer = require('multer');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));


/* var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dxj44eizq',
    api_key: '288216134484757',
    api_secret: 'tsARZ4LZud-EI_pr7rQaBAq9k6s'
}) */

exports.formularioNuevaImagen = (req, res) => {
    res.render('nueva-imagen', {
        nombrePagina: 'Nueva Imagen',
        tagline: 'Llena el formulario para ingresar nueva imagen',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

exports.agregarImagen = async (req, res) => {
    const imagen = new Imagenes(req.body);
    // almacenarlo en la base de datos
    const nuevaImagen = await imagen.save();
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 10MB ');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
           
            // redireccionar
            res.redirect('/administracion');
            return;
        } else {
            res.redirect(`/imagenes/${nuevaImagen.url}`);
        }
    });
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
            cb(null, `${shortid.generate()}.${extension}`);
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

const upload = multer(configuracionMulter).single('imagen');

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


//llenar el form de editar imagen
exports.formEditarImagen = async (req, res, next) => {
    const imagenes = await Imagenes.findOne({ url: req.params.url});

    if(!imagenes) return next();

    res.render('editar-imagen', {
        imagenes,
        nombrePagina : `Editar Imagen - ${imagenes.nombre}`,
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

//enviar los datos a la db
exports.editarImagen = async (req, res) => {
    const datoActualizado = req.body;

    const imagenes = await Imagenes.findOneAndUpdate({url: req.params.url}, datoActualizado, {
        new: true,
        runValidators: true
    } );

    res.redirect(`/imagenes/${imagenes.url}`);
}

// Validar y Sanitizar los campos de las imagenes
exports.validarImagen = (req, res, next) => {
    // sanitizar los campos
    req.sanitizeBody('nombre').escape();
    // validar
    req.checkBody('nombre', 'Selecciona un nombre para la imagen').notEmpty();

   

    const errores = req.validationErrors();

    if(errores) {
        // Recargar la vista con los errores
        req.flash('error', errores.map(error => error.msg));

        res.render('nueva-imagen', {
            nombrePagina: 'Nueva Imagen',
            tagline: 'Llena el formulario y publica tu imagen',
            cerrarSesion: true,
            nombre : req.user.nombre,
            mensajes: req.flash()
        })
    }

    next(); // siguiente middleware
}