const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const imagenesSchema =  new mongoose.Schema({
    nombre: {
        type: String,
        required: 'El nombre de la imagen es obligatoria',
        trim: true,
    },
    imagen: {
        type: String,
        required: 'La imagen es obligatoria',
    },
    registro:{
        type: Date,
        default: Date.now()
    },

    url : {
        type: String,
        lowercase:true
    },
});

imagenesSchema.plugin(AutoIncrement, {inc_field: 'id'});

imagenesSchema.pre('save', function(next) {

    // crear la url
    const url = slug(this.nombre);
    this.url = `${url}-${shortid.generate()}`;

    next();
})

// Crear un indice
imagenesSchema.index({ nombre : 'text' });


module.exports = mongoose.model('Imagenes', imagenesSchema);