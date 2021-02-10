const mongoose = require('mongoose');
const Premios = mongoose.model('Premios');

const multer = require('multer');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));


var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dxj44eizq',
    api_key: '288216134484757',
    api_secret: 'tsARZ4LZud-EI_pr7rQaBAq9k6s'
})


var nombreImagen;
var rutaImagen;
var url;

exports.formularioNuevoPremio = (req, res) => {
    res.render('nuevo-premio', {
        nombrePagina: 'Nuevo Premio',
        tagline: 'Llena el formulario y publica tu premio',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

// agrega los premios a la base de datos
exports.agregarPremio = async (req, res, next) => {
    const premio = new Premios(req.body);

    //temporal
    premio.ubicacion = 'para el futuro';
    premio.imagen = 'Aqui va el link';

    // almacenarlo en la base de datos
    const nuevoPremio = await premio.save()

    url = nuevoPremio.url;

    res.render('img-premio', {
        nombrePagina: 'Nueva imagen para premio',
        tagline: 'Ingresa una imagen para el premio',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen,
    });
    

}

exports.imagenPremio = async( req, res) => {
    const premio = await Premios.findOne({ url: url});
    upload(req, res, async function(error) {
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
            try {
                const foto_aux = await cloudinary.uploader.upload(rutaImagen);
                premio.imagen = foto_aux.secure_url;
            } catch (error) {
                console.log(error)
            }
            res.redirect(`/premios/${premios.url}`);
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
            nombreImagen = `${shortid.generate()}.${extension}`;
            rutaImagen = './public/uploads/premios' + '/' + nombreImagen;

           
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

const upload = multer(configuracionMulter).single('imagen');

// muestra un premio individual
exports.mostrarPremio = async (req, res, next) => {
    const premio = await Premios.findOne({ url: req.params.url });
    // si no hay resultados
    if(!premio) return next();

    res.render('premio', {
        premio,
        nombrePagina : premio.nombre,
        barra: true,
        tagline: 'Visualiza o modifica los datos del premio',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

//llenar el form de editar premio
exports.formEditarPremio = async (req, res, next) => {
    const premio = await Premios.findOne({ url: req.params.url});

    if(!premio) return next();
    var vencimiento = premio.vencimiento.toISOString().substring(0,10);

    res.render('editar-premio', {
        premio,
        nombrePagina : `Editar Premio - ${premio.nombre}`,
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen, 
        vencimiento
    })
}

//enviar los datos a la db
exports.editarPremio = async (req, res) => {
    const premioActualizado = req.body;

    const premio = await Premios.findOneAndUpdate({url: req.params.url}, premioActualizado, {
        new: true,
        runValidators: true
    } );

    res.redirect(`/premios/${premio.url}`);
}

exports.eliminarPremio = async (req, res) => {
    const { id } = req.params;

    const premio = await Premios.findById(id);

    premio.remove();
    res.status(200).send('Premio Eliminado Correctamente');    
}

// Validar y Sanitizar los campos de los premios
exports.validarPremio = (req, res, next) => {
    // sanitizar los campos
    req.sanitizeBody('tipo').escape();
    req.sanitizeBody('fichas').escape();
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('direccion').escape();
    req.sanitizeBody('contacto').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('vencimiento').escape();
    req.sanitizeBody('descripcion').escape();

    // validar
    req.checkBody('tipo', 'Selecciona un tipo de premio').notEmpty();
    req.checkBody('fichas', 'Agrega una cantidad de fichas').notEmpty();
    req.checkBody('direccion', 'Agrega una dirección de canje').notEmpty();
    req.checkBody('empresa', 'Agrega la empresa').notEmpty();
    req.checkBody('contacto', 'Agrega el contacto para canje').notEmpty();
    req.checkBody('vencimiento', 'Agrega la fecha de vencimiento').notEmpty();
    req.checkBody('cantidad', 'La cantidad de premios no puede estar vacía').notEmpty();

   

    const errores = req.validationErrors();

    if(errores) {
        // Recargar la vista con los errores
        req.flash('error', errores.map(error => error.msg));

        res.render('nuevo-premio', {
            nombrePagina: 'Nuevo premio',
            tagline: 'Llena el formulario y publica tu premio',
            cerrarSesion: true,
            nombre : req.user.nombre,
            mensajes: req.flash()
        })
    }

    next(); // siguiente middleware
}

// muestra un premio individual
exports.mostrarPremioId = async (req, res, next) => {
    const premio = await Premios.find({ tipo: req.params.tipo });
    // si no hay resultados
    if(!premio) return next();

    res.send(premio);
}

// muestra un premio individual
exports.mostrarPremioGeneral = async (req, res, next) => {
    const premio = await Premios.find();
    // si no hay resultados
    if(!premio) return next();

    res.send(premio);
}