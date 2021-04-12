const mongoose = require('mongoose');
const Municipios = mongoose.model('Municipios');

exports.mostrarMunicipioDepartamento = async (req, res) => {
    const premio = await Municipios.find({ valorD: req.params.departamento });
    // si no hay resultados
    if (!premio) res.send('No se encontraron premios');

    res.send(premio);
}

// agrega los premios a la base de datos
exports.agregarMunicipio = async (req, res) => {
    const municipios = new Municipios(req.body);

    // almacenarlo en la base de datos
    const nuevo = await municipios.save()

    res.send('Municipio ingresado correctamente')
}