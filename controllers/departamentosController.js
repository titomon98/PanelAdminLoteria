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

exports.mostrarDepartamentoEspecifico = async (req, res) => {
    const departamento = await Departamentos.find({ departamento: req.params.dep });
    // si no hay resultados
    if (!departamento) res.send('No se encontraron premios');

    res.send(departamento);
}

exports.actualizarDepartamento = async (req, res) => {
    const departamento = await Departamentos.findById(req.body._id);
    departamento.departamento = req.body.departamento;
    try {
        await departamento.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}