const mongoose = require('mongoose');
const Municipios = mongoose.model('Municipios');

exports.mostrarMunicipioDepartamento = async (req, res) => {
    const municipio = await Municipios.find({ valorD: req.params.departamento });
    // si no hay resultados
    if (!municipio) res.send('No se encontraron municipios');

    res.send(municipio);
}

exports.mostrarMunicipios = async (req, res) => {
    const municipio = await Municipios.find();
    // si no hay resultados
    if (!municipio) res.send('No se encontraron municipios');

    res.send(municipio);
}

// agrega los municipios a la base de datos
exports.agregarMunicipio = async (req, res) => {
    const municipios = new Municipios(req.body);

    // almacenarlo en la base de datos
    const nuevo = await municipios.save()

    res.send('Municipio ingresado correctamente')
}