const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');


exports.mostrarTrabajos = async (req, res, next) => {

    const vacantes = await Vacante.find();

    if(!vacantes) return next();

    res.render('home', {
        nombrePagina : 'Lotería de las leyendas Xtrema',
        tagline: 'Administra los recursos de la lotería',
        barra: true,
        boton: true,
    })
}