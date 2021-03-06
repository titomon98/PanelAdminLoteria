const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

mongoose.connection.on('error', (error) => {
    console.log(error);
})
// importar los modelos
require('../models/Usuarios');
require('../models/Premios');
require('../models/Imagenes');
require('../models/Actualizaciones');
require('../models/Canjes');
require('../models/Departamentos');
require('../models/Municipios');
require('../models/Reversos');
require('../models/Empresas');
require('../models/Productos');