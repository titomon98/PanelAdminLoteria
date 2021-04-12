const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const premiosSchema = new mongoose.Schema({
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

premiosSchema.plugin(AutoIncrement, { inc_field: 'idPremio' });

premiosSchema.pre('save', function (next) {



  // crear la url
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
})

// Crear un indice
premiosSchema.index({ nombre: 'text' });


module.exports = mongoose.model('Premios', premiosSchema);