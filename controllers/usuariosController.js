const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

const multer = require('multer');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();
router.use(express.static('uploads'));

exports.mostrarUsuariosGeneral = async (req, res) => {
    const usuario = await Usuarios.find();
    // si no hay resultados
    if(!usuario) res.send('No hay usuarios registrados');

    res.send(usuario);
}

exports.criteriosUsuarios = async (req, res) => {
    var usuario;
    if (req.params.criterio === 'nombre'){
        usuario = await Usuarios.find({nombre: { $regex: '.*' + req.params.buscar + '.*' } });
    }
    else if (req.params.criterio === 'correo'){
        usuario = await Usuarios.find({email: { $regex: '.*' + req.params.buscar + '.*' } });
    }
    
    // si no hay resultados
    if(!usuario) res.send('No hay usuarios registrados');

    res.send(usuario);
}

exports.crearUsuario = async (req, res) => {
    // crear el usuario
    const usuario = new Usuarios(req.body);
    usuario.estado = 'Activo';
    try {
        await usuario.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}
// Guardar cambios editar perfil
exports.actualizarUsuario = async (req, res) => {
    const usuario = await Usuarios.findById(req.body._id);
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.rol = req.body.rol;
    if(req.body.password) {
        usuario.password = req.body.password
    }
    usuario.estado = 'Activo';
    try {
        await usuario.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

exports.activarUsuario = async (req, res) => {
    const usuario = await Usuarios.findById(req.body._id);
    usuario.estado = 'Activo';
    try {
        await usuario.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('Ha ocurrido un error')
    }
}

exports.desactivarUsuario = async (req, res) => {
    const usuario = await Usuarios.findById(req.body._id);
    usuario.estado = 'Inactivo';
    try {
        await usuario.save();
        res.send('Ingreso correcto')
    } catch (error) {
        req.flash('error', error);
        res.send('error')
    }
}

// sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    // sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    // validar
    req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty();
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty();

    const errores = req.validationErrors();

    if(errores) {
        req.flash('error', errores.map(error => error.msg));

        res.render('editar-perfil', {
            nombrePagina : 'Edita tu perfil',
            usuario: req.user,
            cerrarSesion: true,
            nombre : req.user.nombre,
            imagen : req.user.imagen,
            mensajes : req.flash()
        })
    }
    next(); // todo bien, siguiente middleware!
}