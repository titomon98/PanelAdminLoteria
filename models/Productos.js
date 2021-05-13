const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const productosSchema = new mongoose.Schema({
    fichas: {
        type: Number,
        required: 'La cantidad de fichas es obligatoria',
    },
    tipo: {
        type: String,
        required: 'El tipo de premio es obligatorio',
    },
    nombre: {
        type: String,
        required: 'El nombre del premio es obligatorio',
        trim: true,
    },
    descripcion: {
        type: String,
        required: false,
        trim: true,
    },
    direccion: {
        type: String,
        required: 'La dirección para recoger el premio es obligatoria',
        trim: true,
    },
    latitud: {
        type: String,
    },
    longitud: {
        type: String,
    },
    contacto: {
        type: String,
        required: 'El contacto del premio es obligatorio',
        trim: true,
    },
    empresa: {
        type: String,
        required: 'La empresa del premio es obligatoria',
        trim: true,
    },
    creacion: {
        type: Date,
        default: Date.now()
    },
    vencimiento: {
        type: Date,
        required: 'El vencimiento del premio es obligatorio'
    },
    imagen: {
        type: String,
        required: 'La imagen es obligatoria',
    },
    imagen2: {
        type: String,
    },
    imagen3: {
        type: String,
    },
    url: {
        type: String,
        lowercase: true
    },
    estado: {
        type: String,
        default: 'Activo',
    },
    cantidad: {
        type: Number,
        required: 'La cantidad de premios disponible es obligatoria',
    },
    pais: {
        type: String,
        default: 'Guatemala',
    },
    departamento: {
        type: String,
        required: 'El departamento es obligatorio'
    },
    municipio: {
        type: String,
        default: 'Pendiente',
    }
});

productosSchema.plugin(AutoIncrement, { inc_field: 'idProducto' });

productosSchema.pre('save', function (next) {



    // crear la url
    const url = slug(this.nombre);
    this.url = `${url}-${shortid.generate()}`;

    next();
})

// Crear un indice
productosSchema.index({ nombre: 'text' });


module.exports = mongoose.model('Productos', productosSchema);