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

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 10MB ');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }
    });
}
// Opciones de Multer
const configuracionMulter = {
    limits : { fileSize : 10000000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles');
        }, 
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('guardar');

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
        res.send('Ha ocurrido un error')
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