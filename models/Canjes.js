const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const canjesSchema =  new mongoose.Schema({
    nombre: {
      type: String,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    }, 
    estado: {
      type: String,
      default: 'Activo',
    },
    correo: {
       type: String,
       trim: true,
    },
    url: {
       type: String,
       lowercase:true
    },
    nombre_premio: {
      type: String,
    },
    id_premio: {
      type: String,
    },
    departamento: {
      type: String,
    },
    registro:{
      type: Date,
      default: Date.now()
    },
});

canjesSchema.pre('save', function(next) {
    // crear la url
    const url = slug(this.nombre);
    this.url = `${url}-${shortid.generate()}`;

    next();
})

// Crear un indice
canjesSchema.index({ nombre : 'text' });


module.exports = mongoose.model('Canjes', canjesSchema);