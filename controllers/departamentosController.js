const mongoose = require('mongoose');
const Departamentos = mongoose.model('Departamentos');

exports.mostrarDepartamentosGeneral = async (req, res) => {
    const departamentos = await Departamentos.find();
    // si no hay resultados
    if (!departamentos) res.send('Ocurrió un error');
    //si si hay datos
    res.send(departamentos);
}

// agrega los premios a la base de datos
exports.agregarDepartamentos = async (req, res) => {
    const departamentos = new Departamentos(req.body);

    // almacenarlo en la base de datos
    const nuevoDepartamento = await departamentos.save()

    res.send('Departamento ingresado correctamente')
}