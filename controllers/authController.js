const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const md5 = require('md5');
const enviarEmail = require('../handlers/email');

exports.iniciarSesion = async (req, res) => {
    const usuario = await Usuarios.findOne({ email: req.body.usuario})
    var respuesta;
    if (!usuario) respuesta = 'usuario';
    else{
        const hash = md5(req.body.password);
        if(hash === usuario.password){
            respuesta = 'bien';
        }
        else{
            respuesta = 'contra';
        }
    }

    res.send(respuesta)
}


exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Cerraste Sesión Correctamente');
    return res.redirect('/');
}

// Genera el Token en la tabla del usuario
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ email: req.body.email });
    console.log(req.body);

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // el usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    // Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    // console.log(resetUrl);

    // Enviar notificacion por email
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo: 'reset'
    });

    // Todo correcto
    req.flash('correcto', 'Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
}