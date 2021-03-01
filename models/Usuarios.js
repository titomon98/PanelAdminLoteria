const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    rol: String,
    estado: String,
});

// Método para hashear los passwords
usuariosSchema.pre('save', async function(next) {
    // si no esta hasheado
    const hash = await md5(this.password);
    this.password = hash;
    next();
});
// Envia alerta cuando un usuario ya esta registrado
usuariosSchema.post('save', function(error, doc, next) {
    if(error.name === 'MongoError' && error.code === 11000 ){
        next('Ese correo ya esta registrado');
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Usuarios', usuariosSchema);