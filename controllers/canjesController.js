const mongoose = require('mongoose');
const Canjes = mongoose.model('Canjes');
const multer = require('multer');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();

// muestra un premio individual
exports.mostrarCanjes = async (req, res) => {
    const canjes = await Canjes.find();
    // si no hay resultados
    if(!canjes) res.send('No se encontraron canjes');
    res.send(canjes);
}

exports.actualizarCanjes = async (req, res) => {
    const canje = await Canjes.findById(req.body._id);
    canje.nombre = req.body.nombre;
    canje.nombre_premio = req.body.nombre_premio;
    canje.departamento = req.body.departamento;
    canje.correo = req.body.correo;
    canje.descripcion = req.body.descripcion;
    canje.estado = 'Activo';
    try {
        await canje.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

exports.cancelarCanjes = async (req, res) => {
    const canje = await Canjes.findById(req.body._id);
    canje.estado = 'Inactivo';
    try {
        await canje.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

exports.reactivarCanjes = async (req, res) => {
    const canje = await Canjes.findById(req.body._id);
    canje.estado = 'Activo';
    try {
        await canje.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}
