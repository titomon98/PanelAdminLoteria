const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const premiosController = require('../controllers/premiosController');
const imagenesController = require('../controllers/imagenesController');
const actualizacionesController = require('../controllers/actualizacionesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const canjesController = require('../controllers/canjesController');
const municipiosController = require('../controllers/municipiosController');
const departamentosController = require('../controllers/departamentosController')
const reversoController = require('../controllers/reversoController')


module.exports = () => {

    router.get('/premios/:tipo', premiosController.mostrarPremioTipo);

    router.get('/premios/', premiosController.mostrarPremioGeneral);

    router.get('/premios/dep/:departamento', premiosController.mostrarPremioDepartamento);

    router.get('/premios/criterios/:buscar/:criterio', premiosController.criteriosPremios);

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

    router.post('/desactivar-premio', premiosController.desactivarPremio);

    router.post('/premios/descontar/:id', premiosController.descontarPremio);


    //endpoints
    //Imagen individual por id
    router.get('/imagenes/:id', imagenesController.mostrarImagenId);
    //Todas las imagenes en general
    router.get('/imagenes/', imagenesController.mostrarImagenGeneral);

    router.get('/imagenes/criterios/:buscar/:criterio', imagenesController.criteriosImagenes);

    // Mostrar Imagen (singular)
    router.get('/imagenes/:url', imagenesController.mostrarImagen);

    // Editar Imagen
    router.post('/imagenes/actualizar',
        imagenesController.actualizarImagen
    );

    //IMAGEN REVERSA
    router.get('/reverso/', reversoController.mostrarImagenGeneral);
    // Editar Imagen reversa
    router.post('/reverso/actualizar',
        reversoController.actualizarImagen
    );


    //ACTUALIZACIONES
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


    //Canjes
    router.get('/canjes', canjesController.mostrarCanjes);

    // Editar Canje
    router.post('/actualizar-canje/',
        canjesController.actualizarCanjes
    );

    router.post('/cancelar-canje/',
        canjesController.cancelarCanjes
    );

    router.post('/reactivar-canje/',
        canjesController.reactivarCanjes
    );

    //USUARIOS
    router.get('/usuarios', usuariosController.mostrarUsuariosGeneral);
    router.get('/usuarios/criterios/:buscar/:criterio', usuariosController.criteriosUsuarios);
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
    router.post('/iniciar-sesion', authController.iniciarSesion);
    // cerrar sesion
    router.get('/cerrar-sesion',
        authController.cerrarSesion
    );

    //MUNICIPIOS
    router.get('/municipios/dep/:departamento', municipiosController.mostrarMunicipioDepartamento);
    router.get('/municipios', departamentosController.mostrarMunicipios);
    router.post('/crear-municipio', municipiosController.agregarMunicipio);

    //DEPARTAMENTOS
    router.get('/departamentos', departamentosController.mostrarDepartamentosGeneral);
    router.post('/crear-departamento', departamentosController.agregarDepartamentos);

    return router;
}