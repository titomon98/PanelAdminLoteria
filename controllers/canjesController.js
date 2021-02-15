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
