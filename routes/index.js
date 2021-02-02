const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const premiosController = require('../controllers/premiosController');
const imagenesController = require('../controllers/imagenesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');



module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    // Crear Vacantes
    router.get('/vacantes/nueva',  
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.agregarVacante
    );

    // Mostrar Vacante (singular)
    router.get('/vacantes/:url',vacantesController.mostrarVacante );

    // Editar Vacante
    router.get('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.formEditarVacante
    );
    router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.editarVacante
    );

    // Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id', 
        vacantesController.eliminarVacante
    );

    //Crear Premios
    router.get('/premios/nuevo',  
        authController.verificarUsuario,
        premiosController.formularioNuevoPremio
    );
    router.post('/premios/nuevo', 
        authController.verificarUsuario,
        premiosController.validarPremio,
        premiosController.agregarPremio
    );

    // Mostrar Premio (singular)
    router.get('/premios/:url', premiosController.mostrarPremio);

    // Editar Premio
    router.get('/premios/editar/:url', 
        authController.verificarUsuario,
        premiosController.formEditarPremio
    );
    router.post('/premios/editar/:url', 
        authController.verificarUsuario,
        premiosController.validarPremio,
        premiosController.editarPremio
    );

    // Eliminar Premios
    router.delete('/premios/eliminar/:id', 
        premiosController.eliminarPremio
    );

    //Crear Imagenes
    router.get('/imagenes/nueva',  
        authController.verificarUsuario,
        imagenesController.formularioNuevaImagen
    );
    router.post('/imagenes/nueva', 
        authController.verificarUsuario,
        imagenesController.validarImagen,
        imagenesController.agregarImagen
    );

    // Mostrar Imagen (singular)
    router.get('/imagenes/:url', imagenesController.mostrarImagen);

    // Editar Imagen
    router.get('/imagenes/editar/:url', 
        authController.verificarUsuario,
        imagenesController.formEditarImagen
    );
    router.post('/imagenes/editar/:url', 
        authController.verificarUsuario,
        imagenesController.validarImagen,
        imagenesController.editarImagen
    );

    // Crear Cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    );

    // Autenticar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario);
    // cerrar sesion
    router.get('/cerrar-sesion',
        authController.verificarUsuario,
        authController.cerrarSesion
    );

    // Resetear password (emails)
    router.get('/reestablecer-password', authController.formReestablecerPassword);
    router.post('/reestablecer-password', authController.enviarToken);

    // Resetear Password ( Almacenar en la BD )
    router.get('/reestablecer-password/:token', authController.reestablecerPassword);
    router.post('/reestablecer-password/:token', authController.guardarPassword);


    // Panel de administración
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel
    );

    // Editar Perfil
    router.get('/editar-perfil', 
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    );
    router.post('/editar-perfil', 
        authController.verificarUsuario,
        // usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    )

    // Recibir Mensajes de Candidatos
    router.post('/vacantes/:url', 
        vacantesController.subirCV,
        vacantesController.contactar
    );

    // Muestra los candidatos por vacante
    router.get('/candidatos/:id', 
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos
    )

    // Buscador de Vacantes
    router.post('/buscador', vacantesController.buscarVacantes);


    return router;
}