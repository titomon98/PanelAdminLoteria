const mongoose = require('mongoose');
const Premios = mongoose.model('Premios');

const multer = require('multer');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));


var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dxj44eizq',
    api_key: '288216134484757',
    api_secret: 'tsARZ4LZud-EI_pr7rQaBAq9k6s'
})


var nombreImagen;
var rutaImagen;
var url;

// muestra un premio individual
exports.mostrarPremioTipo = async (req, res) => {
    const premio = await Premios.find({ tipo: req.params.tipo });
    // si no hay resultados
    if(!premio) res.send('No se encontró el premio');

    res.send(premio);
}

// muestra un premio individual
exports.mostrarPremioGeneral = async (req, res) => {
    const premio = await Premios.find();
    // si no hay resultados
    if(!premio) res.send('No se encontró el premio');

    res.send(premio);
}

// muestra un premio individual
exports.mostrarPremio = async (req, res) => {
    const premio = await Premios.find({ _id: req.params.id });
    // si no hay resultados
    if(!premio) res.send('No se encontró el premio');

    res.send(premio);
}

// agrega los premios a la base de datos
exports.agregarPremio = async (req, res) => {
    const premio = new Premios(req.body);

    //temporal
    premio.ubicacion = 'para el futuro';
    premio.imagen = 'Aqui va el link';

    // almacenarlo en la base de datos
    const nuevoPremio = await premio.save()

    url = nuevoPremio.url;
    

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
    premio.cantidad = req.body.cantidad;
    premio.estado = 'Activo';
    try {
        await premio.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

exports.descontarPremio = async (req, res) => {
    const premio = await Premios.findById(req.params._id);
    if (premio.cantidad > 0){
        premio.cantidad = premio.cantidad - 1;
        try {
            res.send('El premio se ha canjeado correctamente');
        } catch (error) {
            res.send('Ha ocurrido un error');
        }
    }
    else{
        res.send('El premio ya no se encuentra en nuestro inventario');
    }
        
}

exports.eliminarPremio = async (req, res) => {
    const { id } = req.params;

    const premio = await Premios.findById(id);

    premio.remove();
    res.status(200).send('Premio Eliminado Correctamente');    
}

