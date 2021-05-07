const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');

const empresasSchema = new mongoose.Schema({
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
    calificacion: {
        type: String,
    },
    contacto: {
        type: String,
    },
    estado: String,
});

// Método para hashear los passwords
empresasSchema.pre('save', async function (next) {
    // si no esta hasheado
    const hash = await md5(this.password);
    this.password = hash;
    next();
});
// Envia alerta cuando un usuario ya esta registrado
empresasSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Ese correo ya esta registrado');
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Empresas', empresasSchema);