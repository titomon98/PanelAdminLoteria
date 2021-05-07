const mongoose = require('mongoose');
const Premios = mongoose.model('Premios');
const Canjes = mongoose.model('Canjes');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));

// muestra un premio individual
exports.mostrarPremioTipo = async (req, res) => {
    const premio = await Premios.find({ tipo: req.params.tipo });
    // si no hay resultados
    if (!premio) res.send('No se encontró el premio');

    res.send(premio);
}

exports.mostrarPremioDepartamento = async (req, res) => {
    const premio = await Premios.find({ departamento: req.params.departamento });
    // si no hay resultados
    if (!premio) res.send('No se encontraron premios');

    res.send(premio);
}

// muestra un premio individual
exports.mostrarPremioGeneral = async (req, res) => {
    const premio = await Premios.find({ cantidad: { $gte: 1 } }).exec();
    // si no hay resultados
    if (!premio) res.send('No se encontraron premios');
    res.send(premio);
}

// muestra un premio individual
exports.mostrarPremioGeneral2 = async (req, res) => {
    const premio = await Premios.find().sort({ creacion: -1 });
    // si no hay resultados
    if (!premio) res.send('No se encontraron premios');
    res.send(premio);
}

// muestra un premio individual
exports.mostrarPremio = async (req, res) => {
    const premio = await Premios.find({ _id: req.params.id });
    // si no hay resultados
    if (!premio) res.send('No se encontró el premio');

    res.send(premio);
}

exports.criteriosPremios = async (req, res) => {
    var premio;
    if (req.params.criterio === 'nombre') {
        premio = await Premios.find({ nombre: { $regex: '.*' + req.params.buscar + '.*' } });
    }
    else if (req.params.criterio === 'tipo') {
        premio = await Premios.find({ tipo: req.params.buscar });
    }
    else if (req.params.criterio === 'departamento') {
        premio = await Premios.find({ departamento: { $regex: '.*' + req.params.buscar + '.*' } });
    }
    else if (req.params.criterio === 'empresa') {
        premio = await Premios.find({ empresa: { $regex: '.*' + req.params.buscar + '.*' } });
    }

    // si no hay resultados
    if (!premio) res.send('No hay imágenes registradas con esos parámetros');

    res.send(premio);
}

// agrega los premios a la base de datos
exports.agregarPremio = async (req, res) => {
    const premio = new Premios(req.body);

    // almacenarlo en la base de datos
    const nuevoPremio = await premio.save()

    res.send('Premio ingresado correctamente')
}

//enviar los datos a la db
exports.actualizarPremio = async (req, res) => {
    const premio = await Premios.findById(req.body._id);

    premio.nombre = req.body.nombre;
    premio.fichas = req.body.fichas;
    premio.tipo = req.body.tipo;
    premio.descripcion = req.body.descripcion;
    premio.direccion = req.body.direccion;
    premio.contacto = req.body.contacto;
    premio.empresa = req.body.empresa;
    premio.vencimiento = req.body.vencimiento;
    premio.imagen = req.body.imagen;
    premio.imagen2 = req.body.imagen2;
    premio.imagen3 = req.body.imagen3;
    premio.imagen4 = req.body.imagen4;
    premio.cantidad = req.body.cantidad;
    premio.estado = 'Activo';
    premio.departamento = req.body.departamento;
    try {
        await premio.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

exports.desactivarPremio = async (req, res) => {
    const premio = Premios.findOneAndDelete({ _id: req.body._id }).exec();
    res.send('Eliminacion correcta')
}

exports.descontarPremio = async (req, res) => {
    const premio = await Premios.findById(req.params.id);
    //Gerson me manda en el req.body el nombre, correo y descripcion del usuario que canjeo
    if (premio.cantidad > 0) {
        try {
            premio.cantidad = premio.cantidad - 1;
            premio.save();
            const canjes = new Canjes(req.body);
            const nuevoCanje = await canjes.save();

            res.send('El premio se ha canjeado correctamente');
        } catch (error) {
            res.send('Ha ocurrido un error');
        }
    }
    else {
        res.send('Error');
    }

}