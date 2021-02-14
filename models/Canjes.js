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
    correo: {
       type: String,
       trim: true,
    },
    url: {
       type: String,
       lowercase:true
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