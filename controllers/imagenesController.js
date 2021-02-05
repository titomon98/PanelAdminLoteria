const mongoose = require('mongoose');
const Imagenes = mongoose.model('Imagenes');

const multer = require('multer');
const shortid = require('shortid');

exports.formularioNuevaImagen = (req, res) => {
    res.render('nueva-imagen', {
        nombrePagina: 'Nueva Imagen',
        tagline: 'Llena el formulario para ingresar nueva imagen',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

// agrega las imagenes a la base de datos
exports.agregarImagen = async (req, res) => {
    const imagen = new Imagenes(req.body);

    // almacenarlo en la base de datos
    const nuevaImagen = await imagen.save()
    // redireccionar
    res.redirect(`/imagenes/${nuevaImagen.url}`);

}

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
    req.sanitizeBody('imagen').escape();

    // validar
    req.checkBody('nombre', 'Selecciona un nombre para la imagen').notEmpty();
    req.checkBody('imagen', 'Agrega una imagen').notEmpty();

   

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