const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const premiosController = require('../controllers/premiosController');
const imagenesController = require('../controllers/imagenesController');
const actualizacionesController = require('../controllers/actualizacionesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');



module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

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

     //Crear Actualizaciones
    router.get('/actualizaciones/nueva',  
        authController.verificarUsuario,
        actualizacionesController.formularioNuevaActualizacion
    );
    router.post('/actualizaciones/nueva', 
        authController.verificarUsuario,
        actualizacionesController.validarActualizacion,
        actualizacionesController.agregarActualizacion,
    );
    
    //Mostrar datos de la actualizacion
    router.get('/actualizaciones/:url', actualizacionesController.mostrarActualizacion);
    
    //Editar Actualizacion
    router.get('/actualizaciones/editar/:url', 
        authController.verificarUsuario,
        actualizacionesController.formEditarActualizacion
    );
    router.post('/actualizaciones/editar/:url', 
        authController.verificarUsuario,
        actualizacionesController.validarActualizacion,
        actualizacionesController.editarActualizacion
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
        usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    );

    //endpoints
    //Imagen individual por id
    router.get('/imagenes/:id', imagenesController.mostrarImagenId);
    //Todas las imagenes en general
    router.get('/imagenes/', imagenesController.mostrarImagenGeneral);




    return router;
}