const mongoose = require('mongoose');
const Empresas = mongoose.model('Empresas');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));

exports.mostrarEmpresasGeneral = async (req, res) => {
    const empresa = await Empresas.find();
    // si no hay resultados
    if (!empresa) res.send('No hay usuarios registrados');

    res.send(empresa);
}

