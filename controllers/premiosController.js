const mongoose = require('mongoose');
const Premios = mongoose.model('Premios');

const multer = require('multer');
const shortid = require('shortid');

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
exports.agregarPremio = async (req, res) => {
    const premio = new Premios(req.body);

    //temporal
    premio.ubicacion = 'para el futuro';


    // almacenarlo en la base de datos
    const nuevoPremio = await premio.save()
    // redireccionar
    res.redirect(`/premios/${nuevoPremio.url}`);

}

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
    req.sanitizeBody('imagen').escape();
    req.sanitizeBody('descripcion').escape();

    // validar
    req.checkBody('tipo', 'Selecciona un tipo de premio').notEmpty();
    req.checkBody('fichas', 'Agrega una cantidad de fichas').notEmpty();
    req.checkBody('direccion', 'Agrega una dirección de canje').notEmpty();
    req.checkBody('empresa', 'Agrega la empresa').notEmpty();
    req.checkBody('contacto', 'Agrega el contacto para canje').notEmpty();
    req.checkBody('vencimiento', 'Agrega la fecha de vencimiento').notEmpty();

   

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