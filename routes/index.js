const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const premiosController = require('../controllers/premiosController');
const imagenesController = require('../controllers/imagenesController');
const actualizacionesController = require('../controllers/actualizacionesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const canjesController = require('../controllers/canjesController');



module.exports = () => {

    router.get('/premios/:tipo', premiosController.mostrarPremioTipo);

    router.get('/premios/', premiosController.mostrarPremioGeneral);

    router.get('/premios/dep/:departamento', premiosController.mostrarPremioDepartamento);

    router.get('/premios2/', premiosController.mostrarPremioGeneral2);

    router.get('/premios/descontar/:id', premiosController.mostrarPremio);

    //Crear Premios
    router.post('/premios/nuevo',
        premiosController.agregarPremio,
    );

    // Mostrar Premio (singular)
    router.get('/premios/:url', premiosController.mostrarPremio);

    // Editar Premio
    router.post('/premios/actualizar',
        premiosController.actualizarPremio
    );

    router.post('/premios/descontar/:id', premiosController.descontarPremio);

    // Eliminar Premios
    router.delete('/premios/eliminar/:id', 
        premiosController.eliminarPremio
    );

    //Crear Imagenes
    router.get('/imagenes/nueva',  
        imagenesController.formularioNuevaImagen
    );
    router.post('/imagenes/nueva', 
        imagenesController.validarImagen,
        imagenesController.agregarImagen
    );

    // Mostrar Imagen (singular)
    router.get('/imagenes/:url', imagenesController.mostrarImagen);

    // Editar Imagen
    router.get('/imagenes/editar/:url', 
        imagenesController.formEditarImagen
    );
    router.post('/imagenes/editar/:url', 
        imagenesController.validarImagen,
        imagenesController.editarImagen
    );

    //Enviar actualizaciones Play Store
    router.get('/actualizaciones/playstore', 
        actualizacionesController.actualizacionPlayStore
    );

     //Crear Actualizaciones
    router.post('/actualizaciones/nueva',
        actualizacionesController.agregarActualizacion,
    );
    
    //Mostrar datos de la actualizacion
    router.get('/actualizaciones/:url', actualizacionesController.mostrarActualizacion);
    
    //Editar Actualizacion
    router.get('/actualizaciones/editar/:url', 
        actualizacionesController.formEditarActualizacion
    );
    router.post('/actualizaciones/editar/:url', 
        actualizacionesController.validarActualizacion,
        actualizacionesController.editarActualizacion
    );


    //USUARIOS
    router.get('/usuarios', usuariosController.mostrarUsuariosGeneral);
    // Crear Usuarios
    router.post('/crear-usuario', 
        usuariosController.crearUsuario
    );
    router.post('/actualizar-usuario', usuariosController.actualizarUsuario);

    //Activar-desactivar
    router.post('/desactivar-usuario',
        usuariosController.desactivarUsuario
    );

    router.post('/activar-usuario',
        usuariosController.activarUsuario
    );

    // Autenticar Usuarios
    router.post('/iniciar-sesion',authController.autenticarUsuario);
    // cerrar sesion
    router.get('/cerrar-sesion',
        authController.cerrarSesion
    );

    //endpoints
    //Imagen individual por id
    router.get('/imagenes/:id', imagenesController.mostrarImagenId);
    //Todas las imagenes en general
    router.get('/imagenes/', imagenesController.mostrarImagenGeneral);

    //Canjes
    router.get('/canjes', canjesController.mostrarCanjes);


    return router;
}