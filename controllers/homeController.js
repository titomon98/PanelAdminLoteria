const mongoose = require('mongoose');


exports.mostrarTrabajos = async (req, res, next) => {

    res.render('home', {
        nombrePagina : 'Lotería de las leyendas Xtrema',
        tagline: 'Administra los recursos de la lotería',
        barra: true,
        boton: true,
    })
}