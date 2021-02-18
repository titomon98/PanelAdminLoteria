const mongoose = require('mongoose');
const Actualizaciones = mongoose.model('Actualizaciones');

// agrega las actualizaciones a la base de datos
exports.agregarActualizacion = async (req, res) => {
    const actualizacion = new Actualizaciones(req.body);
    // almacenarlo en la base de datos
    const nuevaActualizacion = await actualizacion.save();
    // redireccionar
    res.send('Actualización agregada correctamente');
}

// muestra una actualizacion individual
exports.mostrarActualizacion = async (req, res, next) => {
    const actualizaciones = await Actualizaciones.findOne({ url: req.params.url });
    // si no hay resultados
    if(!actualizaciones) return next();

    res.render('actualizacion', {
        actualizaciones,
        nombrePagina : 'Actualización No. ' + actualizaciones.idUpd,
        barra: true,
        tagline: 'Visualiza o modifica los datos de la actualizacion',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

exports.actualizacionPlayStore = async (req, res) => {
    const actualizaciones = await Actualizaciones.find();
    if(!actualizaciones) res.send('Error');

    res.send(actualizaciones);
}


//llenar el form de editar imagen
exports.formEditarActualizacion = async (req, res, next) => {
    const actualizaciones = await Actualizaciones.findOne({ url: req.params.url});

    if(!actualizaciones) return next();

    res.render('editar-actualizacion', {
        actualizaciones,
        nombrePagina : `Editar Imagen - ${actualizaciones.nombre}`,
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

//enviar los datos a la db
exports.editarActualizacion = async (req, res) => {
    const datoActualizado = req.body;

    const actualizaciones = await Actualizaciones.findOneAndUpdate({url: req.params.url}, datoActualizado, {
        new: true,
        runValidators: true
    } );

    res.redirect(`/actualizaciones/${actualizaciones.url}`);
}

// Validar y Sanitizar los campos de los premios
exports.validarActualizacion = (req, res, next) => {

    req.sanitizeBody('descripcion').escape();
    // validar
    req.checkBody('descripcion', 'Ingresa una descripcion para la actualización').notEmpty();

    const errores = req.validationErrors();

    if(errores) {
        // Recargar la vista con los errores
        req.flash('error', errores.map(error => error.msg));

        res.render('nueva-actualizacion', {
            nombrePagina: 'Nueva Actualización',
            tagline: 'Llena el formulario y publica una actualización',
            cerrarSesion: true,
            nombre : req.user.nombre,
            mensajes: req.flash()
        })
    }

    next(); // siguiente middleware
}